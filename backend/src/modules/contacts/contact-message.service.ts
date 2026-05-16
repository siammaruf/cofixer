import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { ContactMessage } from './contact-message.entity';
import { ContactMessageRepository } from './contact-message.repository';

@Injectable()
export class ContactMessageService extends BaseService<ContactMessage> {
    constructor(private readonly contactMessageRepository: ContactMessageRepository) {
        super(contactMessageRepository, 'ContactMessage');
    }

    async findUnread(): Promise<ContactMessage[]> {
        return this.contactMessageRepository.findUnread();
    }

    async findByStatus(status: string): Promise<ContactMessage[]> {
        return this.contactMessageRepository.findByStatus(status);
    }
}
