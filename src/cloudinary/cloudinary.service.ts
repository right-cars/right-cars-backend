import { Injectable } from '@nestjs/common';
import {  v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ) {

    const {url} = await v2.uploader.upload(file.path, {
      folder: "cars"
    });
    return url;
  }

  async uploadMultipleImages(files: Express.Multer.File[]) {
    const multipleImages = await Promise.all(
      files.map(async (image) => await this.uploadImage(image)),
    );

    return multipleImages;
  }
}
