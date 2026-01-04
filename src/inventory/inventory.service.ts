import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductSchemaClass } from '../product/schema/product.schema';
import { ServiceSchemaClass } from '../service/schema/service.schema';
import { AdjustInventoryDto, CreateInventoryTransactionDto, InventoryAlertDto } from './dto/inventory.dto';
import { InventoryTransaction, InventoryTransactionType } from './schema/inventory-transaction.schema';

@Injectable()
export class InventoryService {
    constructor(
        @InjectModel('InventoryTransaction') private inventoryTransactionModel: Model<InventoryTransaction>,
        @InjectModel('Product') private productModel: Model<ProductSchemaClass>,
        @InjectModel('Service') private serviceModel: Model<ServiceSchemaClass>,
    ) {}

    // Lấy tất cả lịch sử giao dịch kho
    async getAllTransactions(
        itemType?: string,
        itemId?: string,
        type?: InventoryTransactionType,
        limit: number = 100,
    ): Promise<InventoryTransaction[]> {
        const query: any = {};
        
        if (itemType) query.itemType = itemType;
        if (itemId) query.itemId = itemId;
        if (type) query.type = type;

        return this.inventoryTransactionModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }

    // Lấy lịch sử giao dịch của một item cụ thể
    async getTransactionsByItem(itemType: string, itemId: string): Promise<InventoryTransaction[]> {
        return this.inventoryTransactionModel
            .find({ itemType, itemId })
            .sort({ createdAt: -1 })
            .exec();
    }

    // Nhập kho
    async importStock(dto: CreateInventoryTransactionDto): Promise<InventoryTransaction> {
        const item = await this.getItem(dto.itemType, dto.itemId);
        if (!item) {
            throw new NotFoundException(`${dto.itemType} not found`);
        }

        const previousQuantity = item.quantity || 0;
        const newQuantity = previousQuantity + dto.quantity;

        // Cập nhật số lượng
        await this.updateItemQuantity(dto.itemType, dto.itemId, newQuantity);

        // Tạo bản ghi giao dịch
        const transaction = new this.inventoryTransactionModel({
            itemType: dto.itemType,
            itemId: dto.itemId,
            itemName: item.name,
            type: InventoryTransactionType.IMPORT,
            quantity: dto.quantity,
            previousQuantity,
            newQuantity,
            reason: dto.reason,
            note: dto.note,
            performedBy: dto.performedBy,
        });

        return transaction.save();
    }

    // Xuất kho
    async exportStock(dto: CreateInventoryTransactionDto): Promise<InventoryTransaction> {
        const item = await this.getItem(dto.itemType, dto.itemId);
        if (!item) {
            throw new NotFoundException(`${dto.itemType} not found`);
        }

        const previousQuantity = item.quantity || 0;
        if (previousQuantity < dto.quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        const newQuantity = previousQuantity - dto.quantity;

        // Cập nhật số lượng
        await this.updateItemQuantity(dto.itemType, dto.itemId, newQuantity);

        // Tạo bản ghi giao dịch
        const transaction = new this.inventoryTransactionModel({
            itemType: dto.itemType,
            itemId: dto.itemId,
            itemName: item.name,
            type: InventoryTransactionType.EXPORT,
            quantity: dto.quantity,
            previousQuantity,
            newQuantity,
            reason: dto.reason,
            note: dto.note,
            orderId: dto.orderId,
            performedBy: dto.performedBy,
        });

        return transaction.save();
    }

    // Điều chỉnh kho (adjustment)
    async adjustStock(dto: AdjustInventoryDto): Promise<InventoryTransaction> {
        const item = await this.getItem(dto.itemType, dto.itemId);
        if (!item) {
            throw new NotFoundException(`${dto.itemType} not found`);
        }

        const previousQuantity = item.quantity || 0;
        const difference = dto.newQuantity - previousQuantity;

        // Cập nhật số lượng
        await this.updateItemQuantity(dto.itemType, dto.itemId, dto.newQuantity);

        // Tạo bản ghi giao dịch
        const transaction = new this.inventoryTransactionModel({
            itemType: dto.itemType,
            itemId: dto.itemId,
            itemName: item.name,
            type: InventoryTransactionType.ADJUSTMENT,
            quantity: Math.abs(difference),
            previousQuantity,
            newQuantity: dto.newQuantity,
            reason: dto.reason || (difference > 0 ? 'Increase stock' : 'Decrease stock'),
            note: dto.note,
            performedBy: 'System',
        });

        return transaction.save();
    }

    // Ghi nhận bán hàng (tự động từ order)
    async recordSale(
        itemType: string,
        itemId: string,
        quantity: number,
        orderId: string,
    ): Promise<InventoryTransaction> {
        const item = await this.getItem(itemType, itemId);
        if (!item) {
            throw new NotFoundException(`${itemType} not found`);
        }

        const previousQuantity = item.quantity || 0;
        const newQuantity = Math.max(0, previousQuantity - quantity);

        // Cập nhật số lượng
        await this.updateItemQuantity(itemType, itemId, newQuantity);

        // Tạo bản ghi giao dịch
        const transaction = new this.inventoryTransactionModel({
            itemType,
            itemId,
            itemName: item.name,
            type: InventoryTransactionType.SALE,
            quantity,
            previousQuantity,
            newQuantity,
            reason: 'Sale',
            orderId,
            performedBy: 'System',
        });

        return transaction.save();
    }

    // Lấy danh sách cảnh báo hết hàng
    async getLowStockAlerts(threshold: number = 10): Promise<InventoryAlertDto[]> {
        const alerts: InventoryAlertDto[] = [];

        // Kiểm tra products
        const lowStockProducts = await this.productModel
            .find({ quantity: { $lte: threshold } })
            .exec();

        for (const product of lowStockProducts) {
            alerts.push({
                id: (product._id as any).toString(),
                name: product.name,
                category: product.category || 'N/A',
                currentQuantity: product.quantity || 0,
                minThreshold: threshold,
                itemType: 'product',
            });
        }

        // Kiểm tra services (nếu có quantity)
        const lowStockServices = await this.serviceModel
            .find({ quantity: { $lte: threshold } })
            .exec();

        for (const service of lowStockServices) {
            alerts.push({
                id: (service._id as any).toString(),
                name: service.name,
                category: service.category || 'N/A',
                currentQuantity: service.quantity || 0,
                minThreshold: threshold,
                itemType: 'service',
            });
        }

        return alerts;
    }

    // Thống kê nhập/xuất theo thời gian
    async getInventoryStats(startDate?: Date, endDate?: Date) {
        const query: any = {};
        
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = startDate;
            if (endDate) query.createdAt.$lte = endDate;
        }

        const transactions = await this.inventoryTransactionModel.find(query).exec();

        const stats = {
            totalImports: 0,
            totalExports: 0,
            totalSales: 0,
            totalAdjustments: 0,
            importQuantity: 0,
            exportQuantity: 0,
            salesQuantity: 0,
        };

        transactions.forEach(transaction => {
            switch (transaction.type) {
                case InventoryTransactionType.IMPORT:
                    stats.totalImports++;
                    stats.importQuantity += transaction.quantity;
                    break;
                case InventoryTransactionType.EXPORT:
                    stats.totalExports++;
                    stats.exportQuantity += transaction.quantity;
                    break;
                case InventoryTransactionType.SALE:
                    stats.totalSales++;
                    stats.salesQuantity += transaction.quantity;
                    break;
                case InventoryTransactionType.ADJUSTMENT:
                    stats.totalAdjustments++;
                    break;
            }
        });

        return stats;
    }

    // Helper methods
    private async getItem(itemType: string, itemId: string): Promise<any> {
        if (itemType === 'product') {
            return this.productModel.findById(itemId).exec();
        } else if (itemType === 'service') {
            return this.serviceModel.findById(itemId).exec();
        }
        return null;
    }

    private async updateItemQuantity(itemType: string, itemId: string, newQuantity: number): Promise<void> {
        if (itemType === 'product') {
            await this.productModel.findByIdAndUpdate(itemId, { quantity: newQuantity }).exec();
        } else if (itemType === 'service') {
            await this.serviceModel.findByIdAndUpdate(itemId, { quantity: newQuantity }).exec();
        }
    }
}
