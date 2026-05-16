import {
    IsString,
    IsOptional,
    IsBoolean,
    IsInt,
    Min,
    Max,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTestimonialDto {
    @ApiProperty({
        example: 'Alice Smith',
        description: 'Client name',
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    clientName: string;

    @ApiPropertyOptional({
        example: 'CTO',
        description: 'Client role / job title',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    clientRole?: string;

    @ApiPropertyOptional({
        example: 'TechCorp Inc.',
        description: 'Client company name',
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    company?: string;

    @ApiProperty({
        example:
            'Cofixer transformed our business with their AI solutions. Highly recommended!',
        description: 'Testimonial content / review text',
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    content: string;

    @ApiProperty({
        example: 5,
        description: 'Rating from 1 to 5 stars',
        minimum: 1,
        maximum: 5,
    })
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiPropertyOptional({
        example: 'https://cofixer.com/images/testimonials/alice-smith.jpg',
        description: 'Client photo / company logo URL',
    })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiPropertyOptional({
        example: false,
        description: 'Whether the testimonial is featured on homepage',
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @ApiPropertyOptional({
        example: true,
        description: 'Whether the testimonial is active and visible',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
