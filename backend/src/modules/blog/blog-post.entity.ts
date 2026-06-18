import { Entity, Column, Index, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';
import { BlogCategory } from '../blog-category/blog-category.entity';

@Entity('blog_posts')
export class BlogPost extends BaseEntity {
    @Column({ length: 255 })
    title: string;

    @Column({ length: 255, unique: true })
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

    @ManyToMany(() => BlogCategory, (category) => category.posts, {
        onDelete: 'CASCADE',
    })
    @JoinTable({
        name: 'blog_posts_categories',
        joinColumn: { name: 'blog_post_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    })
    categories?: BlogCategory[];

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

    @Column({ length: 255, nullable: true })
    metaTitle?: string;

    @Column({ type: 'text', nullable: true })
    metaDescription?: string;

    @Column({ length: 255, nullable: true })
    ogImage?: string;
}
