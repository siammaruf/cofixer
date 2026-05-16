import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/base/base.repository';
import { Project } from './project.entity';

@Injectable()
export class ProjectRepository extends BaseRepository<Project> {
    constructor(
        @InjectRepository(Project)
        repository: Repository<Project>,
    ) {
        super(repository);
    }

    async findBySlug(slug: string): Promise<Project | null> {
        return this.repository.findOne({
            where: { slug, isActive: true },
        });
    }

    async findFeatured(): Promise<Project[]> {
        return this.repository.find({
            where: { featured: true, isActive: true },
            order: { createdAt: 'DESC' },
        });
    }

    async findByCategory(category: string): Promise<Project[]> {
        return this.repository.find({
            where: { category, isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
}
