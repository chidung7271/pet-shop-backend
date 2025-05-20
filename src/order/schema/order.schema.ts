import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Schema as MongooseSchema } from "mongoose";

@Schema({
    collection: 'orders',
    timestamps: true,
    toJSON: {
        getters: true,
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
})
export class OrderSchemaClass extends Document {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Customer',
        required: false
    })
    customerId: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Cart',
        required: true
    })
    cartId: string;

    @Prop({
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    })
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
export type Order = HydratedDocument<OrderSchemaClass>;