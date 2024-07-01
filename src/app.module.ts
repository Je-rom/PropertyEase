import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';

dotenv.config();

const db = process.env.MONGO_URI;

@Module({
  imports: [
    MongooseModule.forRoot(db),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}

//mongodb://localhost:27017/