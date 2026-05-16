import {
    IsString,
    IsOptional,
    IsEmail,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
    @ApiProperty({
        example: 'Alice Smith',
        description: 'Contact person name',
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    name: string;

    @ApiProperty({
        example: 'alice@example.com',
        description: 'Contact email address',
        format: 'email',
    })
    @IsEmail()
    email: string;

    @ApiPropertyOptional({
        example: '+1 (555) 123-4567',
        description: 'Contact phone number',
        maxLength: 50,
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    phone?: string;

    @ApiProperty({
        example: 'Project Inquiry',
        description: 'Message subject',
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    subject: string;

    @ApiProperty({
        example: 'I would like to discuss a potential AI integration project...',
        description: 'Message content',
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    message: string;
}
