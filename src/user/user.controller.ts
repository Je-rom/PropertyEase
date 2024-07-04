import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  HttpException,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { userService } from './user.service';
import mongoose from 'mongoose';
import { updateUserDto } from './dto/UpdateUser.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';

@Controller('users')
export class UserController {
  constructor(private userService: userService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.PropertyOwner)
  async getUsers() {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') _id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(_id);
    if (!isValid) throw new HttpException('user not found', 404);
    const userId = await this.userService.getUserById(_id);
    if (!userId) throw new HttpException('user not found', 404);
    return userId;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PropertyOwner)
  async updateUser(
    @Param('id') id: string,
    @Body() updateuserDto: updateUserDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('invalid id', 400);
    const updatedUser = await this.userService.updateUserById(
      id,
      updateuserDto,
    );
    if (!updatedUser) {
      throw new HttpException('user not found', 404);
    }
    return updatedUser;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('invalid id', 400);
    const deletedUser = await this.userService.deleteUserById(id);
    if (!deletedUser) {
      throw new HttpException('user not found', 404);
    }
  }
}
