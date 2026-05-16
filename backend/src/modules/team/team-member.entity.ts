import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../core/base/base.entity';

@Entity('team_members')
export class TeamMember extends BaseEntity {
    @Column({ length: 255 })
    name: string;

    @Column({ length: 255 })
    role: string;

    @Column({ type: 'text', nullable: true })
    bio?: string;

    @Column({ length: 255, nullable: true })
    image?: string;

    @Column({ type: 'jsonb', nullable: true })
    socialLinks?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
    };

    @Column({ type: 'int', default: 0 })
    @Index()
    order: number;

    @Column({ default: true })
    @Index()
    isActive: boolean;
}
