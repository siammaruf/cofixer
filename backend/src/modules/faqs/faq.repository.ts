import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/base/base.repository';
import { Faq } from './faq.entity';

@Injectable()
export class FaqRepository extends BaseRepository<Faq> {
    constructor(
        @InjectRepository(Faq)
        repository: Repository<Faq>,
    ) {
        super(repository);
    }

    async findActiveOrdered(): Promise<Faq[]> {
        return this.repository.find({
            where: { isActive: true },
            order: { category: 'ASC', order: 'ASC' },
        });
    }
}
