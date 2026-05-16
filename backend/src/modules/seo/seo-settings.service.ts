import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { SeoSettings } from './seo-settings.entity';
import { SeoSettingsRepository } from './seo-settings.repository';

@Injectable()
export class SeoSettingsService extends BaseService<SeoSettings> {
    constructor(private readonly seoSettingsRepository: SeoSettingsRepository) {
        super(seoSettingsRepository, 'SeoSettings');
    }

    async findByRouteOrDefault(route: string): Promise<SeoSettings> {
        const settings = await this.seoSettingsRepository.findByRoute(route);
        if (settings) return settings;
        const defaultSettings = new SeoSettings();
        defaultSettings.route = route;
        defaultSettings.pageType = 'page';
        defaultSettings.robotsMeta = 'index, follow';
        return defaultSettings;
    }
}
