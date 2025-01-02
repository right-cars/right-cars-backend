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

  @Prop({ default: 'car' })
  type: string;

  @Prop()
  fuel_consumption: string;

  @Prop({ required: true })
  body_type: string;

  @Prop()
  engine_capacity: string;

  @Prop()
  variant: string;

  @Prop()
  number_of_seats: string;

  @Prop()
  colour: string;

  @Prop()
  number_of_doors: string;

  @Prop({ required: true })
  stock_number: string;

  @Prop()
  vehicle_service_history: string;

  // @Prop({ required: true })
  @Prop()
  roadworthy_voucher: string;

  @Prop()
  spare_key: boolean;

  // @Prop({ required: true })
  @Prop()
  condition_report: string;

  @Prop()
  warranty: boolean;

  @Prop()
  kilowatts: string;

  @Prop()
  cylinder_layout: string;

  @Prop()
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
}

export const CarSchema = SchemaFactory.createForClass(Car);
