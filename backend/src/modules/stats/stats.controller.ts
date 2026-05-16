import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../core/decorators/public.decorator';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { SuccessResponseDto } from '../../shared/dtos/response.dto';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) {}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'Stats', operation: 'getOne', requiresAuth: false })
    async getStats(): Promise<SuccessResponseDto<Record<string, number>>> {
        const stats = await this.statsService.getStats();
        return new SuccessResponseDto(stats, 'Stats retrieved successfully');
    }
}
