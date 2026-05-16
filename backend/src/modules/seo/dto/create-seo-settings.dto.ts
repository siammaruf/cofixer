import {
    IsString,
    IsOptional,
    IsArray,
    IsObject,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSeoSettingsDto {
    @ApiProperty({
        example: '/services',
        description: 'Page route path (e.g., "/", "/services", "/blog/:slug")',
        minLength: 1,
        maxLength: 500,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(500)
    route: string;

    @ApiProperty({
        example: 'services',
        description: 'Page type identifier (e.g., "home", "services", "blog")',
        minLength: 1,
        maxLength: 100,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    pageType: string;

    @ApiPropertyOptional({
        example: 'Our Services | Cofixer',
        description: 'Page <title> tag content',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    title?: string;

    @ApiPropertyOptional({
        example:
            'Cofixer offers AI strategy, integration, and custom solutions for businesses.',
        description: 'Meta description tag content',
    })
    @IsOptional()
    @IsString()
    metaDescription?: string;

    @ApiPropertyOptional({
        example: ['AI', 'consulting', 'technology'],
        description: 'Meta keywords',
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    metaKeywords?: string[];

    @ApiPropertyOptional({
        example: 'Our Services | Cofixer',
        description: 'Open Graph title',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    ogTitle?: string;

    @ApiPropertyOptional({
        example:
            'Explore our AI services to transform your business operations.',
        description: 'Open Graph description',
    })
    @IsOptional()
    @IsString()
    ogDescription?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/og/services.jpg',
        description: 'Open Graph image URL',
    })
    @IsOptional()
    @IsString()
    ogImage?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/twitter/services.jpg',
        description: 'Twitter card image URL',
    })
    @IsOptional()
    @IsString()
    twitterImage?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/services',
        description: 'Canonical URL for this page',
    })
    @IsOptional()
    @IsString()
    canonicalUrl?: string;

    @ApiPropertyOptional({
        example: 'index, follow',
        description: 'Robots meta tag content',
        default: 'index, follow',
    })
    @IsOptional()
    @IsString()
    robotsMeta?: string;

    @ApiPropertyOptional({
        example: {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'AI Strategy & Consulting',
        },
        description: 'JSON-LD structured data schema (object)',
    })
    @IsOptional()
    @IsObject()
    jsonLdSchema?: object;

    @ApiPropertyOptional({
        example: '<script>console.log("custom")</script>',
        description: 'Custom head scripts (HTML string)',
    })
    @IsOptional()
    @IsString()
    customHeadScripts?: string;
}
