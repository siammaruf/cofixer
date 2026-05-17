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
import { RobotsService } from './robots.service';

@ApiTags('Robots')
@Controller('robots-txt')
@CacheTag('robots')
@UseInterceptors(RedisCacheInterceptor)
export class RobotsController {
    constructor(private readonly robotsService: RobotsService) {}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    @Header('Content-Type', 'text/plain')
    @ApiSwagger({
        resourceName: 'Robots.txt',
        operation: 'getOne',
        requiresAuth: false,
    })
    async getRobotsTxt(): Promise<string> {
        return this.robotsService.getRobotsTxt();
    }
}
