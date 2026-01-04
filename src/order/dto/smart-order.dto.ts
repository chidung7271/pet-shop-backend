import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SmartOrderDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsString()
    @IsOptional()
    customerId?: string;
}

export class SmartOrderResponseDto {
    success: boolean;
    message: string;
    cartItems?: Array<{
        id: string;
        name: string;
        price: number;
        imageUrl?: string;
        type: 'product' | 'service';
        quantity: number;
    }>;
    totalAmount?: number;
    extractedData?: {
        customerName?: string;
        items: Array<{
            name: string;
            quantity: number;
            type: 'product' | 'service';
            itemId?: string;
            price?: number;
            toppings?: string[];
        }>;
        paymentMethod?: string;
    };
}



