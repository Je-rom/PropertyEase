import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { TokenService } from 'src/token/token.service';
import { CreateUserDto } from 'src/user/dto/CreateUser.dto';
import { LoginUserDto } from 'src/user/dto/LoginUser.dto';
import * as jwt from 'jsonwebtoken';
import { updatePasswordDto } from 'src/user/dto/updatePassword.dto';
import { Response as ExpressResponse } from 'express';

@Injectable({})
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private tokenService: TokenService,
  ) {}

  //SIGN UP
  async signup(createUserDto: CreateUserDto, res: any): Promise<void> {
    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();
    this.tokenService.createSendToken(createdUser, 201, res);
  }

  //SIGN IN
  async signin(loginUserDto: LoginUserDto, res: any) {
    //check if email and password is avaiable
    const { email, password } = loginUserDto;
    if (!email || !password) {
      throw new BadRequestException('Please provide your Email and Password');
    }

    //check if email(user) exits and if the password is correct
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    user.password = undefined;
    this.tokenService.createSendToken(user, 200, res);
  }

  //UPDATE PASSWORD
  async updatePassword(
    updatePasswordDto: updatePasswordDto,
    id: string,
    res: ExpressResponse,
  ) {
    //get user
    const user = await this.userModel.findById(id).select('+password');
    if (!user) {
      throw new UnauthorizedException('user not logged in please, log in');
    }

    //check if the current password is correct
    const { currentPassword } = updatePasswordDto;
    const checkPassowrd = await user.correctPassword(
      currentPassword,
      user.password,
    );
    if (!checkPassowrd) {
      throw new BadRequestException('your current password is wrong');
    }

    user.password = updatePasswordDto.password;

    await user.save();
    this.tokenService.createSendToken(user, 200, res);
  }

  //ROLES

  //PROTECT ROUTES
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
