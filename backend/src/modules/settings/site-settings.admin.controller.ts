import {
    Controller,
    Get,
    Put,
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
import { SiteSettingsService } from './site-settings.service';
import { SiteSettings } from './site-settings.entity';
import { UpdateSiteSettingsDto } from './dto';

@ApiTags('Admin - Settings')
@Controller('admin/settings')
@UseGuards(RolesGuard)
@UseInterceptors(CacheClearInterceptor)
export class SiteSettingsAdminController {
    constructor(private readonly siteSettingsService: SiteSettingsService) {}

    @Get('general')
    @Roles(RolesEnum.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Site Settings',
        operation: 'getOne',
        requiresAuth: true,
    })
    async findFirst(): Promise<SuccessResponseDto<SiteSettings>> {
        const settings = await this.siteSettingsService.findFirstOrCreate();
        return new SuccessResponseDto(
            settings,
            'Site settings retrieved successfully',
        );
    }

    @Put('general')
    @CacheClear('settings')
    @Roles(RolesEnum.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Site Settings',
        operation: 'update',
        requiresAuth: true,
    })
    async update(
        @Body() updateDto: UpdateSiteSettingsDto,
    ): Promise<UpdatedResponseDto<SiteSettings>> {
        const existing = await this.siteSettingsService.findFirstOrCreate();
        const updated = await this.siteSettingsService.update(
            existing.id,
            updateDto,
        );
        return new UpdatedResponseDto(
            updated!,
            'Site settings updated successfully',
        );
    }
}
