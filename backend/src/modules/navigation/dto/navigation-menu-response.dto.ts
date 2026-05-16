import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NavigationItemResponseDto {
    @ApiProperty({
        example: 'nav-1',
        description: 'Unique item identifier',
    })
    id: string;

    @ApiProperty({
        example: 'Services',
        description: 'Menu item label',
    })
    label: string;

    @ApiProperty({
        example: '/services',
        description: 'Menu item URL',
    })
    url: string;

    @ApiPropertyOptional({
        example: 'briefcase',
        description: 'Optional icon name',
    })
    icon?: string;

    @ApiPropertyOptional({
        example: false,
        description: 'Whether the link opens in a new tab',
    })
    isExternal?: boolean;

    @ApiProperty({
        example: 1,
        description: 'Display order',
    })
    order: number;

    @ApiPropertyOptional({
        description: 'Nested child menu items',
        type: [NavigationItemResponseDto],
    })
    children?: NavigationItemResponseDto[];
}

export class NavigationMenuResponseDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Navigation menu unique identifier (UUID)',
    })
    id: string;

    @ApiProperty({
        example: 'main',
        description: 'Menu name identifier',
    })
    name: string;

    @ApiProperty({
        description: 'Navigation menu items',
        type: [NavigationItemResponseDto],
    })
    items: NavigationItemResponseDto[];

    @ApiProperty({
        example: true,
        description: 'Whether the menu is active',
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
