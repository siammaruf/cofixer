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
import { NavigationMenuService } from './navigation-menu.service';
import { NavigationMenu } from './navigation-menu.entity';
import { UpdateNavigationMenuDto } from './dto';

@ApiTags('Admin - Navigation')
@Controller('admin/navigation')
@UseGuards(RolesGuard)
@UseInterceptors(CacheClearInterceptor)
export class NavigationMenuAdminController {
    constructor(
        private readonly navigationMenuService: NavigationMenuService,
    ) {}

    @Get()
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Navigation',
        operation: 'getAll',
        isArray: true,
        requiresAuth: true,
    })
    async findAll(): Promise<SuccessResponseDto<NavigationMenu[]>> {
        const menus = await this.navigationMenuService.findAll();
        return new SuccessResponseDto(
            menus,
            'Navigation menus retrieved successfully',
        );
    }

    @Put()
    @CacheClear('navigation')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Navigation',
        operation: 'update',
        requiresAuth: true,
    })
    async update(
        @Body() updateDto: UpdateNavigationMenuDto,
    ): Promise<UpdatedResponseDto<NavigationMenu>> {
        const existing = await this.navigationMenuService.findByNameOrDefault(
            updateDto.name,
        );
        if (existing.id) {
            const updated = await this.navigationMenuService.update(
                existing.id,
                {
                    items: updateDto.items,
                    isActive: updateDto.isActive,
                },
            );
            return new UpdatedResponseDto(
                updated!,
                'Navigation menu updated successfully',
            );
        }
        const created = await this.navigationMenuService.create({
            name: updateDto.name,
            items: updateDto.items,
            isActive: updateDto.isActive ?? true,
        });
        return new UpdatedResponseDto(
            created,
            'Navigation menu created successfully',
        );
    }
}
