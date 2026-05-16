import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';

export interface NavigationItem {
    id: string;
    label: string;
    url: string;
    icon?: string;
    children?: NavigationItem[];
    isExternal?: boolean;
    order: number;
}

@Entity('navigation_menus')
export class NavigationMenu extends BaseEntity {
    @Column({ length: 100 })
    @Index()
    name: string;

    @Column({ type: 'jsonb', default: [] })
    items: NavigationItem[];

    @Column({ default: true })
    @Index()
    isActive: boolean;
}
