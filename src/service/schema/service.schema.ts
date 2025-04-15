import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    timestamps: true,
    toJSON: {
        getters: true,
    },
})
export class ServiceSchemaClass extends Document {

    @Prop({
        required: true,
    })
    name: string;

    @Prop()
    category: string;

    @Prop()
    quanlity: number;

    @Prop()
    price: number;

    @Prop()
    supplier: string;

    @Prop()
    des: string;
    
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
export const ServiceSchema = SchemaFactory.createForClass(ServiceSchemaClass);