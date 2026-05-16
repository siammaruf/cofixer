import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/base/base.repository';
import { BlogPost } from './blog-post.entity';

@Injectable()
export class BlogPostRepository extends BaseRepository<BlogPost> {
    constructor(
        @InjectRepository(BlogPost)
        repository: Repository<BlogPost>,
    ) {
        super(repository);
    }

    async findBySlug(slug: string): Promise<BlogPost | null> {
        return this.repository.findOne({
            where: { slug, isPublished: true },
        });
    }

    async findPublished(): Promise<BlogPost[]> {
        return this.repository.find({
            where: { isPublished: true },
            order: { publishedAt: 'DESC' },
        });
    }

    async findByCategory(category: string): Promise<BlogPost[]> {
        return this.repository.find({
            where: { category, isPublished: true },
            order: { publishedAt: 'DESC' },
        });
    }
}
