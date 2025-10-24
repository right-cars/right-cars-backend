import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Req,
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { PlaceBidDto } from './dto/place-bid.dto';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  create(@Body() dto: CreateAuctionDto) {
    return this.auctionsService.create(dto);
  }

  @Get('active')
  getActive() {
    return this.auctionsService.getActiveAuctions();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.auctionsService.findById(id);
  }

  @Post(':id/bid')
  async placeBid(
    @Param('id') id: string,
    @Body() dto: PlaceBidDto,
    @Req() req: any,
  ) {
    // Для примера используем req.user?.id — интегрируй свою auth логику
    const userId = req.user?.id || '000000000000000000000000';
    return this.auctionsService.placeBid(id, userId, dto.amount);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.auctionsService.cancelAuction(id);
  }
}
