import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { PropertyService } from "./property.service";
import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Role } from "src/auth/roles.enum";
import { CreatePropertyDto } from "./dto/CreateProperty.dto";

@Controller('property')
export class PropertyController{
    constructor(private readonly propertyService: PropertyService){}

    @Post('create')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.PropertyOwner)
    async createProperty(@Body() createPropertyDto: CreatePropertyDto, @Req() req) {
        return this.propertyService.createProperty(createPropertyDto, req.user);
      }
}