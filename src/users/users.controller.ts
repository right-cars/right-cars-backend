import {
  Controller,
  Req,
  Res,
  Get,
  Post,
  Put,
  Body,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  async updateById(@Body() updateDto, @Param('id') id: string) {
    const updateUser = await this.usersService.updateById(updateDto, id);
    return updateUser;
  }

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

  @Post('forgot')
  forgot(@Body('email') email: string) {
    return this.usersService.forgotPassword(email);
  }

  @Post('reset')
  reset(@Body() dto: { token: string; newPassword: string }) {
    return this.usersService.resetPassword(dto.token, dto.newPassword);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.usersService.login(body.email, body.password);

    // res.cookie('jwt', token, {
    //   httpOnly: true,
    //   sameSite: 'lax',
    //   secure: false, // true если HTTPS
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    // return { message: 'Logged in' };
    return {
      accessToken: token,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  async me(@Req() req: Request & { cookies: any }) {
    //@ts-expect-error
    const user = await this.usersService.findByEmail(req.user.email);
    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateUser(@Body() updateDto, @Req() req: Request & { cookies: any }) {
    //@ts-expect-error
    const updateUser = await this.usersService.updateUser(updateDto, req.user.email);
    return updateUser;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    return { message: 'Logged out' };
  }
}
