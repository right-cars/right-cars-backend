import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateAuctionDto {
  @IsMongoId()
  car: string;

  @IsString()
  startDate: string;

  @IsString()
  startTime: string;

  @IsString()
  endDate: string;

  @IsString()
  endTime: string;

  @IsNumber()
  @Min(0)
  startPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bidExtensionTime?: number;
}
