import { Injectable, UnauthorizedException, ConflictException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import {RegisterDto} from './dto/register.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  private adminPasswordHash: string;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtService: JwtService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async register(dto: RegisterDto): Promise<{ token: string }> {
    const userExists = await this.findByEmail(dto.email);
    if (userExists) {
      throw new ConflictException('Email уже зарегистрирован');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = await this.create({
      ...dto,
      password: hashedPassword,
    });

    const token = this.generateToken(String(newUser._id), newUser.email);
    return { token };
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ userId, email });
  }

  // async login(password: string, req: Request): Promise<Object> {
  //   let role = "";
  //   if(await bcrypt.compare(password, this.adminPasswordHash)) {
  //     role = "admin";
  //   } else if(await bcrypt.compare(password, this.superAdminPasswordHash)) {
  //     role = "superAdmin";
  //   }
  //   else {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  //
  //   req.session.user = { role };
  //
  //   return {
  //     message: 'Login Successfull',
  //     role,
  //   };
  // }
  //
  // logout(req: Request): string {
  //   req.session.destroy((err) => {
  //     if (err) {
  //       throw new UnauthorizedException('Error during logout');
  //     }
  //   });
  //   return 'Logout successful';
  // }
}
