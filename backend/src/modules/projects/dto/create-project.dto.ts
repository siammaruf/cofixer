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
}
