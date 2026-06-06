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
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto';

@ApiTags('Admin - Projects')
@Controller('admin/projects')
@UseGuards(RolesGuard)
@UseInterceptors(CacheClearInterceptor)
export class ProjectAdminController {
    constructor(private readonly projectService: ProjectService) {}

    @Get()
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Projects',
        operation: 'getAll',
        isArray: true,
        requiresAuth: true,
        withPagination: true,
    })
    async findAll(
        @Query() paginationDto: PaginationDto,
    ): Promise<PaginatedResponseDto<Project>> {
        const order: any = {};
        if (paginationDto.sortBy) {
            order[paginationDto.sortBy] = paginationDto.sortOrder || 'DESC';
            order.id = 'DESC';
        } else {
            order.createdAt = 'DESC';
            order.id = 'DESC';
        }
        const projects = await this.projectService.findAll({ order });
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const paginated = projects.slice(skip, skip + limit);
        return new PaginatedResponseDto(
            paginated,
            page,
            limit,
            projects.length,
            'Projects retrieved successfully',
        );
    }

    @Get(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Project',
        operation: 'getOne',
        requiresAuth: true,
    })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<SuccessResponseDto<Project>> {
        const project = await this.projectService.findByIdOrFail(id);
        return new SuccessResponseDto(
            project,
            'Project retrieved successfully',
        );
    }

    @Post()
    @CacheClear('projects')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.CREATED)
    @ApiSwagger({
        resourceName: 'Project',
        operation: 'create',
        requiresAuth: true,
    })
    async create(
        @Body() createDto: CreateProjectDto,
    ): Promise<CreatedResponseDto<Project>> {
        const project = await this.projectService.create(createDto);
        return new CreatedResponseDto(project, 'Project created successfully');
    }

    @Patch(':id')
    @CacheClear('projects')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Project',
        operation: 'update',
        requiresAuth: true,
    })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateProjectDto,
    ): Promise<UpdatedResponseDto<Project>> {
        const project = await this.projectService.update(id, updateDto);
        return new UpdatedResponseDto(project!, 'Project updated successfully');
    }

    @Delete(':id')
    @CacheClear('projects')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Project',
        operation: 'delete',
        requiresAuth: true,
    })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<DeletedResponseDto> {
        await this.projectService.remove(id);
        return new DeletedResponseDto('Project deleted successfully');
    }

    @Patch(':id/feature')
    @CacheClear('projects')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Project',
        operation: 'custom',
        requiresAuth: true,
    })
    async toggleFeatured(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<UpdatedResponseDto<Project>> {
        const project = await this.projectService.toggleFeatured(id);
        return new UpdatedResponseDto(
            project!,
            'Project featured status toggled',
        );
    }
}
