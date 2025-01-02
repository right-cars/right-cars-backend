import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminsModule } from './admins/admins.module';
import { AdminsService } from './admins/admins.service';
import { CarsModule } from './cars/cars.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AdminsController } from './admins/admins.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AdminsModule,
    CarsModule,
    CloudinaryModule,],
  controllers: [AppController, AdminsController],
  providers: [AppService, AdminsService],
})
export class AppModule {}
