import {
  Body,
  Controller,
  Get,
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

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

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

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PropertyOwner)
  async updateProperty(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @Req() req: CustomRequest,
  ): Promise<Property> {
    const user = req.user as UserDocument;
    return await this.propertyService.updateProperty(
      id,
      updatePropertyDto,
      user,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PropertyOwner, Role.Tenant)
  async getAllProperties() {
    return await this.propertyService.getProperties();
  }
}
