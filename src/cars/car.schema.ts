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

  @Prop({ default: 'Cars' })
  vehicleCategory: string;

  @Prop()
  fuelConsumption?: string;

  @Prop({ required: true })
  bodyType: string;

  @Prop()
  engineCapacityInCc?: string;

  @Prop()
  variant?: string;

  @Prop()
  seats?: string;

  @Prop()
  colour?: string;

  @Prop()
  doors?: string;

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

  @Prop({ type: [String] })
  features?: string;

  @Prop({ type: [String] })
  imageUrls: string[];

  @Prop()
  video?: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  autotraderId?: number;

  @Prop()
  description?: string;

  @Prop()
  transmissionDrive?: string;

  @Prop()
  dealerId?: number;

  @Prop()
  dealerLogoUrl?: string;

  @Prop()
  tummCode?: number;

  @Prop()
  registrationNumber?: string;

  @Prop({ type: Object })
  dealerContactInformation?: object;
}

export const CarSchema = SchemaFactory.createForClass(Car);
