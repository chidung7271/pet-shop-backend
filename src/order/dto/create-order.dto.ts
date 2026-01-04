
export class CreateOrderDto {
    customerId?: string | null;
    cartId: string;
    status: string;
}
