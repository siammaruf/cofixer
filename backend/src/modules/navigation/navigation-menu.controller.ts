import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../core/decorators/public.decorator';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { SuccessResponseDto } from '../../shared/dtos/response.dto';
import { NavigationMenuService } from './navigation-menu.service';
import { NavigationMenu } from './navigation-menu.entity';

@ApiTags('Navigation')
@Controller('navigation')
export class NavigationMenuController {
    constructor(private readonly navigationMenuService: NavigationMenuService) {}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'Navigation', operation: 'getAll', isArray: true, requiresAuth: false })
    async findMain(): Promise<SuccessResponseDto<NavigationMenu>> {
        const menu = await this.navigationMenuService.findByNameOrDefault('main');
        return new SuccessResponseDto(menu, 'Navigation menu retrieved successfully');
    }
}
