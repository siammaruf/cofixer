import {
    IsString,
    IsOptional,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogCategoryDto {
    @ApiProperty({
        example: 'Technology',
        description: 'Category name',
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    name: string;

    @ApiProperty({
        example: 'technology',
        description: 'URL-friendly slug (unique)',
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    slug: string;

    @ApiPropertyOptional({
        example: 'Posts about technology and innovation',
        description: 'Category description',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        example: 'Technology - Cofixer Blog',
        description: 'SEO title for category page',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    seoTitle?: string;

    @ApiPropertyOptional({
        example: 'Explore the latest in technology and innovation.',
        description: 'SEO description for category page',
    })
    @IsOptional()
    @IsString()
    seoDescription?: string;
}
