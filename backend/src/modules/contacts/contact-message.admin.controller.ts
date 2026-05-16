import { Controller, Get, Put, Delete, Param, Query, Body, HttpCode, HttpStatus, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { PaginationDto } from '../../shared/dtos/pagination.dto';
import { RolesEnum } from '../../shared/enums/role.enum';
import { SuccessResponseDto, UpdatedResponseDto, DeletedResponseDto, PaginatedResponseDto } from '../../shared/dtos/response.dto';
import { ContactMessageService } from './contact-message.service';
import { ContactMessage } from './contact-message.entity';
import { UpdateContactStatusDto } from './dto';

@ApiTags('Admin - Contacts')
@Controller('admin/contacts')
@UseGuards(RolesGuard)
export class ContactMessageAdminController {
    constructor(private readonly contactMessageService: ContactMessageService) {}

    @Get()
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'Contact Messages', operation: 'getAll', isArray: true, requiresAuth: true, withPagination: true })
    async findAll(@Query() paginationDto: PaginationDto): Promise<PaginatedResponseDto<ContactMessage>> {
        const messages = await this.contactMessageService.findAll();
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const paginated = messages.slice(skip, skip + limit);
        return new PaginatedResponseDto(paginated, page, limit, messages.length, 'Contact messages retrieved successfully');
    }

    @Get(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'Contact Message', operation: 'getOne', requiresAuth: true })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<SuccessResponseDto<ContactMessage>> {
        const message = await this.contactMessageService.findByIdOrFail(id);
        return new SuccessResponseDto(message, 'Contact message retrieved successfully');
    }

    @Put(':id/read')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'Contact Message', operation: 'custom', requiresAuth: true })
    async markAsRead(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateContactStatusDto,
    ): Promise<UpdatedResponseDto<ContactMessage>> {
        const message = await this.contactMessageService.update(id, {
            read: updateDto.read,
            status: updateDto.status,
            notes: updateDto.notes,
        } as any);
        return new UpdatedResponseDto(message!, 'Contact message updated successfully');
    }

    @Delete(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.MODERATOR)
    @HttpCode(HttpStatus.OK)
    @ApiSwagger({ resourceName: 'Contact Message', operation: 'delete', requiresAuth: true })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeletedResponseDto> {
        await this.contactMessageService.remove(id);
        return new DeletedResponseDto('Contact message deleted successfully');
    }
}
