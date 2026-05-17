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
import { StatsService } from './stats.service';

@ApiTags('Stats')
@Controller('stats')
@CacheTag('stats')
@UseInterceptors(RedisCacheInterceptor)
export class StatsController {
    constructor(private readonly statsService: StatsService) {}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Stats',
        operation: 'getOne',
        requiresAuth: false,
    })
    async getStats(): Promise<SuccessResponseDto<Record<string, number>>> {
        const stats = await this.statsService.getStats();
        return new SuccessResponseDto(stats, 'Stats retrieved successfully');
    }
}
