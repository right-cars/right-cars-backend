import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ default: 'unverified' })
  status: string;

  @Prop({ default: 'regular' })
  type: string;

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

  @Prop()
  physicalAddress?: string;

  @Prop()
  suburb?: string;

  @Prop()
  cityOrTown?: string;

  @Prop()
  code?: string;

  @Prop()
  postalPhysicalAddress?: string;

  @Prop()
  postalSuburb?: string;

  @Prop()
  postalCityOrTown?: string;

  @Prop()
  postalCode?: string;

  @Prop()
  idOrDriverLicence?: string;

  @Prop()
  proofOfPhysicalAddress?: string;

  @Prop()
  deposit?: number;

  @Prop({ default: false })
  isEmailConfirmed: boolean;

  @Prop()
  emailConfirmationToken: string;

  @Prop()
  resetToken?: string;

  @Prop()
  resetTokenExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
