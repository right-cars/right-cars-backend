import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateCarDto {
  @IsString() make: string;
  @IsString() mileageInKm: string;
  @IsString() model: string;
  @IsString() fuelType: string;
  @IsString() year: string;
  @IsString() transmission: string;
  @IsString() price: string;
  @IsString() @IsOptional() drive_type: string;
  @IsString() @IsOptional() finance: string;
  @IsString() vehicleCategory: string;
  @IsString() @IsOptional() fuelConsumption: string;
  @IsString() bodyType: string;
  @IsString() @IsOptional() engineCapacityInCc: string;
  @IsString() @IsOptional() variant: string;
  @IsString() @IsOptional() seats: string;
  @IsString() @IsOptional() colour: string;
  @IsString() @IsOptional() doors: string;
  @IsString() stockNumber: string;
  @IsString() @IsOptional() vehicleServiceHistory: string;
  @IsString() @IsOptional() spareKey: string | boolean;
  @IsString() @IsOptional() warranty: string | boolean;
  @IsString() @IsOptional() kilowatts: string;
  @IsString() @IsOptional() cylinderLayout: string;
  @IsString() @IsOptional() gears: string;
  @IsArray() @IsString({ each: true }) @IsOptional() features?: string[];
  @IsString() @IsOptional() video?: string;
}
