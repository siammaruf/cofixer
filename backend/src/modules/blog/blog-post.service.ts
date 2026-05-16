import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { BlogPost } from './blog-post.entity';
import { BlogPostRepository } from './blog-post.repository';

@Injectable()
export class BlogPostService extends BaseService<BlogPost> {
    constructor(private readonly blogPostRepository: BlogPostRepository) {
        super(blogPostRepository, 'BlogPost');
    }

    async findBySlugOrFail(slug: string): Promise<BlogPost> {
        const post = await this.blogPostRepository.findBySlug(slug);
        if (!post) {
            throw new NotFoundException(`Blog post with slug '${slug}' not found`);
        }
        return post;
    }

    async findPublished(): Promise<BlogPost[]> {
        return this.blogPostRepository.findPublished();
    }

    async findByCategory(category: string): Promise<BlogPost[]> {
        return this.blogPostRepository.findByCategory(category);
    }

    async togglePublish(id: string): Promise<BlogPost | null> {
        const post = await this.findByIdOrFail(id);
        return this.update(id, {
            isPublished: !post.isPublished,
            publishedAt: !post.isPublished ? new Date() : post.publishedAt,
        } as any);
    }
}
