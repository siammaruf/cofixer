import {
    IsString,
    IsOptional,
    IsBoolean,
    MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMediaDto {
    @ApiPropertyOptional({
        example: 'AI business transformation illustration',
        description: 'Alt text for accessibility and SEO',
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    altText?: string;

    @ApiPropertyOptional({
        example: 'blog-images',
        description: 'Folder / category for organization',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    folder?: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Whether the media file is active',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
