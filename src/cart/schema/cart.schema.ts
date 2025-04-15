import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
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
    customerId: string;

    @Prop({
        type:[CartItemSchema]
    })
    items: CartItemSchemaClass[];
    @Prop()
    price: number;

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