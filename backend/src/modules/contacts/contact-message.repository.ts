import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/base/base.repository';
import { ContactMessage } from './contact-message.entity';

@Injectable()
export class ContactMessageRepository extends BaseRepository<ContactMessage> {
    constructor(
        @InjectRepository(ContactMessage)
        repository: Repository<ContactMessage>,
    ) {
        super(repository);
    }

    async findUnread(): Promise<ContactMessage[]> {
        return this.repository.find({
            where: { read: false },
            order: { createdAt: 'DESC' },
        });
    }

    async findByStatus(status: string): Promise<ContactMessage[]> {
        return this.repository.find({
            where: { status: status as any },
            order: { createdAt: 'DESC' },
        });
    }
}
