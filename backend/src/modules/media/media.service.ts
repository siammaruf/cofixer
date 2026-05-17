import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { CloudinaryService } from '../../infrastructure/cloudinary';
import { Media } from './media.entity';
import { MediaRepository } from './media.repository';

@Injectable()
export class MediaService extends BaseService<Media> {
    constructor(
        private readonly mediaRepository: MediaRepository,
        private readonly cloudinaryService: CloudinaryService,
    ) {
        super(mediaRepository, 'Media');
    }

    async findByFolder(folder: string): Promise<Media[]> {
        return this.mediaRepository.findByFolder(folder);
    }

    async remove(id: string): Promise<void> {
        const media = await this.findByIdOrFail(id);
        const publicId = this.cloudinaryService.extractPublicId(media.url);
        if (publicId) {
            await this.cloudinaryService.deleteFile(publicId);
        }
        await this.mediaRepository.delete(id);
    }
}
