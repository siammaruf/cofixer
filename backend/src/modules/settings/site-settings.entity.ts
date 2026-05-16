import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';

@Entity('site_settings')
export class SiteSettings extends BaseEntity {
    @Column({ length: 255, default: 'Cofixer' })
    siteName: string;

    @Column({ length: 255, nullable: true })
    logo?: string;

    @Column({ length: 255, nullable: true })
    favicon?: string;

    @Column({ type: 'text', nullable: true })
    copyrightText?: string;

    @Column({ type: 'jsonb', nullable: true })
    socialLinks?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
        facebook?: string;
        instagram?: string;
    };

    @Column({ type: 'jsonb', nullable: true })
    themeColors?: {
        primary?: string;
        accent?: string;
        secondary?: string;
    };

    @Column({ length: 255, nullable: true })
    googleAnalyticsId?: string;

    @Column({ length: 255, nullable: true })
    googleTagManagerId?: string;

    @Column({ type: 'text', nullable: true })
    customScripts?: string;
}
