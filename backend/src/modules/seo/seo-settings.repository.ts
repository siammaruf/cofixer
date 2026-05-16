import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/base/base.repository';
import { SeoSettings } from './seo-settings.entity';

@Injectable()
export class SeoSettingsRepository extends BaseRepository<SeoSettings> {
    constructor(
        @InjectRepository(SeoSettings)
        repository: Repository<SeoSettings>,
    ) {
        super(repository);
    }

    async findByRoute(route: string): Promise<SeoSettings | null> {
        return this.repository.findOne({
            where: { route },
        });
    }
}
