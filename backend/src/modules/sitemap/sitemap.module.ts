import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitemapController } from './sitemap.controller';
import { SitemapService } from './sitemap.service';
import { Service } from '../services/service.entity';
import { Project } from '../projects/project.entity';
import { BlogPost } from '../blog/blog-post.entity';
import { TeamMember } from '../team/team-member.entity';
import { Testimonial } from '../testimonials/testimonial.entity';
import { Faq } from '../faqs/faq.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Service,
            Project,
            BlogPost,
            TeamMember,
            Testimonial,
            Faq,
        ]),
    ],
    controllers: [SitemapController],
    providers: [SitemapService],
    exports: [SitemapService],
})
export class SitemapModule {}
