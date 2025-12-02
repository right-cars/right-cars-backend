import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateCarDto {
  @IsString() make: string;
  @IsString() mileageInKm: string;
  @IsString() model: string;
  @IsString() fuelType: string;
  @IsString() year: string;
  @IsString() transmission: string;
  @IsString() price: string;
  @IsString() @IsOptional() driveType: string;
  @IsString() @IsOptional() finance: string;
  @IsString() vehicleCategory: string;
  @IsString() @IsOptional() fuelConsumption: string;
  @IsString() bodyType: string;
  @IsString() @IsOptional() engineCapacity: string;
  @IsString() @IsOptional() variant: string;
  @IsString() @IsOptional() numberOfSeats: string;
  @IsString() @IsOptional() colour: string;
  @IsString() @IsOptional() numberOfDoors: string;
  @IsString() stockNumber: string;
  @IsString() @IsOptional() vehicleServiceHistory: string;
  @IsString() @IsOptional() spareKey: string | boolean;
  @IsString() @IsOptional() warranty: string | boolean;
  @IsString() @IsOptional() kilowatts: string;
  @IsString() @IsOptional() cylinderLayout: string;
  @IsString() @IsOptional() gears: string;
  @IsString() @IsOptional() feature_1: string;
  @IsString() @IsOptional() feature_2: string;
  @IsString() @IsOptional() feature_3: string;
  @IsString() @IsOptional() feature_4: string;
  @IsString() @IsOptional() feature_5: string;
  @IsString() @IsOptional() feature_6: string;
  @IsString() @IsOptional() video?: string;
}
