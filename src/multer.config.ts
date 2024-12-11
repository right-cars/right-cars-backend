import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads', // Папка для хранения файлов
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + extname(file.originalname);
      callback(null, file.fieldname + '-' + uniqueSuffix); // Уникальное имя файла
    },
  }),
};
