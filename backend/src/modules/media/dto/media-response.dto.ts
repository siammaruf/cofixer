import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MediaResponseDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Media unique identifier (UUID)',
    })
    id: string;

    @ApiProperty({
        example: 'ai-business-2024.webp',
        description: 'Stored file name',
    })
    filename: string;

    @ApiProperty({
        example: 'ai-business-photo.jpg',
        description: 'Original uploaded file name',
    })
    originalName: string;

    @ApiProperty({
        example: 'image/webp',
        description: 'MIME type',
    })
    mimeType: string;

    @ApiProperty({
        example: 204800,
        description: 'File size in bytes',
    })
    size: number;

    @ApiProperty({
        example: 'https://cofixer.com/uploads/ai-business-2024.webp',
        description: 'Public URL',
    })
    url: string;

    @ApiPropertyOptional({
        example: 'AI business transformation illustration',
        description: 'Alt text',
    })
    altText?: string;

    @ApiPropertyOptional({
        example: 'blog-images',
        description: 'Folder / category',
    })
    folder?: string;

    @ApiProperty({
        example: true,
        description: 'Whether the media is active',
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
