import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
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
import { RolesEnum } from '../../shared/enums/role.enum';
import {
    CreatedResponseDto,
    SuccessResponseDto,
    UpdatedResponseDto,
    DeletedResponseDto,
} from '../../shared/dtos/response.dto';
import { BlogCategoryService } from './blog-category.service';
import { BlogCategory } from './blog-category.entity';
import { CreateBlogCategoryDto, UpdateBlogCategoryDto } from './dto';

@ApiTags('Admin - Blog Categories')
@Controller('admin/blog/categories')
@UseGuards(RolesGuard)
@UseInterceptors(CacheClearInterceptor)
export class BlogCategoryController {
    constructor(private readonly blogCategoryService: BlogCategoryService) {}

    @Get()
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Blog Categories',
        operation: 'getAll',
        isArray: true,
        requiresAuth: true,
    })
    async findAll(): Promise<
        SuccessResponseDto<
            (Omit<
                BlogCategory,
                | 'hasId'
                | 'save'
                | 'remove'
                | 'softRemove'
                | 'recover'
                | 'reload'
            > & { postCount: number })[]
        >
    > {
        const categories = await this.blogCategoryService.findWithPostCount();
        return new SuccessResponseDto(
            categories,
            'Blog categories retrieved successfully',
        );
    }

    @Get(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Blog Category',
        operation: 'getOne',
        requiresAuth: true,
    })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<SuccessResponseDto<BlogCategory>> {
        const category = await this.blogCategoryService.findByIdOrFail(id, {
            posts: true,
        });
        return new SuccessResponseDto(
            category,
            'Blog category retrieved successfully',
        );
    }

    @Post()
    @CacheClear('blog')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.CREATED)
    @ApiSwagger({
        resourceName: 'Blog Category',
        operation: 'create',
        requiresAuth: true,
    })
    async create(
        @Body() createDto: CreateBlogCategoryDto,
    ): Promise<CreatedResponseDto<BlogCategory>> {
        const category = await this.blogCategoryService.create(createDto);
        return new CreatedResponseDto(
            category,
            'Blog category created successfully',
        );
    }

    @Patch(':id')
    @CacheClear('blog')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Blog Category',
        operation: 'update',
        requiresAuth: true,
    })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateBlogCategoryDto,
    ): Promise<UpdatedResponseDto<BlogCategory>> {
        const category = await this.blogCategoryService.update(id, updateDto);
        return new UpdatedResponseDto(
            category!,
            'Blog category updated successfully',
        );
    }

    @Delete(':id')
    @CacheClear('blog')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Blog Category',
        operation: 'delete',
        requiresAuth: true,
    })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<DeletedResponseDto> {
        await this.blogCategoryService.remove(id);
        return new DeletedResponseDto('Blog category deleted successfully');
    }
}
