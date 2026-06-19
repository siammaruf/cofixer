import { Entity, Column, Index, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';

@Entity('blog_categories')
export class BlogCategory extends BaseEntity {
    @Column({ length: 255 })
    name: string;

    @Column({ length: 255, unique: true })
    slug: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ length: 255, nullable: true })
    seoTitle?: string;

    @Column({ type: 'text', nullable: true })
    seoDescription?: string;

    @ManyToMany(
        () => require('../blog/blog-post.entity').BlogPost,
        (post: any) => post.categories,
    )
    posts?: any[];
}
