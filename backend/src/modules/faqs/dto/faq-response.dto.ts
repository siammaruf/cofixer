import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FaqResponseDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'FAQ unique identifier (UUID)',
    })
    id: string;

    @ApiProperty({
        example: 'What services does Cofixer offer?',
        description: 'Frequently asked question',
    })
    question: string;

    @ApiProperty({
        example:
            'Cofixer offers AI strategy, integration, and custom solutions...',
        description: 'Answer to the question',
    })
    answer: string;

    @ApiPropertyOptional({
        example: 'Services',
        description: 'FAQ category',
    })
    category?: string;

    @ApiPropertyOptional({
        example: 1,
        description: 'Display order',
    })
    order?: number;

    @ApiProperty({
        example: true,
        description: 'Whether the FAQ is active',
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
