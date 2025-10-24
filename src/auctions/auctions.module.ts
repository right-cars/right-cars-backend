import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { Auction, AuctionSchema } from './schemas/auction.schema';
import { Bid, BidSchema } from './schemas/bid.schema';
import { CarsModule } from '../cars/cars.module';

@Module({
imports: [
MongooseModule.forFeature([
{ name: Auction.name, schema: AuctionSchema },
{ name: Bid.name, schema: BidSchema },
]),
forwardRef(() => CarsModule),
],
controllers: [AuctionsController],
providers: [AuctionsService],
exports: [AuctionsService],
})
export class AuctionsModule {}