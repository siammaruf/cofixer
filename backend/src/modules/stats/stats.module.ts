import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Service } from '../services/service.entity';
import { Project } from '../projects/project.entity';
import { BlogPost } from '../blog/blog-post.entity';
import { TeamMember } from '../team/team-member.entity';
import { Testimonial } from '../testimonials/testimonial.entity';
import { ContactMessage } from '../contacts/contact-message.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Service,
            Project,
            BlogPost,
            TeamMember,
            Testimonial,
            ContactMessage,
        ]),
    ],
    controllers: [StatsController],
    providers: [StatsService],
    exports: [StatsService],
})
export class StatsModule {}
