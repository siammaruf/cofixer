import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/base/base.repository';
import { Media } from './media.entity';

@Injectable()
export class MediaRepository extends BaseRepository<Media> {
    constructor(
        @InjectRepository(Media)
        repository: Repository<Media>,
    ) {
        super(repository);
    }

    async findByFolder(folder: string): Promise<Media[]> {
        return this.repository.find({
            where: { folder, isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
}
