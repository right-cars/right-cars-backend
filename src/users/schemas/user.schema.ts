import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true, unique: true })
  mobileNumber: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isEmailConfirmed: boolean;

  @Prop()
  emailConfirmationToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
