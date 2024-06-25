import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class userService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }
    const createdUser = new this.userModel({
      ...createUserDto,
      confirmPassword: createUserDto.confirmPassword,
    });
    return await createdUser.save();
  }

  getAllUsers() {
    return this.userModel.find();
  }

  async getUserById(_id: string) {
    return this.userModel.findById(_id);
  }
}
