import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://abadijerry44:M23rR7KnTK90zOBA@natourcluster.jfbbiwz.mongodb.net/?retryWrites=true&w=majority&appName=NatourCluster'),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}

//mongodb://localhost:27017/