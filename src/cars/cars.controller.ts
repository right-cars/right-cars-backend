import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFiles, Patch } from "@nestjs/common";
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarStatusDto } from './dto/update-car-status.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../multer.config';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post("action")
  action() {
    return this.carsService.action();
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 12 },
        { name: 'mainImage', maxCount: 1 },
        { name: 'dekraReport', maxCount: 1 },
        { name: 'conditionReport', maxCount: 1 },
      ],
      multerConfig)
  )
  addCar(
    @Body() createCarDto: CreateCarDto,
    @UploadedFiles() files: { mainImage: Express.Multer.File[], images: Express.Multer.File[], dekraReport: Express.Multer.File[], conditionReport: Express.Multer.File[] }) {
    return this.carsService.create({ ...createCarDto }, files);
  }

  @Get()
  async findAll() {
    return this.carsService.findAll();
  }

  // @Get('/import')
  // async importFromAutotrader() {
  //   return this.carsService.importFromAutotrader();
  // }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 12 },
        { name: 'dekraReport', maxCount: 1 },
        { name: 'conditionReport', maxCount: 1 },
      ],
      multerConfig)
  )
  async update(@Param('id') id: string, @Body() updateCarDto: CreateCarDto, @UploadedFiles() files: { images: Express.Multer.File[], dekraReport: Express.Multer.File[], conditionReport: Express.Multer.File[] }) {
    return this.carsService.update(id, updateCarDto, files);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.carsService.remove(id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateCarStatusDto: UpdateCarStatusDto) {
    return this.carsService.updateStatus(id, updateCarStatusDto);
  }
}
