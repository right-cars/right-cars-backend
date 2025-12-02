// src/admins/users.module.ts
import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
