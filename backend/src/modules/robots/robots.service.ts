import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSettings } from '../settings/site-settings.entity';

@Injectable()
export class RobotsService {
    constructor(
        @InjectRepository(SiteSettings)
        private readonly siteSettingsRepo: Repository<SiteSettings>,
    ) {}

    async getRobotsTxt(): Promise<string> {
        const settings = await this.siteSettingsRepo.findOne({ where: {} });
        if (settings?.customScripts?.includes('User-agent')) {
            return settings.customScripts;
        }
        return `User-agent: *\nDisallow:\nSitemap: https://cofixer.com/sitemap.xml`;
    }
}
