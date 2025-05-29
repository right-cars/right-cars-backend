import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from './car.schema';
// import axios from "axios";
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarStatusDto } from './dto/update-car-status.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { unlink } from 'node:fs/promises';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    private cloudinary: CloudinaryService,
  ) {}

  // async importFromAutotrader() {
  //   return axios.get("https://services.autotrader.co.za/api/syndication/v1.0/listings", {
  //     auth: {
  //       username: "Right-Cars@autotrader.co.za",
  //       password: "Dy647hedQQx5417GH"
  //     }
  //   });
  // }

  async getFilters(): Promise<{
    minPrice: number;
    maxPrice: number;
    minMileage: number;
    maxMileage: number;
    minYear: number;
    maxYear: number;
    makes: string[];
  }> {
    const result = await this.carModel.aggregate([
      {
        $addFields: {
          numericPrice: {
            $convert: {
              input: '$price',
              to: 'double',
              onError: null,
              onNull: null,
            },
          },
          numericMileage: {
            $convert: {
              input: '$mileageInKm',
              to: 'double',
              onError: null,
              onNull: null,
            },
          },
          numericYear: {
            $convert: {
              input: '$year',
              to: 'int',
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$numericPrice' },
          maxPrice: { $max: '$numericPrice' },
          minMileage: { $min: '$numericMileage' },
          maxMileage: { $max: '$numericMileage' },
          minYear: { $min: '$numericYear' },
          maxYear: { $max: '$numericYear' },
        },
      },
    ]);

    const makes = await this.carModel.distinct('make').exec();
  
    if (!result.length) {
      return {
        minPrice: null,
        maxPrice: null,
        minMileage: null,
        maxMileage: null,
        minYear: null,
        maxYear: null,
        makes,
      };
    }
  
    return {
      minPrice: result[0].minPrice,
      maxPrice: result[0].maxPrice,
      minMileage: result[0].minMileage,
      maxMileage: result[0].maxMileage,
      minYear: result[0].minYear,
      maxYear: result[0].maxYear,
      makes,
    };
  }
  
  async action() {
    return await this.carModel.updateMany(
      { images: { $exists: true, $type: 'array', $ne: [] } }, // фильтр: есть images, это массив, не пустой
      [
        {
          $set: {
            mainImage: { $arrayElemAt: ['$images', 0] },
          },
        },
      ],
    );
  }

  async create(createCarDto: CreateCarDto, files): Promise<Car> {
    let dekraReport = null;
    if (files.dekraReport) {
      dekraReport = await this.cloudinary.uploadImage(files.dekraReport[0]);
      await unlink(files.dekraReport[0].path);
    }

    let conditionReport = null;
    if (files.conditionReport) {
      conditionReport = await this.cloudinary.uploadImage(
        files.conditionReport[0],
      );
      await unlink(files.conditionReport[0].path);
    }

    const mainImage = await this.cloudinary.uploadImage(files.mainImage[0]);
    await unlink(files.mainImage[0].path);

    const images = await this.cloudinary.uploadMultipleImages(files.images);
    await Promise.all(files.images.map(({ path }) => unlink(path)));

    if (createCarDto.spareKey && typeof createCarDto.spareKey === 'string') {
      createCarDto.spareKey = createCarDto.spareKey === 'true';
    }

    if (createCarDto.warranty && typeof createCarDto.warranty === 'string') {
      createCarDto.warranty = createCarDto.warranty === 'true';
    }

    const newCar = new this.carModel({
      ...createCarDto,
      dekraReport,
      conditionReport,
      mainImage,
      images,
    });
    return newCar.save();
  }

  async findAll(): Promise<Car[]> {
    return this.carModel.find().exec();
  }

  async findOne(id: string): Promise<Car> {
    return this.carModel.findById(id).exec();
  }

  async update(id: string, updateCarDto: CreateCarDto, files): Promise<Car> {
    const updateFiles = {};
    if (files.dekraReport) {
      const dekraReport = await this.cloudinary.uploadImage(
        files.dekraReport[0],
      );
      await unlink(files.dekraReport[0].path);
      // @ts-expect-error: may be empty
      updateFiles.dekraReport = dekraReport;
    }
    if (files.conditionReport) {
      const conditionReport = await this.cloudinary.uploadImage(
        files.conditionReport[0],
      );
      await unlink(files.conditionReport[0].path);
      // @ts-expect-error: may be empty
      updateFiles.conditionReport = conditionReport;
    }
    if (files.mainImage) {
      const mainImage = await this.cloudinary.uploadImage(files.mainImage[0]);
      await unlink(files.mainImage[0].path);
      // @ts-expect-error: may be empty
      updateFiles.mainImage = mainImage;
    }

    if (files.images) {
      const images = await this.cloudinary.uploadMultipleImages(files.images);
      // @ts-expect-error: may be empty
      updateFiles.images = images;
    }
    return this.carModel
      .findByIdAndUpdate(id, { ...updateCarDto, ...updateFiles }, { new: true })
      .exec();
  }

  async updateStatus(
    id: string,
    updateCarStatusDto: UpdateCarStatusDto,
  ): Promise<Car> {
    return this.carModel
      .findByIdAndUpdate(id, updateCarStatusDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Car> {
    const car = await this.findOne(id);
    await this.cloudinary.deleteFileByUrl(car.mainImage);
    await this.cloudinary.deleteFileByUrl(car.dekraReport);
    await this.cloudinary.deleteFileByUrl(car.conditionReport);
    await Promise.all(
      car.images.map((url) => this.cloudinary.deleteFileByUrl(url)),
    );
    return this.carModel.findByIdAndDelete(id).exec();
  }
}
