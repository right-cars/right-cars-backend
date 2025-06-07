import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

import * as process from 'node:process';
import { MongooseExceptionFilter } from './mongoose-exception.filter';
import { ValidationPipe } from '@nestjs/common';
const MongoStore = require('connect-mongo');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new MongooseExceptionFilter());
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Content-Type, Authorization, X-Requested-With, Access-Control-Allow-Credentials',
    credentials: true,
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY, // Замените на ваш надежный ключ
      resave: false, // Не пересохранять сессии, если данные не изменялись
      saveUninitialized: false, // Не сохранять пустые сессии
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions', // Название коллекции для хранения сессий
      }),
      cookie: {
        maxAge: 588000000,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
