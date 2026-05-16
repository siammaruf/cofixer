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

export class CreateFaqDto {
    @ApiProperty({
        example: 'What services does Cofixer offer?',
        description: 'Frequently asked question',
        minLength: 1,
        maxLength: 500,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(500)
    question: string;

    @ApiProperty({
        example:
            'Cofixer offers AI strategy, integration, and custom solutions...',
        description: 'Answer to the question (HTML supported)',
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    answer: string;

    @ApiPropertyOptional({
        example: 'Services',
        description: 'FAQ category for grouping',
        maxLength: 100,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    category?: string;

    @ApiPropertyOptional({
        example: 1,
        description: 'Display order within category (lower = first)',
        minimum: 0,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    order?: number;

    @ApiPropertyOptional({
        example: true,
        description: 'Whether the FAQ is active and visible',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
