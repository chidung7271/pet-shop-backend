import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { CustomerSchemaClass } from "../../customer/schema/customer.schema";
import { CartItemSchema, CartItemSchemaClass } from "./cartitem.schema";

@Schema({
    timestamps: true,
    toJSON: {
        getters: true,
    },
})
export class CartSchemaClass extends Document {
    @Prop({
        type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: false
    })
    customerId: CustomerSchemaClass;

    @Prop({
        type:[CartItemSchema]
    })
    items: CartItemSchemaClass[];

    @Prop()
    totalAmount: number;
    
    @Prop({
        get: (val: Date) => {
            return val
                ? val.toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                })
                : null;
        },
    })
    readonly createdAt: Date;

}
export const CartSchema = SchemaFactory.createForClass(CartSchemaClass);
export type Cart = HydratedDocument<CartSchemaClass>;