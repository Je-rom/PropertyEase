import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
    async getBookings(){
      return await this.bookingService.getAllBookings()
    }

    @Get('user')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Tenant)
    async getBookingsForUser(@Req() Request: CustomRequest ){
      const tenantId = Request.user.id
      return await this.bookingService.getBookingsForUser(tenantId)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Tenant)
    async deleteBookingForUser(@Param('id') bookingId: string, @Req() Request: CustomRequest){
      const tenantId = Request.user.id
      return await this.bookingService.deleteBookingForUser(bookingId, tenantId)
    }
}
