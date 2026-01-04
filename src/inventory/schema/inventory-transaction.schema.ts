import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

export enum InventoryTransactionType {
    IMPORT = 'import',
    EXPORT = 'export',
    ADJUSTMENT = 'adjustment',
    SALE = 'sale',
    RETURN = 'return',
}

@Schema({
    timestamps: true,
    toJSON: {
        getters: true,
    },
})
export class InventoryTransactionSchemaClass extends Document {
    @Prop({
        required: true,
        enum: ['product', 'service'],
    })
    itemType: string;

    @Prop({
        required: true,
    })
    itemId: string;

    @Prop({
        required: true,
    })
    itemName: string;

    @Prop({
        required: true,
        enum: Object.values(InventoryTransactionType),
    })
    type: InventoryTransactionType;

    @Prop({
        required: true,
    })
    quantity: number;

    @Prop({
        required: true,
    })
    previousQuantity: number;

    @Prop({
        required: true,
    })
    newQuantity: number;

    @Prop()
    reason: string;

    @Prop()
    note: string;

    @Prop()
    orderId: string;

    @Prop()
    performedBy: string;

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

export const InventoryTransactionSchema = SchemaFactory.createForClass(InventoryTransactionSchemaClass);
export type InventoryTransaction = HydratedDocument<InventoryTransactionSchemaClass>;
