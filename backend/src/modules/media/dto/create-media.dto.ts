import {
    IsString,
    IsOptional,
    IsInt,
    Min,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMediaDto {
    @ApiProperty({
        example: 'ai-business-2024.webp',
        description: 'Stored file name',
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    filename: string;

    @ApiProperty({
        example: 'ai-business-photo.jpg',
        description: 'Original uploaded file name',
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    originalName: string;

    @ApiProperty({
        example: 'image/webp',
        description: 'MIME type of the file',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    mimeType: string;

    @ApiProperty({
        example: 204800,
        description: 'File size in bytes',
        minimum: 0,
    })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    size: number;

    @ApiProperty({
        example: 'https://cofixer.com/uploads/ai-business-2024.webp',
        description: 'Public URL to access the file',
    })
    @IsString()
    url: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/uploads/ai-business-2024-thumb.webp',
        description: 'Thumbnail URL',
    })
    @IsOptional()
    @IsString()
    thumbUrl?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/uploads/ai-business-2024-large.webp',
        description: 'Large version URL',
    })
    @IsOptional()
    @IsString()
    largeUrl?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/uploads/ai-business-2024-full.webp',
        description: 'Full optimized version URL',
    })
    @IsOptional()
    @IsString()
    fullUrl?: string;

    @ApiPropertyOptional({
        example: 'AI business transformation illustration',
        description: 'Alt text for accessibility and SEO',
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    altText?: string;

    @ApiPropertyOptional({
        example: 'blog-images',
        description: 'Folder / category for organization',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    folder?: string;
}
