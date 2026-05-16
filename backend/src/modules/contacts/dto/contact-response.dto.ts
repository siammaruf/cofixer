import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContactResponseDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Contact message unique identifier (UUID)',
    })
    id: string;

    @ApiProperty({
        example: 'Alice Smith',
        description: 'Contact person name',
    })
    name: string;

    @ApiProperty({
        example: 'alice@example.com',
        description: 'Contact email address',
    })
    email: string;

    @ApiPropertyOptional({
        example: '+1 (555) 123-4567',
        description: 'Contact phone number',
    })
    phone?: string;

    @ApiProperty({
        example: 'Project Inquiry',
        description: 'Message subject',
    })
    subject: string;

    @ApiProperty({
        example: 'I would like to discuss a potential AI integration project...',
        description: 'Message content',
    })
    message: string;

    @ApiProperty({
        example: 'new',
        description: 'Message status',
        enum: ['new', 'in_progress', 'resolved', 'spam'],
    })
    status: 'new' | 'in_progress' | 'resolved' | 'spam';

    @ApiProperty({
        example: false,
        description: 'Whether the message has been read',
    })
    read: boolean;

    @ApiPropertyOptional({
        example: 'Follow-up call scheduled for next week.',
        description: 'Internal admin notes',
    })
    notes?: string;

    @ApiProperty({
        example: '2024-11-02T10:30:00.000Z',
        description: 'Record creation timestamp',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2024-11-02T10:30:00.000Z',
        description: 'Record last update timestamp',
    })
    updatedAt: Date;

    @ApiPropertyOptional({
        example: null,
        description: 'Record deletion timestamp (soft delete)',
    })
    deletedAt?: Date;
}
