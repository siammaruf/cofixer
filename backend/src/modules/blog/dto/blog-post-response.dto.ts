import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BlogPostResponseDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Blog post unique identifier (UUID)',
    })
    id: string;

    @ApiProperty({
        example: 'The Future of AI in Business',
        description: 'Blog post title',
    })
    title: string;

    @ApiProperty({
        example: 'future-of-ai-in-business',
        description: 'URL-friendly slug',
    })
    slug: string;

    @ApiProperty({
        example:
            'Discover how AI is transforming modern business operations and decision-making.',
        description: 'Short excerpt',
    })
    excerpt: string;

    @ApiProperty({
        example:
            '<p>Artificial Intelligence is no longer a futuristic concept...</p>',
        description: 'Full blog post content',
    })
    content: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/blog/ai-business.jpg',
        description: 'Cover image URL',
    })
    coverImage?: string;

    @ApiPropertyOptional({
        example: 'AI Strategy',
        description: 'Blog post category',
    })
    category?: string;

    @ApiPropertyOptional({
        example: ['AI', 'Business', 'Technology'],
        description: 'Tags',
        type: [String],
    })
    tags?: string[];

    @ApiPropertyOptional({
        example: 'Jane Doe',
        description: 'Author display name',
    })
    authorName?: string;

    @ApiPropertyOptional({
        example: '2024-11-02T10:30:00.000Z',
        description: 'Publish date',
    })
    publishedAt?: Date;

    @ApiProperty({
        example: false,
        description: 'Whether the post is published',
    })
    isPublished: boolean;

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
