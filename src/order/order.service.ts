import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateServiceResponseDto } from 'src/service/dto/create-service-response.dto';
import { Cart } from '../cart/schema/cart.schema';
import { InventoryService } from '../inventory/inventory.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './schema/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectModel('Cart') private cartModel: Model<Cart>,
    private inventoryService: InventoryService,
  ) {}
  
  async create(createOrderDto: CreateOrderDto): Promise<any> {
    const newOrder = new this.orderModel(createOrderDto);
    const savedOrder = await newOrder.save();
    
    // Ghi nhận bán hàng vào inventory khi order có status pending hoặc completed
    // CHỈ ghi nhận cho PRODUCT, không ghi nhận cho SERVICE (dịch vụ không cần quản lý kho)
    if (createOrderDto.status === 'pending' || createOrderDto.status === 'completed') {
      try {
        const cart = await this.cartModel.findById(createOrderDto.cartId).exec();
        if (cart && cart.items && cart.items.length > 0) {
          // Ghi nhận từng item trong cart vào inventory (CHỈ products)
          for (const item of cart.items) {
            // Chỉ ghi nhận inventory cho sản phẩm, bỏ qua dịch vụ
            if (item.type === 'product') {
              await this.inventoryService.recordSale(
                item.type,
                item.itemId.toString(),
                item.quantity,
                (savedOrder._id as any).toString(),
              );
            }
          }
        }
      } catch (error) {
        console.error('Error recording sale in inventory:', error);
        // Không throw error để không làm fail việc tạo order
      }
    }
    
    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.orderModel.find();
    if (!orders || orders.length === 0) {
      return orders
    }
    return orders;
  }

  async findOne(id: string)  {
    const order = await this.orderModel.findById(id);
    if (!order) {
      return `Order not found`;
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<CreateServiceResponseDto> {
    const order = await this.orderModel.findById(id);
    if (!order) {
      return {
        success: false,
        message: `Order not found`,
      };
    }
    await this.orderModel.updateOne({ _id: id }, updateOrderDto);
    return {
      success: true,
      message: `Order updated successfully`,
    };
  }

  async remove(id: string): Promise<CreateServiceResponseDto> {
    const order = await this.orderModel.findById(id);
    if (!order) {
      return {
        success: false,
        message: `Order not found`,
      };
    }
    await this.orderModel.deleteOne({ _id: id });
    return {
      success: true,
      message: `Order deleted successfully`,
    };
  }
}
