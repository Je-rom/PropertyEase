import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { updateUserDto } from './dto/UpdateUser.dto';
import { PropertyService } from 'src/property/property.service';

@Injectable()
export class userService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAllUsers() {
    return await this.userModel.find();
  }

  async getUserById(_id: string) {
    return await this.userModel.findById(_id);
  }

  async updateUserById(id: string, updateUserDto: updateUserDto) {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }

  async deleteUserById(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
}
