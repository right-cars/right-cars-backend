import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from './car.schema';
import { CreateCarDto } from './dto/create-car.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {unlink} from "node:fs/promises";

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>, private cloudinary: CloudinaryService) {}

  async create(createCarDto: CreateCarDto, files): Promise<Car> {
    const roadworthy_voucher = await this.cloudinary.uploadImage(
      files.roadworthy_voucher[0],
    );
    await unlink(files.roadworthy_voucher[0].path);
    const condition_report = await this.cloudinary.uploadImage(
      files.condition_report[0],
    );
    await unlink(files.condition_report[0].path);
    const images = await this.cloudinary.uploadMultipleImages(
      files.images,
    );

    const newCar = new this.carModel({ ...createCarDto, roadworthy_voucher, condition_report, images });
    return newCar.save();
  }

  async findAll(): Promise<Car[]> {
    return this.carModel.find().exec();
  }

  async findOne(id: string): Promise<Car> {
    return this.carModel.findById(id).exec();
  }

  async update(id: string, updateCarDto: CreateCarDto): Promise<Car> {
    return this.carModel.findByIdAndUpdate(id, updateCarDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Car> {
    return this.carModel.findByIdAndDelete(id).exec();
  }
}
