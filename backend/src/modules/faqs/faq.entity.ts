import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';

@Entity('faqs')
export class Faq extends BaseEntity {
    @Column({ length: 500 })
    question: string;

    @Column({ type: 'text' })
    answer: string;

    @Column({ length: 255, nullable: true })
    @Index()
    category?: string;

    @Column({ type: 'int', default: 0 })
    @Index()
    order: number;

    @Column({ default: true })
    @Index()
    isActive: boolean;
}
