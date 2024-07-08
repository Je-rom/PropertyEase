import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { Booking, BookingSchema } from 'src/schemas/booking.schema';
import { Property, PropertySchema } from 'src/schemas/property.schema';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { AuthService } from 'src/auth/auth.service';
import { TokenService } from 'src/token/token.service';
import { userService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
    UserModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, AuthService, TokenService, userService],
})
export class BookingModule {}
