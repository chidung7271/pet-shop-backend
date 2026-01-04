import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/product/schema/product.schema';
import { Service } from 'src/service/schema/service.schema';

@Injectable()
export class SmartOrderService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(
        private configService: ConfigService,
        @InjectModel('Product') private productModel: Model<Product>,
        @InjectModel('Service') private serviceModel: Model<Service>,
    ) {
        const apiKey = this.configService.get<string>('ai.geminiApiKey');
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        }
    }

    async processSmartOrder(text: string, customerId?: string) {
        if (!this.model) {
            throw new Error('Gemini API key not configured');
        }

        // Lấy danh sách sản phẩm và dịch vụ để cung cấp context cho AI
        const products = await this.productModel.find().select('name price imageUrl').exec();
        const services = await this.serviceModel.find().select('name price').exec();

        const systemPrompt = `Bạn là hệ thống xử lý đơn hàng thông minh cho cửa hàng thú cưng. 
Nhiệm vụ của bạn là phân tích câu nói tự nhiên và trích xuất thông tin đơn hàng theo định dạng JSON.

Danh sách sản phẩm có sẵn:
${products.map(p => `- ${p.name} (giá: ${p.price}đ)`).join('\n')}

Danh sách dịch vụ có sẵn:
${services.map(s => `- ${s.name} (giá: ${s.price}đ)`).join('\n')}

Hãy phân tích câu sau và trả về JSON với định dạng:
{
  "customerName": "Tên khách hàng (nếu có trong câu)",
  "items": [
    {
      "name": "Tên sản phẩm/dịch vụ",
      "quantity": số lượng,
      "type": "product" hoặc "service",
      "toppings": ["topping1", "topping2"] (nếu có)
    }
  ],
  "paymentMethod": "Phương thức thanh toán (nếu có)"
}

Lưu ý:
- Nếu tên sản phẩm/dịch vụ không khớp chính xác, hãy tìm sản phẩm/dịch vụ gần nhất trong danh sách
- Nếu không tìm thấy, vẫn trả về tên như trong câu nói
- Chỉ trả về JSON, không có text thêm`;

        try {
            const result = await this.model.generateContent(systemPrompt + '\n\nCâu nói: ' + text);
            const response = await result.response;
            const responseText = response.text();

            // Parse JSON từ response (có thể có markdown code block)
            let jsonText = responseText.trim();
            if (jsonText.startsWith('```json')) {
                jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            } else if (jsonText.startsWith('```')) {
                jsonText = jsonText.replace(/```\n?/g, '').trim();
            }

            const extractedData = JSON.parse(jsonText);

            // Tìm kiếm sản phẩm/dịch vụ và tạo cart items
            const cartItems: Array<{
                id: string;
                name: string;
                price: number;
                imageUrl?: string;
                type: 'product' | 'service';
                quantity: number;
            }> = [];
            let totalAmount = 0;

            for (const item of extractedData.items || []) {
                let foundItem: Product | Service | null = null;
                let itemId: string | null = null;
                let price = 0;
                let itemName = '';
                let imageUrl: string | undefined = undefined;

                if (item.type === 'product') {
                    // Tìm sản phẩm theo tên (fuzzy match)
                    foundItem = await this.findProductByName(item.name);
                } else {
                    // Tìm dịch vụ theo tên
                    foundItem = await this.findServiceByName(item.name);
                }

                if (foundItem) {
                    itemId = String((foundItem as any)._id);
                    price = foundItem.price;
                    itemName = foundItem.name;
                    if (item.type === 'product' && (foundItem as Product).imageUrl) {
                        imageUrl = (foundItem as Product).imageUrl;
                    }
                } else {
                    // Nếu không tìm thấy, sử dụng giá mặc định hoặc báo lỗi
                    throw new Error(`Không tìm thấy ${item.type === 'product' ? 'sản phẩm' : 'dịch vụ'}: ${item.name}`);
                }

                if (!itemId) {
                    throw new Error(`Không thể lấy ID cho ${item.type === 'product' ? 'sản phẩm' : 'dịch vụ'}: ${item.name}`);
                }

                cartItems.push({
                    id: itemId,
                    name: itemName,
                    price: price,
                    imageUrl: imageUrl,
                    type: item.type as 'product' | 'service',
                    quantity: item.quantity || 1,
                });

                totalAmount += price * (item.quantity || 1);
            }

            return {
                success: true,
                message: 'Đã phân tích câu nói thành công. Vui lòng xem lại giỏ hàng.',
                cartItems: cartItems,
                totalAmount: totalAmount,
                extractedData: {
                    ...extractedData,
                },
            };
        } catch (error) {
            throw new Error(`Lỗi xử lý đơn hàng thông minh: ${error.message}`);
        }
    }

    private async findProductByName(name: string): Promise<Product | null> {
        // Tìm chính xác
        let product = await this.productModel.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
        }).exec();

        if (!product) {
            // Tìm gần đúng (chứa tên)
            product = await this.productModel.findOne({
                name: { $regex: new RegExp(name, 'i') },
            }).exec();
        }

        return product;
    }

    private async findServiceByName(name: string): Promise<Service | null> {
        // Tìm chính xác
        let service = await this.serviceModel.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
        }).exec();

        if (!service) {
            // Tìm gần đúng (chứa tên)
            service = await this.serviceModel.findOne({
                name: { $regex: new RegExp(name, 'i') },
            }).exec();
        }

        return service;
    }
}

