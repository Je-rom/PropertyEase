// import { Module, Global, Logger } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Global()
// @Module({
//   imports: [
//     MongooseModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         uri: configService.get<string>('MONGO_URI'),
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   exports: [MongooseModule],
// })
// export class DatabaseModule {
//   private readonly logger = new Logger(DatabaseModule.name);

//   constructor() {
//     const mongoose = require('mongoose');
//     mongoose.connection.once('open', () => {
//       this.logger.log('Connected to the database');
//     });
//     mongoose.connection.on('error', (error) => {
//       this.logger.error('Database connection error', error);
//     });
//   }
// }
