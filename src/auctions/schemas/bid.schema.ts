import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BidDocument = Bid & Document;

@Schema({ timestamps: true })
export class Bid {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
