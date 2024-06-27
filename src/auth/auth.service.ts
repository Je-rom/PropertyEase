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
    this.tokenService.createSendToken(createdUser, 200, res);
  }

  //SIGN IN
  async signin(createUserDto: CreateUserDto, res: any) {
    //check if email and password is avaiable
    const { email, password } = createUserDto;
    if (!email || !password) {
      throw new BadRequestException('Please provide your Email and Password');
    }

    //check if email(user) exits and if the password is correct
    const user = await this.userModel.findOne({ email }).select('+password');
    const checkPassword = await user.correctPassword(password, user.password);
    if (!user || !checkPassword) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    user.password = undefined;
    this.tokenService.createSendToken(user, 200, res);
  }
}
