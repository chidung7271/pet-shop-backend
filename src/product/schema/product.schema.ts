import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

@Schema({
    timestamps: true,
    toJSON: {
        getters: true,
    },
})
export class ProductSchemaClass extends Document {

    @Prop({
        required: true,
    })
    name: string;

    @Prop()
    category: string;

    @Prop()
    quantity: number;

    @Prop()
    price: number;

    @Prop()
    des: string;

    @Prop()
    imageUrl: string;
    
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
export const ProductSchema = SchemaFactory.createForClass(ProductSchemaClass);
export type Product = HydratedDocument<ProductSchemaClass>;
