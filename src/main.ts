import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
