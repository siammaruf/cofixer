import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TestimonialResponseDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Testimonial unique identifier (UUID)',
    })
    id: string;

    @ApiProperty({
        example: 'Alice Smith',
        description: 'Client name',
    })
    clientName: string;

    @ApiPropertyOptional({
        example: 'CTO',
        description: 'Client role',
    })
    clientRole?: string;

    @ApiPropertyOptional({
        example: 'TechCorp Inc.',
        description: 'Client company',
    })
    company?: string;

    @ApiProperty({
        example:
            'Cofixer transformed our business with their AI solutions. Highly recommended!',
        description: 'Testimonial content',
    })
    content: string;

    @ApiProperty({
        example: 5,
        description: 'Rating (1-5)',
    })
    rating: number;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/testimonials/alice-smith.jpg',
        description: 'Client photo URL',
    })
    image?: string;

    @ApiProperty({
        example: false,
        description: 'Whether the testimonial is featured',
    })
    featured: boolean;

    @ApiProperty({
        example: true,
        description: 'Whether the testimonial is active',
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
