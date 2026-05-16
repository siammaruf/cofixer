import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { RolesEnum } from '../../shared/enums/role.enum';
import { CreatedResponseDto, SuccessResponseDto, UpdatedResponseDto, DeletedResponseDto, PaginatedResponseDto } from '../../shared/dtos/response.dto';
import { FaqService } from './faq.service';
import { Faq } from './faq.entity';
import { CreateFaqDto, UpdateFaqDto } from './dto';

@ApiTags('Admin - FAQs')
@Controller('admin/faqs')
@UseGuards(RolesGuard)
export class FaqAdminController {
    constructor(private readonly faqService: FaqService) {}

    @Get()
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'FAQs', operation: 'getAll', isArray: true, requiresAuth: true, withPagination: true })
    async findAll(@Query() paginationDto: PaginationDto): Promise<PaginatedResponseDto<Faq>> {
        const faqs = await this.faqService.findAll();
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const paginated = faqs.slice(skip, skip + limit);
        return new PaginatedResponseDto(paginated, page, limit, faqs.length, 'FAQs retrieved successfully');
    }

    @Get(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'FAQ', operation: 'getOne', requiresAuth: true })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<SuccessResponseDto<Faq>> {
        const faq = await this.faqService.findByIdOrFail(id);
        return new SuccessResponseDto(faq, 'FAQ retrieved successfully');
    }

    @Post()
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.CREATED)
    @ApiSwagger({ resourceName: 'FAQ', operation: 'create', requiresAuth: true })
    async create(@Body() createDto: CreateFaqDto): Promise<CreatedResponseDto<Faq>> {
        const faq = await this.faqService.create(createDto);
        return new CreatedResponseDto(faq, 'FAQ created successfully');
    }

    @Patch(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'FAQ', operation: 'update', requiresAuth: true })
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateFaqDto): Promise<UpdatedResponseDto<Faq>> {
        const faq = await this.faqService.update(id, updateDto as any);
        return new UpdatedResponseDto(faq!, 'FAQ updated successfully');
    }

    @Delete(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'FAQ', operation: 'delete', requiresAuth: true })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeletedResponseDto> {
        await this.faqService.remove(id);
        return new DeletedResponseDto('FAQ deleted successfully');
    }
}
