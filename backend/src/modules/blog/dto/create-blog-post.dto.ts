import {
    IsString,
    IsOptional,
    IsBoolean,
    IsArray,
    IsDate,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogPostDto {
    @ApiProperty({
        example: 'The Future of AI in Business',
        description: 'Blog post title',
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    title: string;

    @ApiProperty({
        example: 'future-of-ai-in-business',
        description: 'URL-friendly slug (unique)',
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    slug: string;

    @ApiProperty({
        example:
            'Discover how AI is transforming modern business operations and decision-making.',
        description: 'Short excerpt for previews and meta description',
        maxLength: 500,
    })
    @IsString()
    @MaxLength(500)
    excerpt: string;

    @ApiProperty({
        example:
            '<p>Artificial Intelligence is no longer a futuristic concept...</p>',
        description: 'Full blog post content (HTML / rich text)',
    })
    @IsString()
    content: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/blog/ai-business.jpg',
        description: 'Cover image URL',
    })
    @IsOptional()
    @IsString()
    coverImage?: string;

    @ApiPropertyOptional({
        example: 'AI Strategy',
        description: 'Blog post category',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    category?: string;

    @ApiPropertyOptional({
        example: ['AI', 'Business', 'Technology'],
        description: 'Tags for the blog post',
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({
        example: 'Jane Doe',
        description: 'Author display name',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    authorName?: string;

    @ApiPropertyOptional({
        example: '2024-11-02T10:30:00.000Z',
        description: 'Scheduled publish date',
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    publishedAt?: Date;

    @ApiPropertyOptional({
        example: false,
        description: 'Whether the post is published',
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;
}
