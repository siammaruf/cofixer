import {
    IsString,
    IsOptional,
    IsObject,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSiteSettingsDto {
    @ApiPropertyOptional({
        example: 'Cofixer',
        description: 'Site name / brand name',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    siteName?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/logo.png',
        description: 'Site logo URL',
    })
    @IsOptional()
    @IsString()
    logo?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/favicon.ico',
        description: 'Site favicon URL',
    })
    @IsOptional()
    @IsString()
    favicon?: string;

    @ApiPropertyOptional({
        example: '© 2024 Cofixer. All rights reserved.',
        description: 'Copyright text for footer',
    })
    @IsOptional()
    @IsString()
    copyrightText?: string;

    @ApiPropertyOptional({
        example: {
            twitter: 'https://twitter.com/cofixer',
            linkedin: 'https://linkedin.com/company/cofixer',
            github: 'https://github.com/cofixer',
        },
        description: 'Social media links (key-value object)',
    })
    @IsOptional()
    @IsObject()
    socialLinks?: Record<string, string>;

    @ApiPropertyOptional({
        example: {
            primary: '#3b82f6',
            accent: '#10b981',
        },
        description: 'Theme colors (key-value object)',
    })
    @IsOptional()
    @IsObject()
    themeColors?: Record<string, string>;

    @ApiPropertyOptional({
        example: 'G-XXXXXXXXXX',
        description: 'Google Analytics tracking ID',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    googleAnalyticsId?: string;

    @ApiPropertyOptional({
        example: 'GTM-XXXXXX',
        description: 'Google Tag Manager ID',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    googleTagManagerId?: string;

    @ApiPropertyOptional({
        example: '<script>console.log("hello")</script>',
        description: 'Custom scripts to inject in page head',
    })
    @IsOptional()
    @IsString()
    customScripts?: string;
}
