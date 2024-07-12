import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); //validation, registers pipes as global pipes (will be used within every HTTP route handler)
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3333);
}
bootstrap();
