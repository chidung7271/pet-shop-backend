import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Schema as MongooseSchema } from "mongoose";

@Schema({
    timestamps: true,
    toJSON: {
        getters: true,
    },
})
export class PetSchemaClass extends Document {

    @Prop({
        type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true
    })
    ownerId: string;

    @Prop({
        required: true,
    })
    name: string;

    @Prop()
    type: string;

    @Prop()
    breed: string;

    @Prop()
    weight: number;

    @Prop()
    des: string;

    @Prop()
    isActive: boolean;

    @Prop()
    image: string;
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
export const PetSchema = SchemaFactory.createForClass(PetSchemaClass);
export type Pet = HydratedDocument<PetSchemaClass>;