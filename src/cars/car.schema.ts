import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CarDocument = Car & Document;

@Schema({ versionKey: false, timestamps: true })
export class Car {
  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  mileageInKm: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  fuelType: string;

  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  transmission: string;

  @Prop({ required: true })
  price: string;

  @Prop()
  driveType?: string;

  @Prop()
  finance?: string;

  @Prop({ default: 'car' })
  vehicleCategory: string;

  @Prop()
  fuelConsumption?: string;

  @Prop({ required: true })
  bodyType: string;

  @Prop()
  engineCapacity?: string;

  @Prop()
  variant?: string;

  @Prop()
  numberOfSeats?: string;

  @Prop()
  colour?: string;

  @Prop()
  numberOfDoors?: string;

  @Prop({ required: true })
  stockNumber?: string;

  @Prop()
  vehicleServiceHistory?: string;

  @Prop()
  dekraReport?: string;

  @Prop()
  spareKey?: boolean;

  @Prop()
  conditionReport?: string;

  @Prop()
  warranty?: boolean;

  @Prop()
  kilowatts?: string;

  @Prop()
  cylinderLayout?: string;

  @Prop()
  gears?: string;

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

  @Prop()
  mainImage: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop()
  video?: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  description?: string;

  @Prop()
  tummCode?: string;

  @Prop()
  registrationNumber?: string;

  @Prop({ default: false })
  isOnAuction: boolean;
}

export const CarSchema = SchemaFactory.createForClass(Car);
