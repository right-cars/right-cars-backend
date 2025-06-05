import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.register(createUserDto);
  }

  @Get('confirm')
  async confirmEmail(@Query('token') token: string): Promise<string> {
    return this.usersService.confirmEmail(token);
  }
}
