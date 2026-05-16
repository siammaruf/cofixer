import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../services/service.entity';
import { Project } from '../projects/project.entity';
import { BlogPost } from '../blog/blog-post.entity';
import { TeamMember } from '../team/team-member.entity';
import { Testimonial } from '../testimonials/testimonial.entity';
import { ContactMessage } from '../contacts/contact-message.entity';

@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepo: Repository<Service>,
        @InjectRepository(Project)
        private readonly projectRepo: Repository<Project>,
        @InjectRepository(BlogPost)
        private readonly blogRepo: Repository<BlogPost>,
        @InjectRepository(TeamMember)
        private readonly teamRepo: Repository<TeamMember>,
        @InjectRepository(Testimonial)
        private readonly testimonialRepo: Repository<Testimonial>,
        @InjectRepository(ContactMessage)
        private readonly contactRepo: Repository<ContactMessage>,
    ) {}

    async getStats(): Promise<Record<string, number>> {
        const [services, projects, blogPosts, teamMembers, testimonials, contacts] = await Promise.all([
            this.serviceRepo.count({ where: { isActive: true } }),
            this.projectRepo.count({ where: { isActive: true } }),
            this.blogRepo.count({ where: { isPublished: true } }),
            this.teamRepo.count({ where: { isActive: true } }),
            this.testimonialRepo.count({ where: { isActive: true } }),
            this.contactRepo.count(),
        ]);
        return { services, projects, blogPosts, teamMembers, testimonials, contacts };
    }
}
