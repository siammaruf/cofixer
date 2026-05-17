import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpCode,
    HttpStatus,
    UseGuards,
    UseInterceptors,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { CacheClear } from '../../core/decorators/cache-clear.decorator';
import { CacheClearInterceptor } from '../../core/interceptors/cache-clear.interceptor';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { RolesEnum } from '../../shared/enums/role.enum';
import {
    CreatedResponseDto,
    SuccessResponseDto,
    UpdatedResponseDto,
    DeletedResponseDto,
    PaginatedResponseDto,
} from '../../shared/dtos/response.dto';
import { TestimonialService } from './testimonial.service';
import { Testimonial } from './testimonial.entity';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto';

@ApiTags('Admin - Testimonials')
@Controller('admin/testimonials')
@UseGuards(RolesGuard)
@UseInterceptors(CacheClearInterceptor)
export class TestimonialAdminController {
    constructor(private readonly testimonialService: TestimonialService) {}

    @Get()
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Testimonials',
        operation: 'getAll',
        isArray: true,
        requiresAuth: true,
        withPagination: true,
    })
    async findAll(
        @Query() paginationDto: PaginationDto,
    ): Promise<PaginatedResponseDto<Testimonial>> {
        const testimonials = await this.testimonialService.findAll();
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

    @Get(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Testimonial',
        operation: 'getOne',
        requiresAuth: true,
    })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<SuccessResponseDto<Testimonial>> {
        const testimonial = await this.testimonialService.findByIdOrFail(id);
        return new SuccessResponseDto(
            testimonial,
            'Testimonial retrieved successfully',
        );
    }

    @Post()
    @CacheClear('testimonials')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.CREATED)
    @ApiSwagger({
        resourceName: 'Testimonial',
        operation: 'create',
        requiresAuth: true,
    })
    async create(
        @Body() createDto: CreateTestimonialDto,
    ): Promise<CreatedResponseDto<Testimonial>> {
        const testimonial = await this.testimonialService.create(createDto);
        return new CreatedResponseDto(
            testimonial,
            'Testimonial created successfully',
        );
    }

    @Patch(':id')
    @CacheClear('testimonials')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Testimonial',
        operation: 'update',
        requiresAuth: true,
    })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateTestimonialDto,
    ): Promise<UpdatedResponseDto<Testimonial>> {
        const testimonial = await this.testimonialService.update(id, updateDto);
        return new UpdatedResponseDto(
            testimonial!,
            'Testimonial updated successfully',
        );
    }

    @Delete(':id')
    @CacheClear('testimonials')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Testimonial',
        operation: 'delete',
        requiresAuth: true,
    })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<DeletedResponseDto> {
        await this.testimonialService.remove(id);
        return new DeletedResponseDto('Testimonial deleted successfully');
    }

    @Patch(':id/feature')
    @CacheClear('testimonials')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Testimonial',
        operation: 'custom',
        requiresAuth: true,
    })
    async toggleFeatured(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<UpdatedResponseDto<Testimonial>> {
        const testimonial = await this.testimonialService.toggleFeatured(id);
        return new UpdatedResponseDto(
            testimonial!,
            'Testimonial featured status toggled',
        );
    }
}
