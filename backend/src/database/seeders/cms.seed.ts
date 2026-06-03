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
                title: 'AI Workflow Automation',
                slug: 'ai-workflow-automation',
                shortDescription:
                    'Automate repetitive business processes with intelligent AI systems that save time, reduce costs, and improve operational efficiency.',
                image: '/images/service-item-1.png',
                order: 0,
                featured: true,
                isActive: true,
            },
            {
                title: 'Autonomous AI Agents',
                slug: 'autonomous-ai-agents',
                shortDescription:
                    'Deploy intelligent agents that handle complex tasks autonomously, streamlining operations and accelerating digital transformation.',
                image: '/images/service-item-2.png',
                order: 1,
                featured: true,
                isActive: true,
            },
            {
                title: 'Custom AI Solutions',
                slug: 'custom-ai-solutions',
                shortDescription:
                    'Tailored AI systems designed to solve your unique business challenges with scalable, cost-effective implementation.',
                image: '/images/service-item-3.png',
                order: 2,
                featured: true,
                isActive: true,
            },
            {
                title: 'Software Development',
                slug: 'software-development',
                shortDescription:
                    'Custom software and system architecture for startups and enterprises, built with modern technologies and scalable design.',
                image: '/images/service-item-4.png',
                order: 3,
                featured: false,
                isActive: true,
            },
            {
                title: 'Workflow Automation',
                slug: 'workflow-automation',
                shortDescription:
                    'End-to-end automation of business processes using both AI and traditional methods to maximize efficiency and minimize manual work.',
                image: '/images/service-item-5.png',
                order: 4,
                featured: false,
                isActive: true,
            },
            {
                title: 'Infrastructure Optimization',
                slug: 'infrastructure-optimization',
                shortDescription:
                    'Cost-effective AI and software infrastructure that scales with your business without compromising performance or reliability.',
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
                title: 'Workflow Automation Platform',
                slug: 'workflow-automation-platform',
                category: 'SaaS Product',
                featuredImage: '/images/project-1.jpg',
                featured: true,
                isActive: true,
                images: [],
            },
            {
                title: 'Intelligent Operations Dashboard',
                slug: 'intelligent-operations-dashboard',
                category: 'SaaS Product',
                featuredImage: '/images/project-2.jpg',
                featured: true,
                isActive: true,
                images: [],
            },
            {
                title: 'Autonomous Agent Framework',
                slug: 'autonomous-agent-framework',
                category: 'AI Infrastructure',
                featuredImage: '/images/project-3.jpg',
                featured: true,
                isActive: true,
                images: [],
            },
            {
                title: 'Business Process Optimizer',
                slug: 'business-process-optimizer',
                category: 'SaaS Product',
                featuredImage: '/images/project-4.jpg',
                featured: true,
                isActive: true,
                images: [],
            },
            {
                title: 'Enterprise Automation Suite',
                slug: 'enterprise-automation-suite',
                category: 'Enterprise SaaS',
                featuredImage: '/images/project-5.jpg',
                featured: false,
                isActive: true,
                images: [],
            },
            {
                title: 'AI-Powered CRM Integration',
                slug: 'ai-powered-crm-integration',
                category: 'Custom Solution',
                featuredImage: '/images/project-6.jpg',
                featured: false,
                isActive: true,
                images: [],
            },
            {
                title: 'Smart Document Processing',
                slug: 'smart-document-processing',
                category: 'AI Product',
                featuredImage: '/images/project-7.jpg',
                featured: false,
                isActive: true,
                images: [],
            },
            {
                title: 'Predictive Maintenance System',
                slug: 'predictive-maintenance-system',
                category: 'Custom Solution',
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
                excerpt:
                    'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate',
                coverImage: '/images/post-single-img.jpg',
                publishedAt: new Date('2025-05-28'),
                isPublished: true,
            },
            {
                title: "Machine Learning Demytified A Beginner's Guide",
                slug: 'ml-guide',
                excerpt:
                    'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate',
                coverImage: '/images/post-single-img.jpg',
                publishedAt: new Date('2025-04-22'),
                isPublished: true,
            },
            {
                title: 'How AI is Transforming Modern Businesses',
                slug: 'ai-transforming',
                excerpt:
                    'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate',
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
                role: 'AI Engineer',
                image: '/images/team-2.jpg',
                order: 1,
                isActive: true,
            },
            {
                name: 'Ava Mitchell',
                role: 'Product Designer',
                image: '/images/team-3.jpg',
                order: 2,
                isActive: true,
            },
            {
                name: 'Ethan Carter',
                role: 'Software Architect',
                image: '/images/team-4.jpg',
                order: 3,
                isActive: true,
            },
            {
                name: 'Olivia Carter',
                role: 'AI Product Manager',
                image: '/images/team-5.jpg',
                order: 4,
                isActive: true,
            },
            {
                name: 'Ethan Cooper',
                role: 'Full Stack Developer',
                image: '/images/team-6.jpg',
                order: 5,
                isActive: true,
            },
            {
                name: 'Emma Hayes',
                role: 'DevOps Engineer',
                image: '/images/team-7.jpg',
                order: 6,
                isActive: true,
            },
            {
                name: 'Liam Parker',
                role: 'ML Engineer',
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
                clientRole: 'Operations Director',
                content:
                    'CoFixer automated our core workflows with AI agents, cutting operational costs by 40% and freeing our team to focus on strategic growth.',
                image: '/images/author-1.jpg',
                rating: 5,
                featured: true,
                isActive: true,
            },
            {
                clientName: 'Jason M',
                clientRole: 'CTO',
                content:
                    'Their SaaS product streamlined our entire software development lifecycle. We ship faster, with fewer bugs, and at a fraction of the previous infrastructure cost.',
                image: '/images/author-2.jpg',
                rating: 5,
                featured: true,
                isActive: true,
            },
            {
                clientName: 'Lauren M',
                clientRole: 'VP of Engineering',
                content:
                    'The autonomous AI agents CoFixer built handle our routine data processing end-to-end. It is like having a 24/7 operations team that never sleeps.',
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
                question: 'What does your AI company offer?',
                answer: 'We build AI-powered SaaS products and autonomous agents as our primary focus. We also offer custom software development, workflow automation, system architecture, and scalable digital solutions as our secondary service offering.',
                order: 0,
                isActive: true,
            },
            {
                question: 'Do I need a large amount of data to use AI?',
                answer: 'Not necessarily. Our SaaS products are designed to work with varying data volumes. For custom solutions, we help you collect, clean, and structure data effectively, even if you are starting small.',
                order: 1,
                isActive: true,
            },
            {
                question: 'How long does it take to develop an AI solution?',
                answer: 'SaaS products are available immediately upon subscription. For custom AI and software development, timelines typically range from 4 to 12 weeks depending on complexity. We provide a clear roadmap during the discovery phase.',
                order: 2,
                isActive: true,
            },
            {
                question: 'Is my data secure with you?',
                answer: 'Absolutely. Security and compliance are built into every product and service from day one. We use enterprise-grade encryption, secure infrastructure, and follow industry best practices for data protection.',
                order: 3,
                isActive: true,
            },
            {
                question: 'Can you integrate AI into our existing systems?',
                answer: 'Yes. Our SaaS products and custom solutions are designed to integrate seamlessly with your existing tech stack, including CRMs, ERPs, databases, and third-party APIs through standard protocols.',
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
