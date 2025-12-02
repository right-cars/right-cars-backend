import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuctionDocument = Auction & Document;

@Schema({ timestamps: true })
export class Auction {
  @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
  car: Types.ObjectId;

  @Prop({ required: true })
  startDate: string;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endDate: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true })
  startPrice: number;

  @Prop({ default: 0 })
  currentPrice: number;

  @Prop({ default: 60 })
  bidExtensionTime: number;

  @Prop({ default: 'scheduled', enum: ['scheduled', 'active', 'finished', 'cancelled'] })
  status: string;

  @Prop({ type: Array, default: [] })
  bids: any[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  winner?: Types.ObjectId;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
