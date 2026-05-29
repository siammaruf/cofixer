import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { BlogPost } from './blog-post.entity';
import { BlogPostRepository } from './blog-post.repository';
import { BlogCategoryRepository } from '../blog-category/blog-category.repository';
import { DeepPartial } from 'typeorm';

@Injectable()
export class BlogPostService extends BaseService<BlogPost> {
    constructor(
        private readonly blogPostRepository: BlogPostRepository,
        private readonly blogCategoryRepository: BlogCategoryRepository,
    ) {
        super(blogPostRepository, 'BlogPost');
    }

    protected defaultRelations = { categories: true };

    async findBySlugOrFail(slug: string): Promise<BlogPost> {
        const post = await this.blogPostRepository.findBySlug(slug);
        if (!post) {
            throw new NotFoundException(
                `Blog post with slug '${slug}' not found`,
            );
        }
        return post;
    }

    async findPublished(): Promise<BlogPost[]> {
        return this.blogPostRepository.findPublished();
    }

    async findByCategory(category: string): Promise<BlogPost[]> {
        return this.blogPostRepository.findByCategory(category);
    }

    async create(data: DeepPartial<BlogPost> & { categoryIds?: string[] }): Promise<BlogPost> {
        const { categoryIds, ...postData } = data;
        const post = await this.blogPostRepository.create(postData);

        if (categoryIds && categoryIds.length > 0) {
            const categories = await this.blogCategoryRepository.findAll({
                where: categoryIds.map((id) => ({ id })),
            } as any);
            post.categories = categories;
            await this.blogPostRepository.save(post);
        }

        return this.findByIdOrFail(post.id);
    }

    async update(id: string, data: DeepPartial<BlogPost> & { categoryIds?: string[] }): Promise<BlogPost | null> {
        const { categoryIds, ...postData } = data;
        await this.findByIdOrFail(id);
        await this.blogPostRepository.update(id, postData);

        if (categoryIds !== undefined) {
            const post = await this.findByIdOrFail(id);
            if (categoryIds.length > 0) {
                const categories = await this.blogCategoryRepository.findAll({
                    where: categoryIds.map((cid) => ({ id: cid })),
                } as any);
                post.categories = categories;
            } else {
                post.categories = [];
            }
            await this.blogPostRepository.save(post);
        }

        return this.findByIdOrFail(id);
    }

    async togglePublish(id: string): Promise<BlogPost | null> {
        const post = await this.findByIdOrFail(id);
        return this.update(id, {
            isPublished: !post.isPublished,
            publishedAt: !post.isPublished ? new Date() : post.publishedAt,
        });
    }
}
