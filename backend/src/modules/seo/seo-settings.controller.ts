import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../core/decorators/public.decorator';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { SuccessResponseDto } from '../../shared/dtos/response.dto';
import { SeoSettingsService } from './seo-settings.service';
import { SeoSettings } from './seo-settings.entity';

@ApiTags('SEO')
@Controller('seo')
export class SeoSettingsController {
    constructor(private readonly seoSettingsService: SeoSettingsService) {}

    @Get('page/:route')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'SEO Settings', operation: 'getOne', requiresAuth: false })
    async findByRoute(@Param('route') route: string): Promise<SuccessResponseDto<SeoSettings>> {
        const settings = await this.seoSettingsService.findByRouteOrDefault(route);
        return new SuccessResponseDto(settings, 'SEO settings retrieved successfully');
    }
}
