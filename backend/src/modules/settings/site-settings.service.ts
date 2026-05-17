import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { SiteSettings } from './site-settings.entity';
import { SiteSettingsRepository } from './site-settings.repository';

@Injectable()
export class SiteSettingsService extends BaseService<SiteSettings> {
    constructor(
        private readonly siteSettingsRepository: SiteSettingsRepository,
    ) {
        super(siteSettingsRepository, 'SiteSettings');
    }

    async findFirstOrCreate(): Promise<SiteSettings> {
        const settings = await this.siteSettingsRepository.findFirst();
        if (settings) return settings;
        const defaultSettings = new SiteSettings();
        defaultSettings.siteName = 'Cofixer';
        return this.siteSettingsRepository.create(defaultSettings);
    }
}
