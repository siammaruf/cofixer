import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';

@Entity('testimonials')
export class Testimonial extends BaseEntity {
    @Column({ length: 255 })
    clientName: string;

    @Column({ length: 255, nullable: true })
    clientRole?: string;

    @Column({ length: 255, nullable: true })
    company?: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'int' })
    rating: number;

    @Column({ length: 255, nullable: true })
    image?: string;

    @Column({ default: false })
    @Index()
    featured: boolean;

    @Column({ default: true })
    @Index()
    isActive: boolean;
}
