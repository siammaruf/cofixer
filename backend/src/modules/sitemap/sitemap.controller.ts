import { Controller, Get, HttpCode, HttpStatus, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../core/decorators/public.decorator';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { SitemapService } from './sitemap.service';

@ApiTags('Sitemap')
@Controller('sitemap')
export class SitemapController {
    constructor(private readonly sitemapService: SitemapService) {}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    @Header('Content-Type', 'application/xml')
    @ApiSwagger({ resourceName: 'Sitemap', operation: 'getOne', requiresAuth: false })
    async getSitemap(): Promise<string> {
        return this.sitemapService.generateSitemap();
    }
}
