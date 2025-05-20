import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

@Schema({
    timestamps: true,
    toJSON: {
        getters: true,
    },
})
export class CustomerSchemaClass extends Document {
    @Prop({
        type: String,
        required: true,
    })
    name: string;

    @Prop({
        type: String,
    })
    email: string;

    @Prop({
        type: String,
    })
    phone: string;

    @Prop({
        type: String,
    })

    gender: string;

    @Prop({
        type: Boolean,
    })
    isActive: boolean;
    
    
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
export const CustomerSchema = SchemaFactory.createForClass(CustomerSchemaClass);
export type Customer = HydratedDocument<CustomerSchemaClass>;