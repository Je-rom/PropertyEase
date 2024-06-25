import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  HttpException,
  Patch,
} from '@nestjs/common';
import { userService } from './user.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import mongoose from 'mongoose';
import { updateUserDto } from './dto/UpdateUser.dto';

@Controller('users')
export class UserController {
  constructor(private userService: userService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.userService.createUser(createUserDto);
  }

  @Get()
  getUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') _id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(_id);
    if (!isValid) throw new HttpException('user not found', 404);
    const userId = await this.userService.getUserById(_id);
    if (!userId) throw new HttpException('user not found', 404);
    return userId;
  }

  @Patch(':id')
  updateUser(@Body() updateuserDto: updateUserDto) {
    
  }
}
