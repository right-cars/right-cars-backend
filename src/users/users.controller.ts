import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import {RegisterDto} from './dto/register.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto
  ) {
    return this.usersService.register(dto);
  }

  // @Post('login')
  // async login(
  //   @Body('password') password: string,
  //   @Req() req: Request,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   const result = await this.adminsService.login(password, req);
  //
  //   return result;
  // }
  //
  // @Post('logout')
  // async logout(@Req() req: Request) {
  //   // res.clearCookie('role');
  //   return this.adminsService.logout(req);
  // }
}
