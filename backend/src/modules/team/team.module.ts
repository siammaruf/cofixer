import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMemberController } from './team-member.controller';
import { TeamMemberAdminController } from './team-member.admin.controller';
import { TeamMemberService } from './team-member.service';
import { TeamMemberRepository } from './team-member.repository';
import { TeamMember } from './team-member.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TeamMember])],
    controllers: [TeamMemberController, TeamMemberAdminController],
    providers: [TeamMemberService, TeamMemberRepository],
    exports: [TeamMemberService, TeamMemberRepository],
})
export class TeamModule {}
