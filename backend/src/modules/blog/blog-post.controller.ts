import {
    Controller,
    Get,
    Param,
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
import {
    SuccessResponseDto,
    PaginatedResponseDto,
} from '../../shared/dtos/response.dto';
import { BlogPostService } from './blog-post.service';
import { BlogPost } from './blog-post.entity';

@ApiTags('Blog')
@Controller('blog')
@CacheTag('blog')
@UseInterceptors(RedisCacheInterceptor)
export class BlogPostController {
    constructor(private readonly blogPostService: BlogPostService) {}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Blog Posts',
        operation: 'getAll',
        isArray: true,
        requiresAuth: false,
        withPagination: true,
    })
    async findAll(
        @Query() paginationDto: PaginationDto,
    ): Promise<PaginatedResponseDto<BlogPost>> {
        const posts = await this.blogPostService.findPublished();
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const paginated = posts.slice(skip, skip + limit);
        return new PaginatedResponseDto(
            paginated,
            page,
            limit,
            posts.length,
            'Blog posts retrieved successfully',
        );
    }

    @Get(':slug')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Blog Post',
        operation: 'getOne',
        requiresAuth: false,
    })
    async findOne(
        @Param('slug') slug: string,
    ): Promise<SuccessResponseDto<BlogPost>> {
        const post = await this.blogPostService.findBySlugOrFail(slug);
        return new SuccessResponseDto(post, 'Blog post retrieved successfully');
    }
}
