import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';

export class CartItemDto {
    @IsNotEmpty()
    type: 'product' | 'service';

    @IsMongoId()
    @IsNotEmpty()
    itemId: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsMongoId()
    @IsOptional()
    pet?: string;
}

export class CreateCartDto {
    @IsMongoId()
    @IsOptional()
    customerId?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    items: CartItemDto[];

    @IsNumber()
    @IsNotEmpty()
    totalAmount: number;
}
