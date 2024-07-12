import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingRequestDto } from './dto/BookingRequest.dto';
import { CustomRequest } from 'src/custom-request.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/roles.enum';
import { Response } from 'express';
import { updateBookingDto } from 'src/bookings/dto/UpdateBookingRequest.dto';
import mongoose from 'mongoose';
import { ApiFeatures } from './../apiFeatures/apiFeatures';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tenant)
  async createBooking(
    @Body() createBookingDto: BookingRequestDto,
    @Req() request: CustomRequest,
    @Res() res: Response,
  ) {
    const tenant = request.user;
    const booking = await this.bookingService.createBooking(
      createBookingDto,
      tenant,
    );
    return res.status(201).json(booking);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.PropertyOwner)
  async getBookings(@Req() req: CustomRequest) {
    const query = req.query;
    const features = new ApiFeatures(
      this.bookingService.getAllBookings(),
      query,
    )
      .filter()
      .limitFields()
      .paginate()
      .sort();
    const bookings = await features.query.exec();
    return bookings;
  }

  @Get('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tenant)
  async getBookingsForUser(@Req() Request: CustomRequest) {
    const tenantId = Request.user.id;
    const query = Request.query;
    const features = new ApiFeatures(
      this.bookingService.getBookingsForUser(tenantId),
      query,
    )
      .filter()
      .limitFields()
      .paginate()
      .sort();
    const userBookings = await features.query.exec();
    return userBookings;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tenant)
  async updateBookings(
    @Param('id') bookingId: string,
    @Body() updateBookingDto: updateBookingDto,
    @Req() Request: CustomRequest,
  ) {
    const tenantId = Request.user.id;
    if (!tenantId) {
      throw new HttpException('tenant not found', 404);
    }
    const isValid = mongoose.Types.ObjectId.isValid(bookingId);
    if (!bookingId) {
      throw new HttpException('invalid booking id', 400);
    }

    const updateBookig = await this.bookingService.updateBookingsForUser(
      updateBookingDto,
      bookingId,
      tenantId,
    );
    return updateBookig;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tenant)
  async deleteBookingForUser(
    @Param('id') bookingId: string,
    @Req() Request: CustomRequest,
  ) {
    const tenantId = Request.user.id;
    if (!tenantId) {
      throw new HttpException('tenant not found', 404);
    }
    if (!bookingId) {
      throw new HttpException('invalid booking id', 400);
    }

    return await this.bookingService.deleteBookingForUser(bookingId, tenantId);
  }
}
