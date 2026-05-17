import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { Faq } from './faq.entity';
import { FaqRepository } from './faq.repository';

@Injectable()
export class FaqService extends BaseService<Faq> {
    constructor(private readonly faqRepository: FaqRepository) {
        super(faqRepository, 'Faq');
    }

    async findActiveOrdered(): Promise<Faq[]> {
        return this.faqRepository.findActiveOrdered();
    }

    async findGroupedByCategory(): Promise<Record<string, Faq[]>> {
        const faqs = await this.findActiveOrdered();
        return faqs.reduce(
            (groups, faq) => {
                const category = faq.category || 'General';
                if (!groups[category]) groups[category] = [];
                groups[category].push(faq);
                return groups;
            },
            {} as Record<string, Faq[]>,
        );
    }
}
