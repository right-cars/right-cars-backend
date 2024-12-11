import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './car.schema';
import { CarsService } from './cars.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    CloudinaryModule,
  ],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
