import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { Project } from './project.entity';
import { ProjectRepository } from './project.repository';
import { DeepPartial } from 'typeorm';

@Injectable()
export class ProjectService extends BaseService<Project> {
    constructor(private readonly projectRepository: ProjectRepository) {
        super(projectRepository, 'Project');
    }

    async findBySlugOrFail(slug: string): Promise<Project> {
        const project = await this.projectRepository.findBySlug(slug);
        if (!project) {
            throw new NotFoundException(
                `Project with slug '${slug}' not found`,
            );
        }
        return project;
    }

    async findFeatured(): Promise<Project[]> {
        return this.projectRepository.findFeatured();
    }

    async findByCategory(category: string): Promise<Project[]> {
        return this.projectRepository.findByCategory(category);
    }

    async create(data: DeepPartial<Project>): Promise<Project> {
        if (data.slug) {
            const existing = await this.projectRepository.findOne({
                slug: data.slug,
            });
            if (existing) {
                throw new ConflictException(
                    `Project with slug '${data.slug}' already exists`,
                );
            }
        }
        return super.create(data);
    }

    async update(
        id: string,
        data: DeepPartial<Project>,
    ): Promise<Project | null> {
        if (data.slug) {
            const existing = await this.projectRepository.findOne({
                slug: data.slug,
            });
            if (existing && existing.id !== id) {
                throw new ConflictException(
                    `Project with slug '${data.slug}' already exists`,
                );
            }
        }
        return super.update(id, data);
    }

    async toggleFeatured(id: string): Promise<Project | null> {
        const project = await this.findByIdOrFail(id);
        return this.update(id, { featured: !project.featured });
    }
}
