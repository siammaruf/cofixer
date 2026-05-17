import { DataSource } from 'typeorm';
import { Service } from '../../modules/services/service.entity';
import { Project } from '../../modules/projects/project.entity';
import { BlogPost } from '../../modules/blog/blog-post.entity';
import { TeamMember } from '../../modules/team/team-member.entity';
import { Testimonial } from '../../modules/testimonials/testimonial.entity';
import { Faq } from '../../modules/faqs/faq.entity';

export async function seedCms(dataSource: DataSource): Promise<void> {
    const serviceRepo = dataSource.getRepository(Service);
    const projectRepo = dataSource.getRepository(Project);
    const blogRepo = dataSource.getRepository(BlogPost);
    const teamRepo = dataSource.getRepository(TeamMember);
    const testimonialRepo = dataSource.getRepository(Testimonial);
    const faqRepo = dataSource.getRepository(Faq);

    // Seed Services
    const existingServices = await serviceRepo.count();
    if (existingServices === 0) {
        console.log('Creating default services...');
        const services = serviceRepo.create([
            {
                title: 'AI Strategy & Consulting',
                slug: 'ai-strategy-consulting',
                shortDescription: 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.',
                image: '/images/service-item-1.png',
                order: 0,
                featured: true,
                isActive: true,
            },
            {
                title: 'AI Integration & Deployment',
                slug: 'ai-integration-deployment',
                shortDescription: 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.',
                image: '/images/service-item-2.png',
                order: 1,
                featured: true,
                isActive: true,
            },
            {
                title: 'Custom AI Solutions',
                slug: 'custom-ai-solutions',
                shortDescription: 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.',
                image: '/images/service-item-3.png',
                order: 2,
                featured: true,
                isActive: true,
            },
            {
                title: 'Data-Driven Insights',
                slug: 'data-driven-insights',
                shortDescription: 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.',
                image: '/images/service-item-4.png',
                order: 3,
                featured: false,
                isActive: true,
            },
            {
                title: 'Analytics-Powered Decisions',
                slug: 'analytics-powered-decisions',
                shortDescription: 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.',
                image: '/images/service-item-5.png',
                order: 4,
                featured: false,
                isActive: true,
            },
            {
                title: 'Intelligent Data Solutions',
                slug: 'intelligent-data-solutions',
                shortDescription: 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.',
                image: '/images/service-item-6.png',
                order: 5,
                featured: false,
                isActive: true,
            },
        ]);
        await serviceRepo.save(services);
        console.log('✅ Services seeded');
    } else {
        console.log(`ℹ️  ${existingServices} service(s) already exist`);
    }

    // Seed Projects
    const existingProjects = await projectRepo.count();
    if (existingProjects === 0) {
        console.log('Creating default projects...');
        const projects = projectRepo.create([
            {
                title: 'Success Stories AI In Action',
                slug: 'success-stories',
                category: 'Data Analytics',
                featuredImage: '/images/project-1.jpg',
                featured: true,
                isActive: true,
                images: [],
            },
            {
                title: 'Success Stories AI In Action',
                slug: 'success-stories-2',
                category: 'Data Analytics',
                featuredImage: '/images/project-2.jpg',
                featured: true,
                isActive: true,
                images: [],
            },
            {
                title: 'Success Stories AI In Action',
                slug: 'success-stories-3',
                category: 'Data Analytics',
                featuredImage: '/images/project-3.jpg',
                featured: true,
                isActive: true,
                images: [],
            },
            {
                title: 'Success Stories AI In Action',
                slug: 'success-stories-4',
                category: 'Data Analytics',
                featuredImage: '/images/project-4.jpg',
                featured: true,
                isActive: true,
                images: [],
            },
            {
                title: 'AI Innovations Unleashed',
                slug: 'ai-innovations',
                category: 'Data Analytics',
                featuredImage: '/images/project-5.jpg',
                featured: false,
                isActive: true,
                images: [],
            },
            {
                title: 'Transforming Industries AI',
                slug: 'transforming-industries',
                category: 'Data Analytics',
                featuredImage: '/images/project-6.jpg',
                featured: false,
                isActive: true,
                images: [],
            },
            {
                title: 'AI at the Forefront of Change',
                slug: 'ai-forefront',
                category: 'Data Analytics',
                featuredImage: '/images/project-7.jpg',
                featured: false,
                isActive: true,
                images: [],
            },
            {
                title: 'Revolutionizing Business AI',
                slug: 'revolutionizing-business',
                category: 'Data Analytics',
                featuredImage: '/images/project-8.jpg',
                featured: false,
                isActive: true,
                images: [],
            },
        ]);
        await projectRepo.save(projects);
        console.log('✅ Projects seeded');
    } else {
        console.log(`ℹ️  ${existingProjects} project(s) already exist`);
    }

    // Seed Blog Posts
    const existingBlogs = await blogRepo.count();
    if (existingBlogs === 0) {
        console.log('Creating default blog posts...');
        const posts = blogRepo.create([
            {
                title: 'Ethical AI Balancing Innovation and Responsibility',
                slug: 'ethical-ai',
                excerpt: 'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate',
                coverImage: '/images/post-single-img.jpg',
                publishedAt: new Date('2025-05-28'),
                isPublished: true,
            },
            {
                title: "Machine Learning Demytified A Beginner's Guide",
                slug: 'ml-guide',
                excerpt: 'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate',
                coverImage: '/images/post-single-img.jpg',
                publishedAt: new Date('2025-04-22'),
                isPublished: true,
            },
            {
                title: 'How AI is Transforming Modern Businesses',
                slug: 'ai-transforming',
                excerpt: 'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate',
                coverImage: '/images/post-single-img.jpg',
                publishedAt: new Date('2025-04-17'),
                isPublished: true,
            },
        ]);
        await blogRepo.save(posts);
        console.log('✅ Blog posts seeded');
    } else {
        console.log(`ℹ️  ${existingBlogs} blog post(s) already exist`);
    }

    // Seed Team Members
    const existingTeam = await teamRepo.count();
    if (existingTeam === 0) {
        console.log('Creating default team members...');
        const members = teamRepo.create([
            {
                name: 'Sophia Bennett',
                role: 'Hacking specialist',
                image: '/images/team-1.jpg',
                order: 0,
                isActive: true,
            },
            {
                name: 'Darrell Steward',
                role: 'Attack specialist',
                image: '/images/team-2.jpg',
                order: 1,
                isActive: true,
            },
            {
                name: 'Ava Mitchell',
                role: 'Cyber Expert',
                image: '/images/team-3.jpg',
                order: 2,
                isActive: true,
            },
            {
                name: 'Ethan Carter',
                role: 'Penetration Tester',
                image: '/images/team-4.jpg',
                order: 3,
                isActive: true,
            },
            {
                name: 'Olivia Carter',
                role: 'Security Analyst',
                image: '/images/team-5.jpg',
                order: 4,
                isActive: true,
            },
            {
                name: 'Ethan Cooper',
                role: 'Security Analyst',
                image: '/images/team-6.jpg',
                order: 5,
                isActive: true,
            },
            {
                name: 'Emma Hayes',
                role: 'Cyber Expert',
                image: '/images/team-7.jpg',
                order: 6,
                isActive: true,
            },
            {
                name: 'Liam Parker',
                role: 'Penetration Tester',
                image: '/images/team-8.jpg',
                order: 7,
                isActive: true,
            },
        ]);
        await teamRepo.save(members);
        console.log('✅ Team members seeded');
    } else {
        console.log(`ℹ️  ${existingTeam} team member(s) already exist`);
    }

    // Seed Testimonials
    const existingTestimonials = await testimonialRepo.count();
    if (existingTestimonials === 0) {
        console.log('Creating default testimonials...');
        const testimonials = testimonialRepo.create([
            {
                clientName: 'Jenny W',
                clientRole: 'fintech startup',
                content: 'Working with this team we game-changer. The AI-enhanced they delivered helped  reduce bounce rates by 40% engagement like never before.',
                image: '/images/author-1.jpg',
                rating: 5,
                featured: true,
                isActive: true,
            },
            {
                clientName: 'jason m',
                clientRole: 'hardware Technician',
                content: 'Working with this team we game-changer. The AI-enhanced they delivered helped  reduce bounce rates by 40% engagement like never before.',
                image: '/images/author-2.jpg',
                rating: 5,
                featured: true,
                isActive: true,
            },
            {
                clientName: 'Lauren M',
                clientRole: 'hardware Technician',
                content: 'Working with this team we game-changer. The AI-enhanced they delivered helped  reduce bounce rates by 40% engagement like never before.',
                image: '/images/author-3.jpg',
                rating: 5,
                featured: true,
                isActive: true,
            },
        ]);
        await testimonialRepo.save(testimonials);
        console.log('✅ Testimonials seeded');
    } else {
        console.log(`ℹ️  ${existingTestimonials} testimonial(s) already exist`);
    }

    // Seed FAQs
    const existingFaqs = await faqRepo.count();
    if (existingFaqs === 0) {
        console.log('Creating default FAQs...');
        const faqs = faqRepo.create([
            {
                question: 'What services does your AI agency offer?',
                answer: 'Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.',
                order: 0,
                isActive: true,
            },
            {
                question: 'Do I need a large amount of data to use AI?',
                answer: 'Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.',
                order: 1,
                isActive: true,
            },
            {
                question: 'How long does it take to develop an AI solution?',
                answer: 'Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.',
                order: 2,
                isActive: true,
            },
            {
                question: 'Is my data secure with you?',
                answer: 'Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.',
                order: 3,
                isActive: true,
            },
            {
                question: 'Can you integrate AI into our existing systems?',
                answer: 'Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.',
                order: 4,
                isActive: true,
            },
        ]);
        await faqRepo.save(faqs);
        console.log('✅ FAQs seeded');
    } else {
        console.log(`ℹ️  ${existingFaqs} FAQ(s) already exist`);
    }
}
