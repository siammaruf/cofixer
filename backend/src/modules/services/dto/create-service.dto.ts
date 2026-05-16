import {
    IsString,
    IsOptional,
    IsBoolean,
    IsInt,
    Min,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
    @ApiProperty({
        example: 'AI Strategy & Consulting',
        description: 'Service title',
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    title: string;

    @ApiProperty({
        example: 'ai-strategy-consulting',
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
            '<p>We assess your business and identify high-impact AI opportunities...</p>',
        description: 'Full service description (supports HTML/rich text)',
    })
    @IsString()
    description: string;

    @ApiPropertyOptional({
        example: 'Strategic AI consulting to transform your business.',
        description: 'Short description for cards/previews',
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    shortDescription?: string;

    @ApiProperty({
        example: 'brain',
        description: 'Icon name or identifier (e.g., Lucide icon name)',
    })
    @IsString()
    icon: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/services/ai-strategy.jpg',
        description: 'Service image URL',
    })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiPropertyOptional({
        example: 1,
        description: 'Display order (lower = first)',
        minimum: 0,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    order?: number;

    @ApiPropertyOptional({
        example: false,
        description: 'Whether the service is featured on homepage',
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @ApiPropertyOptional({
        example: true,
        description: 'Whether the service is active and visible',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
