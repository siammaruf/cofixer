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
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
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
import { ServiceService } from './service.service';
import { Service } from './service.entity';
import { CreateServiceDto, UpdateServiceDto } from './dto';

@ApiTags('Admin - Services')
@Controller('admin/services')
@UseGuards(RolesGuard)
export class ServiceAdminController {
    constructor(private readonly serviceService: ServiceService) {}

    @Get()
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Services',
        operation: 'getAll',
        isArray: true,
        requiresAuth: true,
        withPagination: true,
    })
    async findAll(
        @Query() paginationDto: PaginationDto,
    ): Promise<PaginatedResponseDto<Service>> {
        const services = await this.serviceService.findAll();
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

    @Get(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Service',
        operation: 'getOne',
        requiresAuth: true,
    })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<SuccessResponseDto<Service>> {
        const service = await this.serviceService.findByIdOrFail(id);
        return new SuccessResponseDto(service, 'Service retrieved successfully');
    }

    @Post()
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.CREATED)
    @ApiSwagger({
        resourceName: 'Service',
        operation: 'create',
        requiresAuth: true,
    })
    async create(
        @Body() createDto: CreateServiceDto,
    ): Promise<CreatedResponseDto<Service>> {
        const service = await this.serviceService.create(createDto);
        return new CreatedResponseDto(service, 'Service created successfully');
    }

    @Patch(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Service',
        operation: 'update',
        requiresAuth: true,
    })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateServiceDto,
    ): Promise<UpdatedResponseDto<Service>> {
        const service = await this.serviceService.update(id, updateDto as any);
        return new UpdatedResponseDto(service!, 'Service updated successfully');
    }

    @Delete(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Service',
        operation: 'delete',
        requiresAuth: true,
    })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<DeletedResponseDto> {
        await this.serviceService.remove(id);
        return new DeletedResponseDto('Service deleted successfully');
    }

    @Patch(':id/feature')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Service',
        operation: 'custom',
        requiresAuth: true,
    })
    async toggleFeatured(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<UpdatedResponseDto<Service>> {
        const service = await this.serviceService.toggleFeatured(id);
        return new UpdatedResponseDto(service!, 'Service featured status toggled');
    }

    @Post('reorder')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Services',
        operation: 'custom',
        requiresAuth: true,
    })
    async reorder(
        @Body() body: { ids: string[] },
    ): Promise<SuccessResponseDto<{ message: string }>> {
        await this.serviceService.reorder(body.ids);
        return new SuccessResponseDto({ message: 'Services reordered' }, 'Services reordered successfully');
    }
}
