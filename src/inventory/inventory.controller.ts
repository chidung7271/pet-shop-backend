import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AdjustInventoryDto, CreateInventoryTransactionDto } from './dto/inventory.dto';
import { InventoryService } from './inventory.service';
import { InventoryTransactionType } from './schema/inventory-transaction.schema';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}

    // Lấy tất cả giao dịch kho
    @Get('transactions')
    async getAllTransactions(
        @Query('itemType') itemType?: string,
        @Query('itemId') itemId?: string,
        @Query('type') type?: InventoryTransactionType,
        @Query('limit') limit?: number,
    ) {
        return this.inventoryService.getAllTransactions(
            itemType,
            itemId,
            type,
            limit ? parseInt(limit.toString()) : 100,
        );
    }

    // Lấy lịch sử giao dịch của một item
    @Get('transactions/:itemType/:itemId')
    async getTransactionsByItem(
        @Param('itemType') itemType: string,
        @Param('itemId') itemId: string,
    ) {
        return this.inventoryService.getTransactionsByItem(itemType, itemId);
    }

    // Nhập kho
    @Post('import')
    async importStock(@Body() dto: CreateInventoryTransactionDto) {
        return this.inventoryService.importStock(dto);
    }

    // Xuất kho
    @Post('export')
    async exportStock(@Body() dto: CreateInventoryTransactionDto) {
        return this.inventoryService.exportStock(dto);
    }

    // Điều chỉnh số lượng kho
    @Patch('adjust')
    async adjustStock(@Body() dto: AdjustInventoryDto) {
        return this.inventoryService.adjustStock(dto);
    }

    // Lấy danh sách cảnh báo hết hàng
    @Get('alerts')
    async getLowStockAlerts(@Query('threshold') threshold?: number) {
        return this.inventoryService.getLowStockAlerts(
            threshold ? parseInt(threshold.toString()) : 10,
        );
    }

    // Thống kê nhập/xuất
    @Get('stats')
    async getInventoryStats(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.inventoryService.getInventoryStats(start, end);
    }
}
