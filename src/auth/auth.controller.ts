import { Body, Controller, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/CreateUser.dto';
import { LoginUserDto } from 'src/user/dto/LoginUser.dto';
import { updatePasswordDto } from 'src/user/dto/updatePassword.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto, @Res() res) {
    return await this.authService.signup(createUserDto, res);
  }

  @Post('signin')
  async signin(@Body() loginUserDto: LoginUserDto, @Res() res) {
    return await this.authService.signin(loginUserDto, res);
  }

  @Patch('update-password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Body() updatePasswordDto: updatePasswordDto, id: string, @Res() res){
    return await this.authService.updatePassword(updatePasswordDto, id, res)
  }
}
