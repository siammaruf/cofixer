import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProjectResponseDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Project unique identifier (UUID)',
    })
    id: string;

    @ApiProperty({
        example: 'AI-Powered E-commerce Platform',
        description: 'Project title',
    })
    title: string;

    @ApiProperty({
        example: 'ai-powered-ecommerce-platform',
        description: 'URL-friendly slug',
    })
    slug: string;

    @ApiProperty({
        example:
            'Built a fully AI-driven e-commerce platform with personalized recommendations.',
        description: 'Brief project summary',
    })
    summary: string;

    @ApiProperty({
        example:
            '<p>This project involved building a complete e-commerce solution...</p>',
        description: 'Full project description',
    })
    description: string;

    @ApiPropertyOptional({
        example: 'TechCorp Inc.',
        description: 'Client name',
    })
    clientName?: string;

    @ApiProperty({
        example: 'E-commerce',
        description: 'Project category',
    })
    category: string;

    @ApiPropertyOptional({
        example: [
            'https://cofixer.com/images/projects/ecomm-1.jpg',
            'https://cofixer.com/images/projects/ecomm-2.jpg',
        ],
        description: 'Project gallery images',
        type: [String],
    })
    images?: string[];

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/projects/ecomm-featured.jpg',
        description: 'Featured image',
    })
    featuredImage?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/projects/ecomm-featured.jpg',
        description: 'Project image URL',
    })
    imageUrl?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com',
        description: 'Live project URL',
    })
    liveUrl?: string;

    @ApiPropertyOptional({
        example: 'https://github.com/cofixer/project',
        description: 'GitHub repository URL',
    })
    githubUrl?: string;

    @ApiPropertyOptional({
        example: ['React', 'Node.js', 'PostgreSQL'],
        description: 'Technology stack used',
        type: [String],
    })
    techStack?: string[];

    @ApiProperty({
        example: false,
        description: 'Whether the project is featured',
    })
    featured: boolean;

    @ApiProperty({
        example: true,
        description: 'Whether the project is active',
    })
    isActive: boolean;

    @ApiPropertyOptional({
        example: 'AI-Powered E-commerce Platform - Cofixer',
        description: 'SEO meta title',
    })
    metaTitle?: string;

    @ApiPropertyOptional({
        example: 'We built a fully AI-driven e-commerce platform...',
        description: 'SEO meta description',
    })
    metaDescription?: string;

    @ApiPropertyOptional({
        example: 'AI, e-commerce, React, Node.js, PostgreSQL',
        description: 'SEO meta keywords',
    })
    metaKeywords?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/projects/ecomm-og.jpg',
        description: 'Open Graph image URL',
    })
    ogImage?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/projects/ai-powered-ecommerce-platform',
        description: 'Canonical URL',
    })
    canonicalUrl?: string;

    @ApiPropertyOptional({
        example: 'index, follow',
        description: 'Robots meta directive',
    })
    robotsMeta?: string;

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
