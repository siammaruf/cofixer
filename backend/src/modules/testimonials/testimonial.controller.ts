import {
    Controller,
    Get,
    Query,
    HttpCode,
    HttpStatus,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../core/decorators/public.decorator';
import { CacheTag } from '../../core/decorators/cache-tag.decorator';
import { RedisCacheInterceptor } from '../../core/interceptors/redis-cache.interceptor';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { PaginatedResponseDto } from '../../shared/dtos/response.dto';
import { TestimonialService } from './testimonial.service';
import { Testimonial } from './testimonial.entity';

@ApiTags('Testimonials')
@Controller('testimonials')
@CacheTag('testimonials')
@UseInterceptors(RedisCacheInterceptor)
export class TestimonialController {
    constructor(private readonly testimonialService: TestimonialService) {}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Testimonials',
        operation: 'getAll',
        isArray: true,
        requiresAuth: false,
        withPagination: true,
    })
    async findAll(
        @Query() paginationDto: PaginationDto,
    ): Promise<PaginatedResponseDto<Testimonial>> {
        const testimonials =
            await this.testimonialService.findActiveFeaturedFirst();
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const paginated = testimonials.slice(skip, skip + limit);
        return new PaginatedResponseDto(
            paginated,
            page,
            limit,
            testimonials.length,
            'Testimonials retrieved successfully',
        );
    }
}
