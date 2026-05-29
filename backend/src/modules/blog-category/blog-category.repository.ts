import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/base/base.repository';
import { BlogCategory } from './blog-category.entity';

@Injectable()
export class BlogCategoryRepository extends BaseRepository<BlogCategory> {
    constructor(
        @InjectRepository(BlogCategory)
        repository: Repository<BlogCategory>,
    ) {
        super(repository);
    }

    async findBySlug(slug: string): Promise<BlogCategory | null> {
        return this.repository.findOne({
            where: { slug },
            relations: { posts: true },
        });
    }

    async findWithPostCount(): Promise<(Omit<BlogCategory, 'hasId' | 'save' | 'remove' | 'softRemove' | 'recover' | 'reload'> & { postCount: number })[]> {
        const categories = await this.repository.find({
            relations: { posts: true },
            order: { name: 'ASC' },
        });
        return categories.map((cat) => ({
            ...cat,
            postCount: cat.posts?.length ?? 0,
        }));
    }
}
