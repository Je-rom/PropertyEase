import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/roles.enum';
import { CreatePropertyDto } from './dto/CreateProperty.dto';
import { UpdatePropertyDto } from './dto/UpdateProperty.dto';
import { UserDocument } from 'src/schemas/user.schema';
import { Property } from 'src/schemas/property.schema';
import { CustomRequest } from 'src/custom-request.interface';
import mongoose from 'mongoose';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  //create property
  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PropertyOwner)
  async createProperty(
    @Body() createPropertyDto: CreatePropertyDto,
    @Req() req,
  ) {
    return await this.propertyService.createProperty(
      createPropertyDto,
      req.user,
    );
  }

  //get all properties
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PropertyOwner, Role.Tenant)
  async getAllProperties() {
    return await this.propertyService.getProperties();
  }

  //update property by ID
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PropertyOwner)
  async updateProperty(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @Req() req: CustomRequest,
  ): Promise<Property> {
    const user = req.user as UserDocument;
    //check if user still exists
    if (!user) {
      throw new HttpException('user not found', 400);
    }
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!id) {
      throw new HttpException('invalid property id', 400);
    }
    const updateProperty = await this.propertyService.updateProperty(
      id,
      updatePropertyDto,
      user,
    );
    return updateProperty;
  }

  //delete property
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PropertyOwner)
  async deleteProperty(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new HttpException('invalid id', 400);
    }
    const deleteProperty = await this.propertyService.deleteProperty(id);
    if (!deleteProperty) {
      throw new HttpException('property not found', 404);
    }
  }
}
