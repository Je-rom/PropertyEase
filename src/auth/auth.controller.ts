import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/CreateUser.dto';
import { LoginUserDto } from 'src/user/dto/LoginUser.dto';
import { updatePasswordDto } from 'src/user/dto/updatePassword.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { Response as ExpressResponse } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto, @Res() res) {
    try {
      const user = await this.authService.signup(createUserDto, res);
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: error.status || 'error',
        message: error.message || 'Internal server error',
      });
    }
  }

  @Post('signin')
  async signin(@Body() loginUserDto: LoginUserDto, @Res() res) {
    return await this.authService.signin(loginUserDto, res);
  }

  @Patch('update-password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Body() updatePasswordDto: updatePasswordDto,
    @Req() request: Request,
    @Res() response: ExpressResponse,
  ) {
    const userId = request.user.id;
    return await this.authService.updatePassword(
      updatePasswordDto,
      userId,
      response,
    );
  }
}
