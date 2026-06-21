import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { MediaUploadProcessor } from './media-upload.processor';
import { CacheModule } from '../cache/cache.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '../../modules/media/media.entity';

@Module({
    imports: [CacheModule, CloudinaryModule, TypeOrmModule.forFeature([Media])],
    providers: [QueueService, MediaUploadProcessor],
    exports: [QueueService, MediaUploadProcessor],
})
export class QueueModule {}
