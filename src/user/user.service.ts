import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { updateUserDto } from './dto/UpdateUser.dto';

@Injectable()
export class userService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  getAllUsers() {
    return this.userModel.find();
  }

  async getUserById(_id: string) {
    return this.userModel.findById(_id);
  }

  updateUserById(id: string, updateUserDto: updateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  deleteUserById(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
