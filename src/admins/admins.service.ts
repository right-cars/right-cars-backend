import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdminsService {
  private adminPasswordHash: string;
  private superAdminPasswordHash: string;

  constructor(private readonly configService: ConfigService) {
    this.adminPasswordHash = this.configService.get<string>('ADMIN_PASSWORD_HASH');
    this.superAdminPasswordHash = this.configService.get<string>('SUPERADMIN_PASSWORD_HASH');
  }

  async login(password: string, req: Request): Promise<Object> {
    let role = "";
    if(await bcrypt.compare(password, this.adminPasswordHash)) {
      role = "admin";
    } else if(await bcrypt.compare(password, this.superAdminPasswordHash)) {
      role = "superAdmin";
    }
    else {
      throw new UnauthorizedException('Invalid credentials');
    }

    req.session.user = { role };

    return {
      message: 'Login Successfull',
      role,
    };
  }

  logout(req: Request): string {
    req.session.destroy((err) => {
      if (err) {
        throw new UnauthorizedException('Error during logout');
      }
    });
    return 'Logout successful';
  }
}
