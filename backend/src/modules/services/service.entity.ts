import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';

@Entity('services')
export class Service extends BaseEntity {
    @Column({ length: 255 })
    title: string;

    @Column({ length: 255, unique: true })
    @Index()
    slug: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ length: 500, nullable: true })
    shortDescription?: string;

    @Column({ length: 255, nullable: true })
    icon?: string;

    @Column({ length: 255, nullable: true })
    image?: string;

    @Column({ type: 'int', default: 0 })
    @Index()
    order: number;

    @Column({ default: false })
    @Index()
    featured: boolean;

    @Column({ default: true })
    @Index()
    isActive: boolean;
}
