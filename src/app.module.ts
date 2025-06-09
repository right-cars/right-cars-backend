import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminsModule } from './admins/admins.module';
import { AdminsService } from './admins/admins.service';
import { CarsModule } from './cars/cars.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AdminsController } from './admins/admins.controller';
import { OzowModule } from './ozow/ozow.module';

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
    UsersModule,
    CloudinaryModule,
    OzowModule,
  ],
  controllers: [AppController, AdminsController],
  providers: [AppService, AdminsService],
})
export class AppModule {}
