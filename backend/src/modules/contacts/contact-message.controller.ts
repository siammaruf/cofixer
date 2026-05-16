import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../core/decorators/public.decorator';
import { ApiSwagger } from '../../core/decorators/api-swagger.decorator';
import { CreatedResponseDto } from '../../shared/dtos/response.dto';
import { ContactMessageService } from './contact-message.service';
import { ContactMessage } from './contact-message.entity';
import { CreateContactDto } from './dto';

@ApiTags('Contacts')
@Controller('contact')
export class ContactMessageController {
    constructor(private readonly contactMessageService: ContactMessageService) {}

    @Post()
    @Public()
    @HttpCode(HttpStatus.CREATED)
    @ApiSwagger({ resourceName: 'Contact', operation: 'create', requiresAuth: false })
    async create(@Body() createDto: CreateContactDto): Promise<CreatedResponseDto<ContactMessage>> {
        const message = await this.contactMessageService.create(createDto);
        return new CreatedResponseDto(message, 'Contact message submitted successfully');
    }
}
