import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeoSettingsController } from './seo-settings.controller';
import { SeoSettingsAdminController } from './seo-settings.admin.controller';
import { SeoSettingsService } from './seo-settings.service';
import { SeoSettingsRepository } from './seo-settings.repository';
import { SeoSettings } from './seo-settings.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SeoSettings])],
    controllers: [SeoSettingsController, SeoSettingsAdminController],
    providers: [SeoSettingsService, SeoSettingsRepository],
    exports: [SeoSettingsService, SeoSettingsRepository],
})
export class SeoModule {}
