import {
    IsString,
    IsOptional,
    IsBoolean,
    IsInt,
    IsObject,
    Min,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamMemberDto {
    @ApiProperty({
        example: 'John Doe',
        description: 'Team member full name',
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    name: string;

    @ApiProperty({
        example: 'Lead AI Engineer',
        description: 'Job role / title',
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    role: string;

    @ApiPropertyOptional({
        example:
            '<p>John has over 10 years of experience in AI and machine learning...</p>',
        description: 'Team member biography (HTML supported)',
    })
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/team/john-doe.jpg',
        description: 'Profile image URL',
    })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiPropertyOptional({
        example: {
            twitter: 'https://twitter.com/johndoe',
            linkedin: 'https://linkedin.com/in/johndoe',
            github: 'https://github.com/johndoe',
        },
        description: 'Social media links (key-value object)',
    })
    @IsOptional()
    @IsObject()
    socialLinks?: Record<string, string>;

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
        example: true,
        description: 'Whether the team member is active and visible',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
