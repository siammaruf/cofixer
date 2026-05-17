import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../core/decorators/public.decorator';
import { CacheTag } from '../../core/decorators/cache-tag.decorator';
import { RedisCacheInterceptor } from '../../core/interceptors/redis-cache.interceptor';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { SuccessResponseDto } from '../../shared/dtos/response.dto';
import { NavigationMenuService } from './navigation-menu.service';
import { NavigationMenu } from './navigation-menu.entity';

@ApiTags('Navigation')
@Controller('navigation')
@CacheTag('navigation')
@UseInterceptors(RedisCacheInterceptor)
export class NavigationMenuController {
    constructor(
        private readonly navigationMenuService: NavigationMenuService,
    ) {}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Navigation',
        operation: 'getAll',
        isArray: true,
        requiresAuth: false,
    })
    async findMain(): Promise<SuccessResponseDto<NavigationMenu>> {
        const menu =
            await this.navigationMenuService.findByNameOrDefault('main');
        return new SuccessResponseDto(
            menu,
            'Navigation menu retrieved successfully',
        );
    }
}
