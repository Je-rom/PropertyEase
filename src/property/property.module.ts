import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from 'src/schemas/property.schema';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { AuthService } from 'src/auth/auth.service';
import { TokenService } from 'src/token/token.service';
import { UserModule } from 'src/user/user.module';
import { userService } from 'src/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Property.name,
        schema: PropertySchema,
      },
    ]),
    UserModule,
  ],
  controllers: [PropertyController],
  providers: [PropertyService, AuthService, TokenService, userService],
  exports: [
    PropertyService,
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
  ],
})
export class PropertyModule {}
