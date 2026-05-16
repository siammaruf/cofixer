import { Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base/base.service';
import { TeamMember } from './team-member.entity';
import { TeamMemberRepository } from './team-member.repository';

@Injectable()
export class TeamMemberService extends BaseService<TeamMember> {
    constructor(private readonly teamMemberRepository: TeamMemberRepository) {
        super(teamMemberRepository, 'TeamMember');
    }

    async findActiveOrdered(): Promise<TeamMember[]> {
        return this.teamMemberRepository.findActiveOrdered();
    }
}
