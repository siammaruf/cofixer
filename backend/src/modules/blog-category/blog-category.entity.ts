import { Entity, Column, Index, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';
import { BlogPost } from '../blog/blog-post.entity';

@Entity('blog_categories')
export class BlogCategory extends BaseEntity {
    @Column({ length: 255 })
    name: string;

    @Column({ length: 255, unique: true })
    @Index()
    slug: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ length: 255, nullable: true })
    seoTitle?: string;

    @Column({ type: 'text', nullable: true })
    seoDescription?: string;

    @ManyToMany(() => BlogPost, (post) => post.categories)
    posts?: BlogPost[];
}
