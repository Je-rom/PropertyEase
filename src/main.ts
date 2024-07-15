import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe()); //validation, registers pipes as global pipes (will be used within every HTTP route handler)
  // app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3333);
  app.use(bodyParser.json());
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
