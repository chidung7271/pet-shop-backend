import { Expose, Type } from 'class-transformer';
import { CartResponse } from '../../cart/dto/cart-response.dto';

export class OrderResponse {
    @Expose()
    id: string;

    @Expose()
    customerId: string;

    @Expose()
    @Type(() => CartResponse)
    cartId: CartResponse;

    @Expose()
    status: string;

    @Expose()
    createdAt: string;
} 