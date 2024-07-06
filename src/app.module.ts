import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';
import { PropertyModule } from './property/property.module';
import { BookingModule } from './bookings/booking.module';

dotenv.config();

const db = process.env.CONNECTION_STRING;

@Module({
  imports: [
    MongooseModule.forRoot(db),
    AuthModule,
    UserModule,
    PropertyModule,
    BookingModule
  ],
})
export class AppModule {}
