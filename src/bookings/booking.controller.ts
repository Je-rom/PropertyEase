import { Body, Controller, Get, Param, Post, Req, Request, Res, UseGuards } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingRequestDto } from "./dto/BookingRequest.dto";
import { CustomRequest } from "src/custom-request.interface";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { Role } from "src/auth/roles.enum";
import { Response, request } from 'express';


@Controller('booking')
export class BookingController{
    constructor(private bookingService: BookingService){}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Tenant)
    async createBooking( @Body() createBookingDto: BookingRequestDto,
    @Req() request: CustomRequest,
    @Res() res: Response,){
        const tenant = request.user;
        const booking = await this.bookingService.createBooking(createBookingDto, tenant);
        return res.status(201).json(booking);
    }

    @Get()
    async getBookings(){
      return this.bookingService.getAllProperty()
    }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('user')
  @Roles(Role.Tenant)
  async getUserBookings(@Req() req: CustomRequest) {
    const userId = req.user.id;
    return this.bookingService.getBookingsByUser(userId);
  }
}