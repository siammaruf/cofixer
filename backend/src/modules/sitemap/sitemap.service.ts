import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../services/service.entity';
import { Project } from '../projects/project.entity';
import { BlogPost } from '../blog/blog-post.entity';
import { TeamMember } from '../team/team-member.entity';
import { Testimonial } from '../testimonials/testimonial.entity';
import { Faq } from '../faqs/faq.entity';

@Injectable()
export class SitemapService {
    private readonly baseUrl = 'https://cofixer.com';

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
        @InjectRepository(Faq)
        private readonly faqRepo: Repository<Faq>,
    ) {}

    async generateSitemap(): Promise<string> {
        const [services, projects, blogPosts, teamMembers, testimonials, faqs] = await Promise.all([
            this.serviceRepo.find({ where: { isActive: true } }),
            this.projectRepo.find({ where: { isActive: true } }),
            this.blogRepo.find({ where: { isPublished: true } }),
            this.teamRepo.find({ where: { isActive: true } }),
            this.testimonialRepo.find({ where: { isActive: true } }),
            this.faqRepo.find({ where: { isActive: true } }),
        ]);

        const urls = [
            { loc: '/', priority: '1.0', changefreq: 'daily' },
            { loc: '/about', priority: '0.8', changefreq: 'weekly' },
            { loc: '/services', priority: '0.8', changefreq: 'weekly' },
            { loc: '/projects', priority: '0.8', changefreq: 'weekly' },
            { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
            { loc: '/team', priority: '0.7', changefreq: 'weekly' },
            { loc: '/testimonials', priority: '0.7', changefreq: 'weekly' },
            { loc: '/faqs', priority: '0.7', changefreq: 'weekly' },
            { loc: '/contact', priority: '0.6', changefreq: 'monthly' },
            ...services.map(s => ({ loc: `/services/${s.slug}`, priority: '0.7', changefreq: 'weekly' })),
            ...projects.map(p => ({ loc: `/projects/${p.slug}`, priority: '0.7', changefreq: 'weekly' })),
            ...blogPosts.map(b => ({ loc: `/blog/${b.slug}`, priority: '0.6', changefreq: 'monthly' })),
        ];

        const urlEntries = urls.map(u => `
    <url>
        <loc>${this.baseUrl}${u.loc}</loc>
        <changefreq>${u.changefreq}</changefreq>
        <priority>${u.priority}</priority>
    </url>`).join('');

        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`;
    }
}
