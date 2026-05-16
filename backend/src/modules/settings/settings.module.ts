import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteSettingsAdminController } from './site-settings.admin.controller';
import { SiteSettingsService } from './site-settings.service';
import { SiteSettingsRepository } from './site-settings.repository';
import { SiteSettings } from './site-settings.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SiteSettings])],
    controllers: [SiteSettingsAdminController],
    providers: [SiteSettingsService, SiteSettingsRepository],
    exports: [SiteSettingsService, SiteSettingsRepository],
})
export class SettingsModule {}
