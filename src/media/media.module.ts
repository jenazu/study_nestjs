import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaController } from './controllers/media.controller';
import { MediaSchema } from './models/media.model';
import { MediaRepository } from './repositories/media.repository';
import { MediaService } from './services/media.services';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Media',
        schema: MediaSchema,
      },
    ]),
    ConfigModule,
  ],
  providers: [MediaService, MediaRepository],
  controllers: [MediaController],
})
export class MediaModule {}
