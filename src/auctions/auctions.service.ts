import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Auction, AuctionDocument } from './schemas/auction.schema';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { CarsService } from '../cars/cars.service';

@Injectable()
export class AuctionsService {
  private readonly logger = new Logger(AuctionsService.name);

  constructor(
    @InjectModel(Auction.name)
    private readonly auctionModel: Model<AuctionDocument>,
    private readonly carsService: CarsService,
  ) {}

  /**
   * Создание нового аукциона
   */
  async create(dto: CreateAuctionDto): Promise<Auction> {
    // Проверяем машину
    const car = await this.carsService.findById(dto.car);
    if (!car) throw new NotFoundException('Car not found');
    if (car.isOnAuction)
      throw new BadRequestException('Car already on auction');

    // Создаем аукцион (всё храним как строки)
    const auction = new this.auctionModel({
      car: new Types.ObjectId(dto.car),
      startDate: dto.startDate,
      startTime: dto.startTime,
      endDate: dto.endDate,
      endTime: dto.endTime,
      startPrice: dto.startPrice,
      currentPrice: dto.startPrice,
      bidExtensionTime: dto.bidExtensionTime ?? 60,
      status: 'scheduled',
      bids: [],
    });

    // Помечаем машину как участвующую в аукционе
    await this.carsService.setAuctionFlag(dto.car, true);

    this.logger.log(`Auction created for car ${dto.car}`);
    return auction.save();
  }

  /**
   * Получение аукциона по ID
   */
  async findById(id: string): Promise<Auction> {
    const auction = await this.auctionModel.findById(id).populate('car');
    if (!auction) throw new NotFoundException('Auction not found');
    return auction;
  }

  /**
   * Получение всех активных аукционов
   */
  async getActiveAuctions(): Promise<Auction[]> {
    return this.auctionModel.find({ status: 'active' }).populate('car');
  }

  /**
   * Сделать ставку
   */
  async placeBid(
    auctionId: string,
    userId: string,
    amount: number,
  ): Promise<Auction> {
    const auction = await this.auctionModel.findById(auctionId);
    if (!auction) throw new NotFoundException('Auction not found');

    if (auction.status !== 'active')
      throw new BadRequestException('Auction is not active');

    if (amount <= auction.currentPrice)
      throw new BadRequestException('Bid must be higher than current price');

    // Добавляем ставку в список
    const bid = {
      user: new Types.ObjectId(userId),
      amount,
      timestamp: new Date().toISOString(),
    };
    (auction as any).bids.push(bid);
    auction.currentPrice = amount;

    await auction.save();
    this.logger.log(
      `Bid placed: ${amount} by user ${userId} on auction ${auctionId}`,
    );
    return auction;
  }

  /**
   * Отмена аукциона
   */
  async cancelAuction(auctionId: string): Promise<Auction> {
    const auction = await this.auctionModel.findById(auctionId);
    if (!auction) throw new NotFoundException('Auction not found');

    if (auction.status === 'finished')
      throw new BadRequestException('Auction already finished');

    auction.status = 'cancelled';
    await auction.save();

    // Снимаем флаг у машины
    await this.carsService.setAuctionFlag(auction.car.toString(), false);

    this.logger.warn(`Auction ${auctionId} cancelled`);
    return auction;
  }

  /**
   * Завершить аукцион вручную (MVP — без cron)
   */
  async finishAuction(auctionId: string): Promise<Auction> {
    const auction = await this.auctionModel.findById(auctionId);
    if (!auction) throw new NotFoundException('Auction not found');
    if (auction.status !== 'active')
      throw new BadRequestException('Auction not active');

    let winnerId: Types.ObjectId | null = null;
    let maxAmount = auction.startPrice;

    for (const b of (auction as any).bids) {
      if (b.amount > maxAmount) {
        maxAmount = b.amount;
        winnerId = b.user;
      }
    }

    auction.status = 'finished';
    auction.currentPrice = maxAmount;
    (auction as any).winner = winnerId ?? null;

    await auction.save();
    await this.carsService.setAuctionFlag(auction.car.toString(), false);

    this.logger.log(
      `Auction ${auctionId} finished. Winner: ${winnerId}, price: ${maxAmount}`,
    );

    return auction;
  }
}
