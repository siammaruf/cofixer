import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ServiceResponseDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Service unique identifier (UUID)',
    })
    id: string;

    @ApiProperty({
        example: 'AI Strategy & Consulting',
        description: 'Service title',
    })
    title: string;

    @ApiProperty({
        example: 'ai-strategy-consulting',
        description: 'URL-friendly slug',
    })
    slug: string;

    @ApiProperty({
        example:
            '<p>We assess your business and identify high-impact AI opportunities...</p>',
        description: 'Full service description',
    })
    description: string;

    @ApiPropertyOptional({
        example: 'Strategic AI consulting to transform your business.',
        description: 'Short description for cards/previews',
    })
    shortDescription?: string;

    @ApiProperty({
        example: 'brain',
        description: 'Icon name or identifier',
    })
    icon: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/services/ai-strategy.jpg',
        description: 'Service image URL',
    })
    image?: string;

    @ApiPropertyOptional({
        example: 1,
        description: 'Display order',
    })
    order?: number;

    @ApiProperty({
        example: false,
        description: 'Whether the service is featured',
    })
    featured: boolean;

    @ApiProperty({
        example: true,
        description: 'Whether the service is active',
    })
    isActive: boolean;

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
