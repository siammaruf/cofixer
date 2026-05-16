import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { RolesEnum } from '../../shared/enums/role.enum';
import { CreatedResponseDto, SuccessResponseDto, UpdatedResponseDto, DeletedResponseDto, PaginatedResponseDto } from '../../shared/dtos/response.dto';
import { TeamMemberService } from './team-member.service';
import { TeamMember } from './team-member.entity';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from './dto';

@ApiTags('Admin - Team')
@Controller('admin/team')
@UseGuards(RolesGuard)
export class TeamMemberAdminController {
    constructor(private readonly teamMemberService: TeamMemberService) {}

    @Get()
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'Team Members', operation: 'getAll', isArray: true, requiresAuth: true, withPagination: true })
    async findAll(@Query() paginationDto: PaginationDto): Promise<PaginatedResponseDto<TeamMember>> {
        const members = await this.teamMemberService.findAll();
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const paginated = members.slice(skip, skip + limit);
        return new PaginatedResponseDto(paginated, page, limit, members.length, 'Team members retrieved successfully');
    }

    @Get(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'Team Member', operation: 'getOne', requiresAuth: true })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<SuccessResponseDto<TeamMember>> {
        const member = await this.teamMemberService.findByIdOrFail(id);
        return new SuccessResponseDto(member, 'Team member retrieved successfully');
    }

    @Post()
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.CREATED)
    @ApiSwagger({ resourceName: 'Team Member', operation: 'create', requiresAuth: true })
    async create(@Body() createDto: CreateTeamMemberDto): Promise<CreatedResponseDto<TeamMember>> {
        const member = await this.teamMemberService.create(createDto);
        return new CreatedResponseDto(member, 'Team member created successfully');
    }

    @Patch(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'Team Member', operation: 'update', requiresAuth: true })
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateTeamMemberDto): Promise<UpdatedResponseDto<TeamMember>> {
        const member = await this.teamMemberService.update(id, updateDto as any);
        return new UpdatedResponseDto(member!, 'Team member updated successfully');
    }

    @Delete(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'Team Member', operation: 'delete', requiresAuth: true })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeletedResponseDto> {
        await this.teamMemberService.remove(id);
        return new DeletedResponseDto('Team member deleted successfully');
    }
}
