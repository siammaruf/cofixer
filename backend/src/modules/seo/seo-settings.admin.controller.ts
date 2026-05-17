import {
    Controller,
    Get,
    Put,
    Param,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { CacheClear } from '../../core/decorators/cache-clear.decorator';
import { CacheClearInterceptor } from '../../core/interceptors/cache-clear.interceptor';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { RolesEnum } from '../../shared/enums/role.enum';
import {
    SuccessResponseDto,
    UpdatedResponseDto,
} from '../../shared/dtos/response.dto';
import { SeoSettingsService } from './seo-settings.service';
import { SeoSettings } from './seo-settings.entity';
import { UpdateSeoSettingsDto } from './dto';

@ApiTags('Admin - SEO')
@Controller('admin/seo')
@UseGuards(RolesGuard)
@UseInterceptors(CacheClearInterceptor)
export class SeoSettingsAdminController {
    constructor(private readonly seoSettingsService: SeoSettingsService) {}

    @Get('settings')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'SEO Settings',
        operation: 'getAll',
        isArray: true,
        requiresAuth: true,
    })
    async findAll(): Promise<SuccessResponseDto<SeoSettings[]>> {
        const settings = await this.seoSettingsService.findAll();
        return new SuccessResponseDto(
            settings,
            'SEO settings retrieved successfully',
        );
    }

    @Get('page/:route')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'SEO Settings',
        operation: 'getOne',
        requiresAuth: true,
    })
    async findByRoute(
        @Param('route') route: string,
    ): Promise<SuccessResponseDto<SeoSettings>> {
        const settings =
            await this.seoSettingsService.findByRouteOrDefault(route);
        return new SuccessResponseDto(
            settings,
            'SEO settings retrieved successfully',
        );
    }

    @Put('page/:route')
    @CacheClear('seo')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'SEO Settings',
        operation: 'update',
        requiresAuth: true,
    })
    async updateByRoute(
        @Param('route') route: string,
        @Body() updateDto: UpdateSeoSettingsDto,
    ): Promise<UpdatedResponseDto<SeoSettings>> {
        const existing =
            await this.seoSettingsService.findByRouteOrDefault(route);
        if (existing.id) {
            const updated = await this.seoSettingsService.update(
                existing.id,
                updateDto,
            );
            return new UpdatedResponseDto(
                updated!,
                'SEO settings updated successfully',
            );
        }
        const created = await this.seoSettingsService.create({
            ...updateDto,
            route,
        });
        return new UpdatedResponseDto(
            created,
            'SEO settings created successfully',
        );
    }
}
