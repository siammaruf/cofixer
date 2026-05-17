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
import { BlogPostService } from './blog-post.service';
import { BlogPost } from './blog-post.entity';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto';

@ApiTags('Admin - Blog')
@Controller('admin/blog')
@UseGuards(RolesGuard)
@UseInterceptors(CacheClearInterceptor)
export class BlogPostAdminController {
    constructor(private readonly blogPostService: BlogPostService) {}

    @Get()
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Blog Posts',
        operation: 'getAll',
        isArray: true,
        requiresAuth: true,
        withPagination: true,
    })
    async findAll(
        @Query() paginationDto: PaginationDto,
    ): Promise<PaginatedResponseDto<BlogPost>> {
        const posts = await this.blogPostService.findAll();
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

    @Get(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Blog Post',
        operation: 'getOne',
        requiresAuth: true,
    })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<SuccessResponseDto<BlogPost>> {
        const post = await this.blogPostService.findByIdOrFail(id);
        return new SuccessResponseDto(post, 'Blog post retrieved successfully');
    }

    @Post()
    @CacheClear('blog')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.CREATED)
    @ApiSwagger({
        resourceName: 'Blog Post',
        operation: 'create',
        requiresAuth: true,
    })
    async create(
        @Body() createDto: CreateBlogPostDto,
    ): Promise<CreatedResponseDto<BlogPost>> {
        const post = await this.blogPostService.create(createDto);
        return new CreatedResponseDto(post, 'Blog post created successfully');
    }

    @Patch(':id')
    @CacheClear('blog')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Blog Post',
        operation: 'update',
        requiresAuth: true,
    })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateBlogPostDto,
    ): Promise<UpdatedResponseDto<BlogPost>> {
        const post = await this.blogPostService.update(id, updateDto);
        return new UpdatedResponseDto(post!, 'Blog post updated successfully');
    }

    @Delete(':id')
    @CacheClear('blog')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Blog Post',
        operation: 'delete',
        requiresAuth: true,
    })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<DeletedResponseDto> {
        await this.blogPostService.remove(id);
        return new DeletedResponseDto('Blog post deleted successfully');
    }

    @Patch(':id/publish')
    @CacheClear('blog')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Blog Post',
        operation: 'custom',
        requiresAuth: true,
    })
    async togglePublish(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<UpdatedResponseDto<BlogPost>> {
        const post = await this.blogPostService.togglePublish(id);
        return new UpdatedResponseDto(
            post!,
            'Blog post publish status toggled',
        );
    }
}
