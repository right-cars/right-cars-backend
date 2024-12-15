import { IsString } from 'class-validator';

export class UpdateCarStatusDto {
  @IsString() status: string;
}
