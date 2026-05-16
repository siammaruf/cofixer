import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';

@Entity('media')
export class Media extends BaseEntity {
    @Column({ length: 255 })
    filename: string;

    @Column({ length: 255 })
    originalName: string;

    @Column({ length: 100 })
    @Index()
    mimeType: string;

    @Column({ type: 'int' })
    size: number;

    @Column({ length: 500 })
    url: string;

    @Column({ length: 255, nullable: true })
    altText?: string;

    @Column({ length: 100, nullable: true, default: 'general' })
    @Index()
    folder?: string;

    @Column({ default: true })
    @Index()
    isActive: boolean;
}
