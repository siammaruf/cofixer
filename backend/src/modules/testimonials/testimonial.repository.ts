import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/base/base.repository';
import { Testimonial } from './testimonial.entity';

@Injectable()
export class TestimonialRepository extends BaseRepository<Testimonial> {
    constructor(
        @InjectRepository(Testimonial)
        repository: Repository<Testimonial>,
    ) {
        super(repository);
    }

    async findActiveFeaturedFirst(): Promise<Testimonial[]> {
        return this.repository.find({
            where: { isActive: true },
            order: { featured: 'DESC', createdAt: 'DESC' },
        });
    }
}
