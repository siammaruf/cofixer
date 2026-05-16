import { Controller, Get, HttpCode, HttpStatus, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../core/decorators/public.decorator';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { RobotsService } from './robots.service';

@ApiTags('Robots')
@Controller('robots-txt')
export class RobotsController {
    constructor(private readonly robotsService: RobotsService) {}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    @Header('Content-Type', 'text/plain')
    @ApiSwagger({ resourceName: 'Robots.txt', operation: 'getOne', requiresAuth: false })
    async getRobotsTxt(): Promise<string> {
        return this.robotsService.getRobotsTxt();
    }
}
