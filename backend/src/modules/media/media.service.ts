import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { Media } from './media.entity';
import { MediaRepository } from './media.repository';

@Injectable()
export class MediaService extends BaseService<Media> {
    constructor(private readonly mediaRepository: MediaRepository) {
        super(mediaRepository, 'Media');
    }

    async findByFolder(folder: string): Promise<Media[]> {
        return this.mediaRepository.findByFolder(folder);
    }
}
