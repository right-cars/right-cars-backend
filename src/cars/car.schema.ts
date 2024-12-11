import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CarDocument = Car & Document;

@Schema({ versionKey: false, timestamps: true })
export class Car {
  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  km: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  fuel: string;

  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  transmission: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  drive_type: string;

  @Prop({ required: true })
  finance: string;

  @Prop({ required: true })
  fuel_consumption: string;

  @Prop({ required: true })
  body_type: string;

  @Prop({ required: true })
  engine_capacity: string;

  @Prop({ required: true })
  variant: string;

  @Prop({ required: true })
  number_of_seats: string;

  @Prop({ required: true })
  colour: string;

  @Prop({ required: true })
  number_of_doors: string;

  @Prop({ required: true })
  stock_number: string;

  @Prop({ required: true })
  vehicle_service_history: string;

  // @Prop({ required: true })
  @Prop()
  roadworthy_voucher: string;

  @Prop({ required: true })
  spare_key: string;

  // @Prop({ required: true })
  @Prop()
  condition_report: string;

  @Prop({ required: true })
  warranty: string;

  @Prop({ required: true })
  kilowatts: string;

  @Prop({ required: true })
  cylinder_layout: string;

  @Prop({ required: true })
  gears: string;

  @Prop()
  feature_1?: string;

  @Prop()
  feature_2?: string;

  @Prop()
  feature_3?: string;

  @Prop()
  feature_4?: string;

  @Prop()
  feature_5?: string;

  @Prop()
  feature_6?: string;

  // @Prop({ type: [String], required: true })
  @Prop({ type: [String] })
  images: string[];

  @Prop()
  video?: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ default: 'cars' })
  type: string;
}

export const CarSchema = SchemaFactory.createForClass(Car);
