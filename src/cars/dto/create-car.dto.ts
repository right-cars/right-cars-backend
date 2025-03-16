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
  @IsString() @IsOptional() fuel_consumption: string;
  @IsString() body_type: string;
  @IsString() @IsOptional() engine_capacity: string;
  @IsString() @IsOptional() variant: string;
  @IsString() @IsOptional() number_of_seats: string;
  @IsString() @IsOptional() colour: string;
  @IsString() @IsOptional() number_of_doors: string;
  @IsString() stock_number: string;
  @IsString() @IsOptional() vehicle_service_history: string;
  @IsString() @IsOptional() spare_key: string | boolean;
  @IsString() @IsOptional() warranty: string | boolean;
  @IsString() @IsOptional() kilowatts: string;
  @IsString() @IsOptional() cylinder_layout: string;
  @IsString() @IsOptional() gears: string;
  @IsString() @IsOptional() feature_1?: string;
  @IsString() @IsOptional() feature_2?: string;
  @IsString() @IsOptional() feature_3?: string;
  @IsString() @IsOptional() feature_4?: string;
  @IsString() @IsOptional() feature_5?: string;
  @IsString() @IsOptional() feature_6?: string;
  @IsString() @IsOptional() video?: string;
}
