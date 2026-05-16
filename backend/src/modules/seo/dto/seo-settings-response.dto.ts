import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SeoSettingsResponseDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'SEO settings unique identifier (UUID)',
    })
    id: string;

    @ApiProperty({
        example: '/services',
        description: 'Page route path',
    })
    route: string;

    @ApiProperty({
        example: 'services',
        description: 'Page type identifier',
    })
    pageType: string;

    @ApiPropertyOptional({
        example: 'Our Services | Cofixer',
        description: 'Page title',
    })
    title?: string;

    @ApiPropertyOptional({
        example:
            'Cofixer offers AI strategy, integration, and custom solutions for businesses.',
        description: 'Meta description',
    })
    metaDescription?: string;

    @ApiPropertyOptional({
        example: ['AI', 'consulting', 'technology'],
        description: 'Meta keywords',
        type: [String],
    })
    metaKeywords?: string[];

    @ApiPropertyOptional({
        example: 'Our Services | Cofixer',
        description: 'Open Graph title',
    })
    ogTitle?: string;

    @ApiPropertyOptional({
        example: 'Explore our AI services to transform your business operations.',
        description: 'Open Graph description',
    })
    ogDescription?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/og/services.jpg',
        description: 'Open Graph image URL',
    })
    ogImage?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/twitter/services.jpg',
        description: 'Twitter card image URL',
    })
    twitterImage?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/services',
        description: 'Canonical URL',
    })
    canonicalUrl?: string;

    @ApiPropertyOptional({
        example: 'index, follow',
        description: 'Robots meta tag',
    })
    robotsMeta?: string;

    @ApiPropertyOptional({
        example: {
            '@context': 'https://schema.org',
            '@type': 'Service',
        },
        description: 'JSON-LD structured data',
    })
    jsonLdSchema?: object;

    @ApiPropertyOptional({
        example: '<script>console.log("custom")</script>',
        description: 'Custom head scripts',
    })
    customHeadScripts?: string;

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
