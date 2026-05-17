import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TeamMemberResponseDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Team member unique identifier (UUID)',
    })
    id: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'Team member full name',
    })
    name: string;

    @ApiProperty({
        example: 'Lead AI Engineer',
        description: 'Job role / title',
    })
    role: string;

    @ApiPropertyOptional({
        example:
            '<p>John has over 10 years of experience in AI and machine learning...</p>',
        description: 'Team member biography',
    })
    bio?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/team/john-doe.jpg',
        description: 'Profile image URL',
    })
    image?: string;

    @ApiPropertyOptional({
        example: {
            twitter: 'https://twitter.com/johndoe',
            linkedin: 'https://linkedin.com/in/johndoe',
        },
        description: 'Social media links',
    })
    socialLinks?: Record<string, string>;

    @ApiPropertyOptional({
        example: 1,
        description: 'Display order',
    })
    order?: number;

    @ApiProperty({
        example: true,
        description: 'Whether the team member is active',
    })
    isActive: boolean;

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
