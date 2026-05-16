import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';

@Entity('blog_posts')
export class BlogPost extends BaseEntity {
    @Column({ length: 255 })
    title: string;

    @Column({ length: 255, unique: true })
    @Index()
    slug: string;

    @Column({ length: 500, nullable: true })
    excerpt?: string;

    @Column({ type: 'text', nullable: true })
    content?: string;

    @Column({ length: 255, nullable: true })
    coverImage?: string;

    @Column({ length: 255, nullable: true })
    @Index()
    category?: string;

    @Column('simple-array', { nullable: true })
    tags?: string[];

    @Column({ length: 255, nullable: true })
    authorName?: string;

    @Column({ type: 'timestamp', nullable: true })
    @Index()
    publishedAt?: Date;

    @Column({ default: false })
    @Index()
    isPublished: boolean;
}
