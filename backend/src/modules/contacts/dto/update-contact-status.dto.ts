import {
    IsString,
    IsOptional,
    IsBoolean,
    IsIn,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContactStatusDto {
    @ApiProperty({
        example: 'in_progress',
        description: 'Contact message status',
        enum: ['new', 'in_progress', 'resolved', 'spam'],
    })
    @IsString()
    @IsIn(['new', 'in_progress', 'resolved', 'spam'])
    status: 'new' | 'in_progress' | 'resolved' | 'spam';

    @ApiPropertyOptional({
        example: true,
        description: 'Whether the message has been read',
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    read?: boolean;

    @ApiPropertyOptional({
        example: 'Follow-up call scheduled for next week.',
        description: 'Internal admin notes about this message',
        maxLength: 2000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    notes?: string;
}
