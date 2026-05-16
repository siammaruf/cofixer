import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../core/decorators/public.decorator';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { SuccessResponseDto, PaginatedResponseDto } from '../../shared/dtos/response.dto';
import { FaqService } from './faq.service';
import { Faq } from './faq.entity';

@ApiTags('FAQs')
@Controller('faqs')
export class FaqController {
    constructor(private readonly faqService: FaqService) {}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'FAQs', operation: 'getAll', isArray: true, requiresAuth: false, withPagination: true })
    async findAll(@Query() paginationDto: PaginationDto): Promise<PaginatedResponseDto<Faq>> {
        const faqs = await this.faqService.findActiveOrdered();
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const paginated = faqs.slice(skip, skip + limit);
        return new PaginatedResponseDto(paginated, page, limit, faqs.length, 'FAQs retrieved successfully');
    }
}
