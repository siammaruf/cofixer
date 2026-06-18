import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';

export type ContactMessageStatus = 'new' | 'in_progress' | 'resolved' | 'spam';

@Entity('contact_messages')
export class ContactMessage extends BaseEntity {
    @Column({ length: 255 })
    name: string;

    @Column({ length: 255 })
    @Index()
    email: string;

    @Column({ length: 50, nullable: true })
    phone?: string;

    @Column({ length: 255 })
    subject: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ default: false })
    @Index()
    read: boolean;

    @Column({
        type: 'varchar',
        length: 50,
        default: 'new',
    })
    @Index()
    status: ContactMessageStatus;

    @Column({ type: 'text', nullable: true })
    notes?: string;
}
