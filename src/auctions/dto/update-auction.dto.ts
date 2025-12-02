import { IsOptional, IsDateString, IsNumber } from 'class-validator';


export class UpdateAuctionDto {
@IsOptional()
@IsDateString()
startDate?: string;


@IsOptional()
@IsDateString()
endDate?: string;


@IsOptional()
@IsNumber()
startingPrice?: number;


@IsOptional()
@IsNumber()
bidExtensionTime?: number;
}