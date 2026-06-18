import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '../../infrastructure/cloudinary';
import { QueueModule } from '../../infrastructure/queue/queue.module';
import { MediaAdminController } from './media.admin.controller';
import { MediaService } from './media.service';
import { MediaRepository } from './media.repository';
import { Media } from './media.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Media]), CloudinaryModule, QueueModule],
    controllers: [MediaAdminController],
    providers: [MediaService, MediaRepository],
    exports: [MediaService, MediaRepository],
})
export class MediaModule {}
