import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RobotsController } from './robots.controller';
import { RobotsService } from './robots.service';
import { SiteSettings } from '../settings/site-settings.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SiteSettings])],
    controllers: [RobotsController],
    providers: [RobotsService],
    exports: [RobotsService],
})
export class RobotsModule {}
