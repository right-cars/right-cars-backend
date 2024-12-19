import { IsString, IsOptional } from 'class-validator';

export class CreateCarDto {
  @IsString() make: string;
  @IsString() km: string;
  @IsString() model: string;
  @IsString() fuel: string;
  @IsString() year: string;
  @IsString() transmission: string;
  @IsString() price: string;
  @IsString() drive_type: string;
  @IsString() finance: string;
  @IsString() type: string;
  @IsString() fuel_consumption: string;
  @IsString() body_type: string;
  @IsString() engine_capacity: string;
  @IsString() variant: string;
  @IsString() number_of_seats: string;
  @IsString() colour: string;
  @IsString() number_of_doors: string;
  @IsString() stock_number: string;
  @IsString() vehicle_service_history: string;
  @IsString() spare_key: string;
  @IsString() warranty: string;
  @IsString() kilowatts: string;
  @IsString() cylinder_layout: string;
  @IsString() gears: string;
  @IsString() @IsOptional() feature_1?: string;
  @IsString() @IsOptional() feature_2?: string;
  @IsString() @IsOptional() feature_3?: string;
  @IsString() @IsOptional() feature_4?: string;
  @IsString() @IsOptional() feature_5?: string;
  @IsString() @IsOptional() feature_6?: string;
  @IsString() @IsOptional() video?: string;
}
