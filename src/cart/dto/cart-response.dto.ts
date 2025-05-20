import { Expose, Transform, Type } from 'class-transformer';

export class CartItemResponse {
    @Expose()
    type: 'product' | 'service';

    @Expose()
    itemId: string;

    @Expose()
    quantity: number;

    @Expose()
    price: number;

    @Expose()
    pet?: string;
}

export class CartResponse {
    @Expose()
    id: string;

    @Expose()
    @Transform(({ obj }) => {
        if (obj.customerId && typeof obj.customerId === 'object') {
            return obj.customerId._id || obj.customerId.id;
        }
        return obj.customerId;
    })
    customerId: string;

    @Expose()
    @Type(() => CartItemResponse)
    items: CartItemResponse[];

    @Expose()
    totalAmount: number;

    @Expose()
    createdAt: string;
}