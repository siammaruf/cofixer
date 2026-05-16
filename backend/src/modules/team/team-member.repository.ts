import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../core/base/base.repository';
import { TeamMember } from './team-member.entity';

@Injectable()
export class TeamMemberRepository extends BaseRepository<TeamMember> {
    constructor(
        @InjectRepository(TeamMember)
        repository: Repository<TeamMember>,
    ) {
        super(repository);
    }

    async findActiveOrdered(): Promise<TeamMember[]> {
        return this.repository.find({
            where: { isActive: true },
            order: { order: 'ASC' },
        });
    }
}
