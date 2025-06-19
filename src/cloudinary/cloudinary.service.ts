import { Injectable } from '@nestjs/common';
import {  v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {

  extractPublicId(url: string) {
    // Извлекает путь после `/upload/` и до расширения
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-z]+$/i);
    return match ? match[1] : null;
  }

  async deleteFileByUrl(url: string | undefined) {
    if(!url) return;
    const publicId = this.extractPublicId(url);
  
    if (!publicId) {
      console.error('Не удалось извлечь public_id из URL:', url);
      return;
    }
  
    try {
      const result = await v2.uploader.destroy(publicId);
      console.log(`Удаление файла ${publicId}:`, result);
    } catch (err) {
      console.error(`Ошибка при удалении файла ${publicId}:`, err);
    }
  }

  getResourceType(mime: string): 'image' | 'raw' | 'video' {
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    return 'raw'; // для PDF, DOCX, ZIP и т.п.
  }

  async uploadDoc(
    file: Express.Multer.File,
  ) {
    const resource_type = this.getResourceType(file.mimetype);
    const {secure_url} = await v2.uploader.upload(file.path, {
      folder: "documents",
      resource_type,
    });
    return secure_url;
  }

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
