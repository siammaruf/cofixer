import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { Testimonial } from './testimonial.entity';
import { TestimonialRepository } from './testimonial.repository';

@Injectable()
export class TestimonialService extends BaseService<Testimonial> {
    constructor(private readonly testimonialRepository: TestimonialRepository) {
        super(testimonialRepository, 'Testimonial');
    }

    async findActiveFeaturedFirst(): Promise<Testimonial[]> {
        return this.testimonialRepository.findActiveFeaturedFirst();
    }

    async toggleFeatured(id: string): Promise<Testimonial | null> {
        const testimonial = await this.findByIdOrFail(id);
        return this.update(id, { featured: !testimonial.featured } as any);
    }
}
