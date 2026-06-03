import { Injectable, ConflictException } from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { BlogCategory } from './blog-category.entity';
import { BlogCategoryRepository } from './blog-category.repository';
import { DeepPartial } from 'typeorm';

@Injectable()
export class BlogCategoryService extends BaseService<BlogCategory> {
    constructor(
        private readonly blogCategoryRepository: BlogCategoryRepository,
    ) {
        super(blogCategoryRepository, 'BlogCategory');
    }

    async findBySlugOrFail(slug: string): Promise<BlogCategory> {
        const category = await this.blogCategoryRepository.findBySlug(slug);
        if (!category) {
            throw new Error(`Blog category with slug '${slug}' not found`);
        }
        return category;
    }

    async findWithPostCount(): Promise<
        (Omit<
            BlogCategory,
            'hasId' | 'save' | 'remove' | 'softRemove' | 'recover' | 'reload'
        > & { postCount: number })[]
    > {
        return this.blogCategoryRepository.findWithPostCount();
    }

    async create(data: DeepPartial<BlogCategory>): Promise<BlogCategory> {
        if (data.slug) {
            const existing = await this.blogCategoryRepository.findOne({
                slug: data.slug,
            });
            if (existing) {
                throw new ConflictException(
                    `Category with slug '${data.slug}' already exists`,
                );
            }
        }
        return super.create(data);
    }

    async update(
        id: string,
        data: DeepPartial<BlogCategory>,
    ): Promise<BlogCategory | null> {
        if (data.slug) {
            const existing = await this.blogCategoryRepository.findOne({
                slug: data.slug,
            });
            if (existing && existing.id !== id) {
                throw new ConflictException(
                    `Category with slug '${data.slug}' already exists`,
                );
            }
        }
        return super.update(id, data);
    }
}
