import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateCarStatusDto {
  @IsOptional()
  @IsString()
  status?: string; 

  @IsOptional()
  @IsBoolean()
  isOnAuction?: boolean;
}
