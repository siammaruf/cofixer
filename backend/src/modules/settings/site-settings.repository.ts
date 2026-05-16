import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/base/base.repository';
import { SiteSettings } from './site-settings.entity';

@Injectable()
export class SiteSettingsRepository extends BaseRepository<SiteSettings> {
    constructor(
        @InjectRepository(SiteSettings)
        repository: Repository<SiteSettings>,
    ) {
        super(repository);
    }

    async findFirst(): Promise<SiteSettings | null> {
        return this.repository.findOne({ where: {} });
    }
}
