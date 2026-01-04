import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class VerificationCode extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true, type: Date })
  expiresAt: Date;

  @Prop({ default: false })
  used: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: string;
}

export const VerificationCodeSchema = SchemaFactory.createForClass(VerificationCode);
export type VerificationCodeDocument = HydratedDocument<VerificationCode>;
