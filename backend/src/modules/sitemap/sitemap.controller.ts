import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Header,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../core/decorators/public.decorator';
import { CacheTag } from '../../core/decorators/cache-tag.decorator';
import { RedisCacheInterceptor } from '../../core/interceptors/redis-cache.interceptor';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { SitemapService } from './sitemap.service';

@ApiTags('Sitemap')
@Controller('sitemap')
@CacheTag('sitemap')
@UseInterceptors(RedisCacheInterceptor)
export class SitemapController {
    constructor(private readonly sitemapService: SitemapService) {}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    @Header('Content-Type', 'application/xml')
    @ApiSwagger({
        resourceName: 'Sitemap',
        operation: 'getOne',
        requiresAuth: false,
    })
    async getSitemap(): Promise<string> {
        return this.sitemapService.generateSitemap();
    }
}
