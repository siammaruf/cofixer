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
import { TeamMemberService } from './team-member.service';
import { TeamMember } from './team-member.entity';

@ApiTags('Team')
@Controller('team')
@CacheTag('team')
@UseInterceptors(RedisCacheInterceptor)
export class TeamMemberController {
    constructor(private readonly teamMemberService: TeamMemberService) {}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Team Members',
        operation: 'getAll',
        isArray: true,
        requiresAuth: false,
        withPagination: true,
    })
    async findAll(
        @Query() paginationDto: PaginationDto,
    ): Promise<PaginatedResponseDto<TeamMember>> {
        const members = await this.teamMemberService.findActiveOrdered();
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const paginated = members.slice(skip, skip + limit);
        return new PaginatedResponseDto(
            paginated,
            page,
            limit,
            members.length,
            'Team members retrieved successfully',
        );
    }

    @Get(':id')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({
        resourceName: 'Team Member',
        operation: 'getOne',
        requiresAuth: false,
    })
    async findOne(
        @Param('id') id: string,
    ): Promise<SuccessResponseDto<TeamMember>> {
        const member = await this.teamMemberService.findByIdOrFail(id);
        return new SuccessResponseDto(
            member,
            'Team member retrieved successfully',
        );
    }
}
