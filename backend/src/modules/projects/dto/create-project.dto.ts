import {
    IsString,
    IsOptional,
    IsBoolean,
    IsArray,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
    @ApiProperty({
        example: 'AI-Powered E-commerce Platform',
        description: 'Project title',
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    title: string;

    @ApiProperty({
        example: 'ai-powered-ecommerce-platform',
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
            'Built a fully AI-driven e-commerce platform with personalized recommendations.',
        description: 'Brief project summary',
        maxLength: 1000,
    })
    @IsString()
    @MaxLength(1000)
    summary: string;

    @ApiProperty({
        example:
            '<p>This project involved building a complete e-commerce solution...</p>',
        description: 'Full project description / case study (HTML supported)',
    })
    @IsString()
    description: string;

    @ApiPropertyOptional({
        example: 'TechCorp Inc.',
        description: 'Client name',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    clientName?: string;

    @ApiProperty({
        example: 'E-commerce',
        description: 'Project category',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    category: string;

    @ApiPropertyOptional({
        example: [
            'https://cofixer.com/images/projects/ecomm-1.jpg',
            'https://cofixer.com/images/projects/ecomm-2.jpg',
        ],
        description: 'Project gallery images',
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/projects/ecomm-featured.jpg',
        description: 'Featured image for project card',
    })
    @IsOptional()
    @IsString()
    featuredImage?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/projects/ecomm-featured.jpg',
        description: 'Project image URL',
    })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com',
        description: 'Live project URL',
    })
    @IsOptional()
    @IsString()
    liveUrl?: string;

    @ApiPropertyOptional({
        example: 'https://github.com/cofixer/project',
        description: 'GitHub repository URL',
    })
    @IsOptional()
    @IsString()
    githubUrl?: string;

    @ApiPropertyOptional({
        example: ['React', 'Node.js', 'PostgreSQL'],
        description: 'Technology stack used',
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    techStack?: string[];

    @ApiPropertyOptional({
        example: false,
        description: 'Whether the project is featured on homepage',
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @ApiPropertyOptional({
        example: true,
        description: 'Whether the project is active and visible',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({
        example: 'AI-Powered E-commerce Platform - Cofixer',
        description: 'SEO meta title (overrides default title)',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    metaTitle?: string;

    @ApiPropertyOptional({
        example: 'We built a fully AI-driven e-commerce platform with personalized recommendations for TechCorp Inc.',
        description: 'SEO meta description',
    })
    @IsOptional()
    @IsString()
    metaDescription?: string;

    @ApiPropertyOptional({
        example: 'AI, e-commerce, React, Node.js, PostgreSQL',
        description: 'SEO meta keywords (comma-separated)',
    })
    @IsOptional()
    @IsString()
    metaKeywords?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/projects/ecomm-og.jpg',
        description: 'Open Graph image URL for social sharing',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    ogImage?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/projects/ai-powered-ecommerce-platform',
        description: 'Canonical URL for this project page',
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    canonicalUrl?: string;

    @ApiPropertyOptional({
        example: 'index, follow',
        description: 'Robots meta directive (e.g., index/follow, noindex/nofollow)',
        maxLength: 100,
        default: 'index, follow',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    robotsMeta?: string;
}
