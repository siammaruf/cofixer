import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';

@Entity('projects')
export class Project extends BaseEntity {
    @Column({ length: 255 })
    title: string;

    @Column({ length: 255, unique: true })
    @Index()
    slug: string;

    @Column({ length: 500, nullable: true })
    summary?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ length: 255, nullable: true })
    clientName?: string;

    @Column({ length: 255, nullable: true })
    @Index()
    category?: string;

    @Column({ type: 'jsonb', default: [] })
    images: string[];

    @Column({ length: 255, nullable: true })
    featuredImage?: string;

    @Column({ default: false })
    @Index()
    featured: boolean;

    @Column({ default: true })
    @Index()
    isActive: boolean;
}
