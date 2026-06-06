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

    @Column({ length: 255, nullable: true })
    imageUrl?: string;

    @Column({ length: 255, nullable: true })
    liveUrl?: string;

    @Column({ length: 255, nullable: true })
    githubUrl?: string;

    @Column({ type: 'jsonb', default: [] })
    techStack: string[];

    @Column({ default: false })
    @Index()
    featured: boolean;

    @Column({ default: true })
    @Index()
    isActive: boolean;

    @Column({ length: 255, nullable: true })
    metaTitle?: string;

    @Column({ type: 'text', nullable: true })
    metaDescription?: string;

    @Column({ type: 'text', nullable: true })
    metaKeywords?: string;

    @Column({ length: 255, nullable: true })
    ogImage?: string;

    @Column({ length: 500, nullable: true })
    canonicalUrl?: string;

    @Column({ length: 100, nullable: true, default: 'index, follow' })
    robotsMeta?: string;
}
