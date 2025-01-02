import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { Request, Response } from 'express';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('login')
  async login(
    @Body('password') password: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(password);
    const result = await this.adminsService.login(password, req);

    return result;
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    // res.clearCookie('role');
    return this.adminsService.logout(req);
  }
}
