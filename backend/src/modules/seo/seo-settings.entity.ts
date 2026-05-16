import { Entity, Column, Index, Unique } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';

@Entity('seo_settings')
@Unique(['route'])
export class SeoSettings extends BaseEntity {
    @Column({ length: 255 })
    @Index()
    route: string;

    @Column({ length: 100 })
    @Index()
    pageType: string;

    @Column({ length: 255, nullable: true })
    title?: string;

    @Column({ type: 'text', nullable: true })
    metaDescription?: string;

    @Column('simple-array', { nullable: true })
    metaKeywords?: string[];

    @Column({ length: 255, nullable: true })
    ogTitle?: string;

    @Column({ type: 'text', nullable: true })
    ogDescription?: string;

    @Column({ length: 255, nullable: true })
    ogImage?: string;

    @Column({ length: 255, nullable: true })
    twitterImage?: string;

    @Column({ length: 500, nullable: true })
    canonicalUrl?: string;

    @Column({ length: 100, default: 'index, follow' })
    robotsMeta: string;

    @Column({ type: 'jsonb', nullable: true })
    jsonLdSchema?: object;

    @Column({ type: 'text', nullable: true })
    customHeadScripts?: string;
}
