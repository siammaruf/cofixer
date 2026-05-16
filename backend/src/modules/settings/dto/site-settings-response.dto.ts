import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SiteSettingsResponseDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Site settings unique identifier (UUID)',
    })
    id: string;

    @ApiPropertyOptional({
        example: 'Cofixer',
        description: 'Site name',
    })
    siteName?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/logo.png',
        description: 'Site logo URL',
    })
    logo?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/favicon.ico',
        description: 'Site favicon URL',
    })
    favicon?: string;

    @ApiPropertyOptional({
        example: '© 2024 Cofixer. All rights reserved.',
        description: 'Copyright text',
    })
    copyrightText?: string;

    @ApiPropertyOptional({
        example: {
            twitter: 'https://twitter.com/cofixer',
            linkedin: 'https://linkedin.com/company/cofixer',
        },
        description: 'Social media links',
    })
    socialLinks?: Record<string, string>;

    @ApiPropertyOptional({
        example: {
            primary: '#3b82f6',
            accent: '#10b981',
        },
        description: 'Theme colors',
    })
    themeColors?: Record<string, string>;

    @ApiPropertyOptional({
        example: 'G-XXXXXXXXXX',
        description: 'Google Analytics tracking ID',
    })
    googleAnalyticsId?: string;

    @ApiPropertyOptional({
        example: 'GTM-XXXXXX',
        description: 'Google Tag Manager ID',
    })
    googleTagManagerId?: string;

    @ApiPropertyOptional({
        example: '<script>console.log("hello")</script>',
        description: 'Custom scripts',
    })
    customScripts?: string;

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
