import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  mobileNumber: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
