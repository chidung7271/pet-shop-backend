import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

@Schema({
    timestamps: true,
    toJSON: {
        getters: true,
    },
})
export class OrderSchemaClass extends Document {
    @Prop({
        type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: false
    })
    customerId: string;

    @Prop({
        type: [
            {
                type: { type: String, enum: ['product', 'service'], required: true },
                itemId: { type: MongooseSchema.Types.ObjectId, required: true },
                quantity: { type: Number, required: true },
                pet: { type: MongooseSchema.Types.ObjectId, ref: 'Pet' },
            },
        ],
        required: true,
    })
    items: {
        type: 'product' | 'service';
        itemId: string;
        quantity: number;
        pet?: string;
    }[];

    @Prop()
    totalAmount: number;

    @Prop()
    status: string;

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
export const OrderSchema = SchemaFactory.createForClass(OrderSchemaClass);