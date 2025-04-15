import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

@Schema({
    timestamps: true,
    toJSON: {
        getters: true,
    },
})
export class CartItemSchemaClass extends Document {
    @Prop({ type: String, enum: ['product', 'service'], required: true })
    type: 'product' | 'service';

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
    itemId: string; // ID của sản phẩm hoặc dịch vụ

    @Prop({ type: Number, required: true })
    quantity: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pet' })
    pet?: string; // Nếu là dịch vụ thì có thể liên quan đến thú cưng
}
export const CartItemSchema = SchemaFactory.createForClass(CartItemSchemaClass);