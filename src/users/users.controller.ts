import { Controller, Req, Res, Get, Post, Body, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
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

  @Post('resend-confirmation')
  async resend(@Body('email') email: string) {
    return this.usersService.resendConfirmationEmail(email);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.usersService.login(body.email, body.password);

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // true если HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Logged in' };
  }

  @Get('current')
  async me(@Req() req: Request & { cookies: any }) {
    const token = req.cookies?.jwt;
    if (!token) return { user: null };

    const user = await this.usersService.getUserFromToken(token);
    return { user };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Logged out' };
  }
}
