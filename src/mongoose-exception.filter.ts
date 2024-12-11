import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';
import * as mongoose from 'mongoose';

@Catch(mongoose.Error.ValidationError)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: mongoose.Error.ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const messages = Object.values(exception.errors).map((err) => ({
      field: err.path,
      message: err.message,
    }));

    response.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message: messages,
    });
  }
}
