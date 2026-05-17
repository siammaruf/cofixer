import {
    IsString,
    IsOptional,
    IsBoolean,
    IsArray,
    MinLength,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NavigationItemDto {
    @ApiProperty({
        example: 'nav-1',
        description: 'Unique item identifier',
    })
    @IsString()
    id: string;

    @ApiProperty({
        example: 'Services',
        description: 'Menu item label',
    })
    @IsString()
    label: string;

    @ApiProperty({
        example: '/services',
        description: 'Menu item URL',
    })
    @IsString()
    url: string;

    @ApiPropertyOptional({
        example: 'briefcase',
        description: 'Optional icon name',
    })
    @IsOptional()
    @IsString()
    icon?: string;

    @ApiPropertyOptional({
        example: false,
        description: 'Whether the link opens in a new tab',
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    isExternal?: boolean;

    @ApiProperty({
        example: 1,
        description: 'Display order',
    })
    @Type(() => Number)
    order: number;

    @ApiPropertyOptional({
        description: 'Nested child menu items',
        type: [NavigationItemDto],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NavigationItemDto)
    children?: NavigationItemDto[];
}

export class UpdateNavigationMenuDto {
    @ApiProperty({
        example: 'main',
        description: 'Menu name identifier (e.g., "main", "footer", "sidebar")',
        minLength: 1,
        maxLength: 100,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;

    @ApiProperty({
        example: [
            { id: 'nav-1', label: 'Services', url: '/services', order: 1 },
            { id: 'nav-2', label: 'Projects', url: '/projects', order: 2 },
        ],
        description: 'Navigation menu items array',
        type: [NavigationItemDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NavigationItemDto)
    items: NavigationItemDto[];

    @ApiPropertyOptional({
        example: true,
        description: 'Whether the menu is active',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
