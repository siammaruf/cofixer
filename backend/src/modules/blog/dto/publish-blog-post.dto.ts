import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PublishBlogPostDto {
    @ApiProperty({
        example: true,
        description: 'Set to true to publish, false to unpublish',
    })
    @IsBoolean()
    isPublished: boolean;
}
