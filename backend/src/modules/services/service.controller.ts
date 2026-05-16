import {
    Controller,
    Get,
    Param,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../core/decorators/public.decorator';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import {
    SuccessResponseDto,
    PaginatedResponseDto,
} from '../../shared/dtos/response.dto';
import { ServiceService } from './service.service';
import { Service } from './service.entity';

@ApiTags('Services')
@Controller('services')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) {}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Services',
        operation: 'getAll',
        isArray: true,
        requiresAuth: false,
        withPagination: true,
    })
    async findAll(
        @Query() paginationDto: PaginationDto,
    ): Promise<PaginatedResponseDto<Service>> {
        const services = await this.serviceService.findActiveOrdered();
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const paginated = services.slice(skip, skip + limit);
        return new PaginatedResponseDto(
            paginated,
            page,
            limit,
            services.length,
            'Services retrieved successfully',
        );
    }

    @Get('featured')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Featured Services',
        operation: 'custom',
        isArray: true,
        requiresAuth: false,
    })
    async findFeatured(): Promise<SuccessResponseDto<Service[]>> {
        const services = await this.serviceService.findFeatured();
        return new SuccessResponseDto(services, 'Featured services retrieved successfully');
    }

    @Get(':slug')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Service',
        operation: 'getOne',
        requiresAuth: false,
    })
    async findOne(@Param('slug') slug: string): Promise<SuccessResponseDto<Service>> {
        const service = await this.serviceService.findBySlugOrFail(slug);
        return new SuccessResponseDto(service, 'Service retrieved successfully');
    }
}
