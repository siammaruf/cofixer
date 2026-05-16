import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/base/base.repository';
import { Service } from './service.entity';

@Injectable()
export class ServiceRepository extends BaseRepository<Service> {
    constructor(
        @InjectRepository(Service)
        repository: Repository<Service>,
    ) {
        super(repository);
    }

    async findBySlug(slug: string): Promise<Service | null> {
        return this.repository.findOne({
            where: { slug, isActive: true },
        });
    }

    async findFeatured(): Promise<Service[]> {
        return this.repository.find({
            where: { featured: true, isActive: true },
            order: { order: 'ASC' },
        });
    }

    async findActiveOrdered(): Promise<Service[]> {
        return this.repository.find({
            where: { isActive: true },
            order: { order: 'ASC' },
        });
    }
}
