import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { Service } from './service.entity';
import { ServiceRepository } from './service.repository';

@Injectable()
export class ServiceService extends BaseService<Service> {
    constructor(
        private readonly serviceRepository: ServiceRepository,
    ) {
        super(serviceRepository, 'Service');
    }

    async findBySlugOrFail(slug: string): Promise<Service> {
        const service = await this.serviceRepository.findBySlug(slug);
        if (!service) {
            throw new NotFoundException(`Service with slug '${slug}' not found`);
        }
        return service;
    }

    async findFeatured(): Promise<Service[]> {
        return this.serviceRepository.findFeatured();
    }

    async findActiveOrdered(): Promise<Service[]> {
        return this.serviceRepository.findActiveOrdered();
    }

    async toggleFeatured(id: string): Promise<Service | null> {
        const service = await this.findByIdOrFail(id);
        return this.update(id, { featured: !service.featured } as any);
    }

    async reorder(ids: string[]): Promise<void> {
        for (let i = 0; i < ids.length; i++) {
            await this.serviceRepository.update(ids[i], { order: i } as any);
        }
    }
}
