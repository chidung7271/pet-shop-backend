import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

@Schema({
    timestamps: true,
    toJSON: {
        getters: true,
    },
})
export class UserSchemaClass extends Document {
    @Prop()
    username: string;

    @Prop()
    password: string;
    
    @Prop()
    email: string;
    
    @Prop()
    refreshToken?: string;
    
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
export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);
export type User = HydratedDocument<UserSchemaClass>;