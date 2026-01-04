import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { InventoryTransactionType } from '../schema/inventory-transaction.schema';

export class CreateInventoryTransactionDto {
    @IsString()
    @IsEnum(['product', 'service'])
    itemType: string;

    @IsString()
    itemId: string;

    @IsEnum(InventoryTransactionType)
    type: InventoryTransactionType;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsOptional()
    @IsString()
    reason?: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsString()
    orderId?: string;

    @IsOptional()
    @IsString()
    performedBy?: string;
}

export class AdjustInventoryDto {
    @IsString()
    @IsEnum(['product', 'service'])
    itemType: string;

    @IsString()
    itemId: string;

    @IsNumber()
    newQuantity: number;

    @IsOptional()
    @IsString()
    reason?: string;

    @IsOptional()
    @IsString()
    note?: string;
}

export class InventoryAlertDto {
    id: string;
    name: string;
    category: string;
    currentQuantity: number;
    minThreshold: number;
    itemType: 'product' | 'service';
}
