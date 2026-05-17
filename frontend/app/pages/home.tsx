import { Link, useLoaderData } from 'react-router'
import { useEffect } from 'react'
import { SuspenseLoader } from '~/components/ui/suspense-loader'
import { EmptyState } from '~/components/ui/empty-state'
import { cmsService } from '~/services/httpServices/cmsService'
import {
  useFeaturedServices,
  useFeaturedProjects,
  useTestimonials,
  useStats,
  useBlogPosts,
  useFaqs,
} from '~/services/httpServices/queries'
import type { Service, Project, Testimonial, BlogPost, Faq, SeoSettings, Stats } from '~/types/cms'

export async function loader() {
  try {
    const [servicesRes, projectsRes, testimonialsRes, statsRes, blogRes, faqsRes, seoRes] =
      await Promise.all([
        cmsService.getFeaturedServices(),
        cmsService.getFeaturedProjects(),
        cmsService.getTestimonials(),
        cmsService.getStats(),
        cmsService.getBlogPosts(),
        cmsService.getFaqs(),
        cmsService.getSeoSettings(''),
      ])
    return {
      services: servicesRes.data.slice(0, 3),
      projects: projectsRes.data.slice(0, 4),
      testimonials: testimonialsRes.data.slice(0, 6),
      stats: statsRes.data,
      blogPosts: blogRes.data.slice(0, 3),
      faqs: faqsRes.data.slice(0, 5),
      seo: seoRes.data,
    }
  } catch (error) {
    console.error('Failed to load home page data', error)
    return {
      services: [],
      projects: [],
      testimonials: [],
      stats: null,
      blogPosts: [],
      faqs: [],
      seo: null,
    }
  }
}

export function meta({ data }: { data: { seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || 'Cofixer - AI Agency & Technology' },
    {
      name: 'description',
      content: seo?.metaDescription || 'AI-powered solutions for your business',
    },
  ]
}

export default function Home() {
  const {
    services: initialServices,
    projects: initialProjects,
    testimonials: initialTestimonials,
    stats: initialStats,
    blogPosts: initialBlogPosts,
    faqs: initialFaqs,
  } = useLoaderData<typeof loader>()

  const { data: services } = useFeaturedServices({ initialData: initialServices })
  const { data: projects } = useFeaturedProjects({ initialData: initialProjects })
  const { data: testimonials } = useTestimonials({ initialData: initialTestimonials })
  const { data: stats } = useStats({ initialData: initialStats ?? undefined })
  const { data: blogPosts } = useBlogPosts({ initialData: initialBlogPosts })
  const { data: faqs } = useFaqs({ initialData: initialFaqs })

  const featuredServices = services?.slice(0, 3) ?? []
  const featuredProjects = projects?.slice(0, 4) ?? []
  const featuredTestimonials = testimonials?.slice(0, 6) ?? []
  const latestBlogPosts = blogPosts?.slice(0, 3) ?? []
  const latestFaqs = faqs?.slice(0, 5) ?? []

  // Default service items if none from CMS
  const defaultServices: any[] = [
    { id: '1', title: 'AI Strategy & Consulting', shortDescription: 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.', image: '/images/service-item-1.png', slug: 'ai-strategy-consulting' },
    { id: '2', title: 'AI Integration & Deployment', shortDescription: 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.', image: '/images/service-item-2.png', slug: 'ai-integration-deployment' },
    { id: '3', title: 'Custom AI Solutions', shortDescription: 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.', image: '/images/service-item-3.png', slug: 'custom-ai-solutions' },
  ]

  const displayServices: any[] = featuredServices.length > 0 ? featuredServices : defaultServices

  // Default project items if none from CMS
  const defaultProjects: any[] = [
    { id: '1', title: 'Success Stories AI In Action', category: 'Data Analytics', featuredImage: '/images/project-1.jpg', slug: 'success-stories' },
    { id: '2', title: 'Success Stories AI In Action', category: 'Data Analytics', featuredImage: '/images/project-2.jpg', slug: 'success-stories-2' },
    { id: '3', title: 'Success Stories AI In Action', category: 'Data Analytics', featuredImage: '/images/project-3.jpg', slug: 'success-stories-3' },
    { id: '4', title: 'Success Stories AI In Action', category: 'Data Analytics', featuredImage: '/images/project-4.jpg', slug: 'success-stories-4' },
  ]

  const displayProjects: any[] = featuredProjects.length > 0 ? featuredProjects : defaultProjects

  // Default testimonials if none from CMS
  const defaultTestimonials: any[] = [
    { id: '1', clientName: 'Jenny W', clientRole: 'fintech startup', content: 'Working with this team we game-changer. The AI-enhanced they delivered helped  reduce bounce rates by 40% engagement like never before.', image: '/images/author-1.jpg' },
    { id: '2', clientName: 'jason m', clientRole: 'hardware Technician', content: 'Working with this team we game-changer. The AI-enhanced they delivered helped  reduce bounce rates by 40% engagement like never before.', image: '/images/author-2.jpg' },
    { id: '3', clientName: 'Lauren M', clientRole: 'hardware Technician', content: 'Working with this team we game-changer. The AI-enhanced they delivered helped  reduce bounce rates by 40% engagement like never before.', image: '/images/author-3.jpg' },
  ]

  const displayTestimonials: any[] = featuredTestimonials.length > 0 ? featuredTestimonials : defaultTestimonials

  // Default blog posts if none from CMS
  const defaultBlogPosts: any[] = [
    { id: '1', title: 'Ethical AI Balancing Innovation and Responsibility', excerpt: 'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate ', publishedAt: '2025-05-28', slug: 'ethical-ai' },
    { id: '2', title: 'Machine Learning Demytified A Beginner\'s Guide', excerpt: 'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate ', publishedAt: '2025-04-22', slug: 'ml-guide' },
    { id: '3', title: 'How AI is Transforming Modern Businesses', excerpt: 'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate ', publishedAt: '2025-04-17', slug: 'ai-transforming' },
  ]

  const displayBlogPosts: any[] = latestBlogPosts.length > 0 ? latestBlogPosts : defaultBlogPosts

  // Default FAQs if none from CMS
  const defaultFaqs: any[] = [
    { id: '1', question: 'What services does your AI agency offer?', answer: 'Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.' },
    { id: '2', question: 'Do I need a large amount of data to use AI?', answer: 'Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.' },
    { id: '3', question: 'How long does it take to develop an AI solution?', answer: 'Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.' },
    { id: '4', question: 'Is my data secure with you?', answer: 'Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.' },
    { id: '5', question: 'Can you integrate AI into our existing systems?', answer: 'Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.' },
  ]

  const displayFaqs: any[] = latestFaqs.length > 0 ? latestFaqs : defaultFaqs

  const getServiceImage = (service: Service, index: number) => {
    if (service.image) return service.image
    return `/images/service-item-${(index % 3) + 1}.png`
  }

  const getProjectImage = (project: Project, index: number) => {
    if (project.featuredImage) return project.featuredImage
    return `/images/project-${(index % 4) + 1}.jpg`
  }

  const getTestimonialImage = (t: Testimonial, index: number) => {
    if (t.image) return t.image
    return `/images/author-${(index % 6) + 1}.jpg`
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const $ = (window as any).$
    const gsap = (window as any).gsap
    const ScrollTrigger = (window as any).ScrollTrigger
    const SplitText = (window as any).SplitText
    const WOW = (window as any).WOW

    // Re-initialize WOW animations
    try {
      if (WOW) new WOW().init()
    } catch (e) {
      console.warn('WOW init failed:', e)
    }

    // Re-initialize text effects (skip already-split elements)
    try {
      if ($ && $('.text-effect').length && gsap && SplitText) {
        $('.text-effect').each(function (_index: number, el: HTMLElement) {
          if (el.querySelector('.split-line')) return

          if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger)
          gsap.registerPlugin(SplitText)

          const split = new SplitText(el, {
            type: 'lines,words,chars',
            linesClass: 'split-line',
          })

          gsap.set(split.chars, { opacity: 0.3, x: '-7' })

          gsap.to(split.chars, {
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              end: 'top 60%',
              markers: false,
              scrub: 1,
            },
            x: '0',
            y: '0',
            opacity: 1,
            duration: 0.7,
            stagger: 0.2,
          })
        })
      }
    } catch (e) {
      console.warn('Text effect init failed:', e)
    }

    // Re-initialize counters
    try {
      if ($ && $('.counter').length && $.fn && $.fn.counterUp) {
        $('.counter').counterUp({ delay: 6, time: 1500 })
      }
    } catch (e) {
      console.warn('Counter init failed:', e)
    }

    // Re-initialize Hero Company Slider
    try {
      const Swiper = (window as any).Swiper
      if (Swiper && $('.hero-company-slider').length) {
        const existing = ($('.hero-company-slider')[0] as any)?.swiper
        if (existing) existing.destroy(true, true)

        new Swiper('.hero-company-slider .swiper', {
          slidesPerView: 2,
          speed: 2000,
          spaceBetween: 30,
          loop: true,
          autoplay: {
            delay: 5000,
          },
          breakpoints: {
            768: { slidesPerView: 4 },
            991: { slidesPerView: 5 },
          },
        })
      }
    } catch (e) {
      console.warn('Hero company slider init failed:', e)
    }

    // Re-initialize Testimonial Slider
    try {
      const Swiper = (window as any).Swiper
      if (Swiper && $('.testimonial-slider').length) {
        const existing = ($('.testimonial-slider')[0] as any)?.swiper
        if (existing) existing.destroy(true, true)

        new Swiper('.testimonial-slider .swiper', {
          slidesPerView: 1,
          speed: 1000,
          spaceBetween: 30,
          loop: true,
          autoplay: { delay: 5000 },
          pagination: {
            el: '.testimonial-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.testimonial-button-next',
            prevEl: '.testimonial-button-prev',
          },
        })
      }
    } catch (e) {
      console.warn('Testimonial slider init failed:', e)
    }
  }, [])

  return (
    <>
      {/* Hero Section Start */}
      <div className="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              {/* Hero Content Start */}
              <div className="hero-content">
                {/* Section Title Start */}
                <div className="section-title">
                  <h1 className="wow fadeInUp" data-cursor="-opaque">Transform your business with the <span>power of AI</span></h1>
                  <p className="wow fadeInUp" data-wow-delay="0.2s">In a world where cyberattacks are becoming more sophisticated, your business deserves the best protection. Our expert team leverages cutting-edge technology.</p>
                </div>
                {/* Section Title End */}

                {/* Hero Button Start */}
                <div className="hero-btn wow fadeInUp" data-wow-delay="0.4s">
                  <Link to="/contact" className="btn-default btn-highlighted">Get Started Today</Link>
                  <Link to="/contact" className="btn-default">join now</Link>
                </div>
                {/* Hero Button End */}

                {/* Hero Company Slider Start */}
                {/* Temporarily hidden until we have real partner logos */}
                {/* <div className="hero-company-slider">
                  <p>Already chosen by the leaders</p>
                  <div className="swiper">
                    <div className="swiper-wrapper">
                      <div className="swiper-slide"><div className="company-logo"><img src="/images/company-logo-1.svg" alt="" /></div></div>
                      <div className="swiper-slide"><div className="company-logo"><img src="/images/company-logo-2.svg" alt="" /></div></div>
                      <div className="swiper-slide"><div className="company-logo"><img src="/images/company-logo-3.svg" alt="" /></div></div>
                      <div className="swiper-slide"><div className="company-logo"><img src="/images/company-logo-4.svg" alt="" /></div></div>
                      <div className="swiper-slide"><div className="company-logo"><img src="/images/company-logo-1.svg" alt="" /></div></div>
                      <div className="swiper-slide"><div className="company-logo"><img src="/images/company-logo-2.svg" alt="" /></div></div>
                      <div className="swiper-slide"><div className="company-logo"><img src="/images/company-logo-3.svg" alt="" /></div></div>
                    </div>
                  </div>
                </div> */}
                {/* Hero Company Slider End */}
              </div>
              {/* Hero Content End */}
            </div>
          </div>
        </div>
      </div>
      {/* Hero Section End */}

      {/* About Us Section Start */}
      <div className="about-us">
        <div className="container">
          <div className="row section-row align-items-center">
            <div className="col-lg-12">
              {/* Section Title Start */}
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">About Us</h3>
                <h2 className="text-effect wow fadeInUp" data-cursor="-opaque">Our team of data scientists, engineers, and designers work at the intersection technology and strategy turning complex challenges into simple, AI powered solutions.</h2>
              </div>
              {/* Section Title End */}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="about-us-box wow fadeInUp">
                <div className="about-us-item">
                  <div className="about-item-content">
                    <h3>Seamless Integration</h3>
                    <h2><span className="counter">{stats?.services ?? 298}</span>+</h2>
                  </div>
                  <div className="icon-box">
                    <img src="/images/icon-about-item-1.svg" alt="" />
                  </div>
                </div>
                <div className="about-item-image">
                  <img src="/images/about-item-image-1.png" alt="" />
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="about-us-box wow fadeInUp" data-wow-delay="0.2s">
                <div className="about-us-item">
                  <div className="about-item-content">
                    <h3>AI Projects Delivered</h3>
                    <h2><span className="counter">{stats?.projects ?? 978}</span>+</h2>
                  </div>
                  <div className="icon-box">
                    <img src="/images/icon-about-item-2.svg" alt="" />
                  </div>
                </div>
                <div className="about-item-image">
                  <img src="/images/about-item-image-2.png" alt="" />
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="about-us-box wow fadeInUp" data-wow-delay="0.4s">
                <div className="about-us-item">
                  <div className="about-item-content">
                    <h3>Handled by AI Bots</h3>
                    <h2><span className="counter">300</span>%</h2>
                  </div>
                  <div className="icon-box">
                    <img src="/images/icon-about-item-3.svg" alt="" />
                  </div>
                </div>
                <div className="about-item-image">
                  <img src="/images/about-item-image-3.png" alt="" />
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="about-us-box wow fadeInUp" data-wow-delay="0.6s">
                <div className="about-us-item">
                  <div className="about-item-content">
                    <h3>Faster Time to Market</h3>
                    <h2><span className="counter">95</span>X</h2>
                  </div>
                  <div className="icon-box">
                    <img src="/images/icon-about-item-4.svg" alt="" />
                  </div>
                </div>
                <div className="about-item-image">
                  <img src="/images/about-item-image-4.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About Us Section End */}

      {/* Our Services Section Start */}
      <div className="our-services">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              {/* Section Title Start */}
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">Our Services</h3>
                <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">AI-driven design services for future <span>innovations</span></h2>
              </div>
              {/* Section Title End */}
            </div>
          </div>

          <div className="row">
            {displayServices.map((service, index) => (
              <div className="col-lg-4 col-md-6" key={service.id}>
                <div className="service-item wow fadeInUp" data-wow-delay={index > 0 ? `${(index * 0.2).toFixed(1)}s` : undefined}>
                  <div className="service-item-content">
                    <h3><Link to={`/services/${'slug' in service ? service.slug : service.id}`}>{service.title}</Link></h3>
                    <p>{service.shortDescription || 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.'}</p>
                  </div>
                  <div className="service-item-image">
                    <figure>
                      <img src={getServiceImage(service as Service, index)} alt={service.title} />
                    </figure>
                  </div>
                </div>
              </div>
            ))}

            <div className="col-lg-12">
              {/* Service List Start */}
              <div className="service-list wow fadeInUp" data-wow-delay="0.6s">
                <ul>
                  <li>AI UI/UX Design</li>
                  <li>Chatbot Design</li>
                  <li>Design Automation</li>
                  <li>Predictive UX</li>
                  <li>Personalized Experiences</li>
                  <li>Generative Branding</li>
                  <li>Predictive UX</li>
                </ul>
              </div>
              {/* Service List End */}
            </div>
          </div>
        </div>
      </div>
      {/* Our Services Section End */}

      {/* How It Work Section Start */}
      <div className="how-it-work">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              {/* How Work Content Start */}
              <div className="how-work-content">
                {/* Section Title Start */}
                <div className="section-title">
                  <h3 className="wow fadeInUp">how it work</h3>
                  <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">Our process for smarter <span>AI solutions</span></h2>
                </div>
                {/* Section Title End */}

                {/* How Work Steps Start */}
                <div className="how-work-steps">
                  <div className="how-work-item wow fadeInUp" data-wow-delay="0.4s">
                    <div className="how-work-header">
                      <div className="icon-box">
                        <img src="/images/icon-how-work-step-1.svg" alt="" />
                      </div>
                      <div className="how-work-step-no"><p>step 01</p></div>
                    </div>
                    <div className="how-work-item-content">
                      <h3>Discovery & Strategy</h3>
                      <p>We dive deep into your goals and challenges to uncover high-impact AI opportunities and craft a clear.</p>
                    </div>
                  </div>

                  <div className="how-work-item wow fadeInUp" data-wow-delay="0.6s">
                    <div className="how-work-header">
                      <div className="icon-box">
                        <img src="/images/icon-how-work-step-2.svg" alt="" />
                      </div>
                      <div className="how-work-step-no"><p>step 02</p></div>
                    </div>
                    <div className="how-work-item-content">
                      <h3>Data & Infrastructure Assessment</h3>
                      <p>We dive deep into your goals and challenges to uncover high-impact AI opportunities and craft a clear.</p>
                    </div>
                  </div>

                  <div className="how-work-item wow fadeInUp" data-wow-delay="0.8s">
                    <div className="how-work-header">
                      <div className="icon-box">
                        <img src="/images/icon-how-work-step-3.svg" alt="" />
                      </div>
                      <div className="how-work-step-no"><p>step 03</p></div>
                    </div>
                    <div className="how-work-item-content">
                      <h3>Custom AI Development</h3>
                      <p>We dive deep into your goals and challenges to uncover high-impact AI opportunities and craft a clear.</p>
                    </div>
                  </div>

                  <div className="how-work-item wow fadeInUp" data-wow-delay="1s">
                    <div className="how-work-header">
                      <div className="icon-box">
                        <img src="/images/icon-how-work-step-4.svg" alt="" />
                      </div>
                      <div className="how-work-step-no"><p>step 04</p></div>
                    </div>
                    <div className="how-work-item-content">
                      <h3>Optimization & Support</h3>
                      <p>We dive deep into your goals and challenges to uncover high-impact AI opportunities and craft a clear.</p>
                    </div>
                  </div>
                </div>
                {/* How Work Steps End */}
              </div>
              {/* How Work Content End */}
            </div>

            <div className="col-lg-6">
              {/* How Work Video Content Start */}
              <div className="how-work-video-content">
                {/* How Work Video Start */}
                <div className="how-work-video">
                  <video autoPlay muted loop id="hwvideo"><source src="https://demo.awaikenthemes.com/assets/videos/nextmind-how-work-video.mp4" type="video/mp4" /></video>
                </div>
                {/* How Work Video End */}

                {/* Section Footer Text Start */}
                <div className="section-footer-text wow fadeInUp" data-wow-delay="0.2s">
                  <p>We help businesses design, build, and deploy intelligent solutions that drive real results. <Link to="/contact">Contact Now</Link></p>
                </div>
                {/* Section Footer Text End */}
              </div>
              {/* How Work Video Content End */}
            </div>
          </div>
        </div>
      </div>
      {/* How It Work Section End */}

      {/* Our Facts Section Start */}
      <div className="our-facts">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              {/* Section Title Start */}
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">Our facts</h3>
                <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">Why leading brands trust us to deliver smart <span>AI solutions</span></h2>
              </div>
              {/* Section Title End */}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="facts-item wow fadeInUp">
                <div className="facts-item-title"><h3>Proven Technical Expertise</h3></div>
                <div className="facts-item-counter">
                  <h2><span className="counter">{stats?.teamMembers ?? 15}</span>+</h2>
                  <p>Years of AI-Driven Design</p>
                </div>
                <div className="facts-item-content">
                  <p>Our team brings deep experience in machine learning, data engineering, and full-stack development.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="facts-item wow fadeInUp" data-wow-delay="0.2s">
                <div className="facts-item-title"><h3>Highly customizable solutions</h3></div>
                <div className="facts-item-counter">
                  <h2><span className="counter">{stats?.projects ?? 200}</span>+</h2>
                  <p>Projects Successfully Delivered</p>
                </div>
                <div className="facts-item-content">
                  <p>We don't believe in one size fits all. Every solution is tailored to your business needs and workflows.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="facts-item wow fadeInUp" data-wow-delay="0.4s">
                <div className="facts-item-title"><h3>Focus on real results</h3></div>
                <div className="facts-item-counter">
                  <h2><span className="counter">95</span>%</h2>
                  <p>Client Satisfaction Rate</p>
                </div>
                <div className="facts-item-content">
                  <p>We build AI that's safe, transparent, and responsible designed with security & compliance from day one.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              {/* Section Footer Text Start */}
              <div className="section-footer-text wow fadeInUp" data-wow-delay="0.6s">
                <p><span>Free</span> Let's make something great work together. <Link to="/contact">Get Free Quote</Link></p>
              </div>
              {/* Section Footer Text End */}
            </div>
          </div>
        </div>
      </div>
      {/* Our Facts Section End */}

      {/* Our Projects Section Start */}
      <div className="our-projects">
        <div className="container-fluid">
          <div className="row section-row">
            <div className="col-lg-12">
              {/* Section Title Start */}
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">Our project</h3>
                <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">Real projects real impact real <span>intelligence</span></h2>
              </div>
              {/* Section Title End */}
            </div>
          </div>

          <div className="row">
            {displayProjects.map((project, index) => (
              <div className="col-lg-3 col-md-6" key={project.id}>
                <div className="project-item wow fadeInUp" data-wow-delay={index > 0 ? `${(index * 0.2).toFixed(1)}s` : undefined}>
                  <div className="project-image">
                    <Link to={`/products/${'slug' in project ? project.slug : project.id}`} data-cursor-text="View">
                      <figure className="image-anime">
                        <img src={getProjectImage(project as Project, index)} alt={project.title} />
                      </figure>
                    </Link>
                  </div>
                  <div className="project-content">
                    <h3><Link to={`/products/${'slug' in project ? project.slug : project.id}`}>{project.title}</Link></h3>
                    <p>{project.category || 'Data Analytics'}</p>
                  </div>
                  <div className="project-btn">
                    <Link to={`/products/${'slug' in project ? project.slug : project.id}`}>
                      <img src="/images/arrow-white.svg" alt="" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Our Projects Section End */}

      {/* Real Impacts Section Start */}
      <div className="real-impacts">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              {/* Section Title Start */}
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">Real Impact</h3>
                <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">Delivering measurable results that drive <span>growth</span></h2>
              </div>
              {/* Section Title End */}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="real-impact-item wow fadeInUp">
                <div className="real-impact-image">
                  <h3>Increase in User Engagement Using Custom GPT Chatbots.</h3>
                  <div className="impact-chatbot-list">
                    <div className="chatbot-item"><img src="/images/impact-chatbot-1.svg" alt="" /></div>
                    <div className="chatbot-item"><img src="/images/impact-chatbot-2.svg" alt="" /></div>
                    <div className="chatbot-item"><img src="/images/impact-chatbot-3.svg" alt="" /></div>
                    <div className="chatbot-item"><img src="/images/impact-chatbot-4.svg" alt="" /></div>
                    <div className="chatbot-item"><img src="/images/impact-chatbot-5.svg" alt="" /></div>
                  </div>
                </div>
                <div className="real-impact-content">
                  <p>We believe results are more than just numbers they're proof of purpose, innovation, & value delivered. Every project we take on is built with performance in mind.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="real-impact-item wow fadeInUp" data-wow-delay="0.2s">
                <div className="real-impact-image">
                  <figure>
                    <img src="/images/real-impact-image-1.png" alt="" />
                  </figure>
                </div>
                <div className="real-impact-content highlighted-content">
                  <div className="customer-review-images">
                    <div className="customer-image reveal">
                      <figure className="image-anime">
                        <img src="/images/author-1.jpg" alt="" />
                      </figure>
                    </div>
                    <div className="customer-image reveal">
                      <figure className="image-anime">
                        <img src="/images/author-2.jpg" alt="" />
                      </figure>
                    </div>
                    <div className="customer-image reveal">
                      <figure className="image-anime">
                        <img src="/images/author-3.jpg" alt="" />
                      </figure>
                    </div>
                    <div className="customer-image reveal">
                      <figure className="image-anime">
                        <img src="/images/author-4.jpg" alt="" />
                      </figure>
                    </div>
                  </div>
                  <p>Crafting intate interface by intelligence for</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="real-impact-item wow fadeInUp" data-wow-delay="0.4s">
                <div className="real-impact-image">
                  <figure>
                    <img src="/images/real-impact-image-2.png" alt="" />
                  </figure>
                </div>
                <div className="real-impact-content">
                  <p>Crafting intuitive, user-first interfaces by intelligence for smarter, faster, and more personalized digital artificial intelligence experiences.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Real Impacts Section End */}

      {/* CTA Box Section Start */}
      <div className="cta-box">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/* CTA Box Box Start */}
              <div className="cta-box-box">
                {/* CTA Box Content Start */}
                <div className="cta-box-content">
                  {/* Section Title Start */}
                  <div className="section-title">
                    <h3 className="wow fadeInUp">our facts</h3>
                    <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">Ready to build smarter, faster, & more intelligently <span>with AI?</span></h2>
                    <p className="wow fadeInUp" data-wow-delay="0.4s">Ready to innovate with AI model? Whether you have an idea, a challenge, or a full roadmap we'd love to help bring it to life.</p>
                  </div>
                  {/* Section Title End */}

                  {/* CTA Box Body Start */}
                  <div className="cta-box-body wow fadeInUp" data-wow-delay="0.6s">
                    <Link to="/contact" className="btn-default btn-highlighted">Get Started Today</Link>
                    <Link to="/contact" className="btn-default">Send a Message</Link>
                  </div>
                  {/* CTA Box Body End */}
                </div>
                {/* CTA Box Content End */}
              </div>
              {/* CTA Box Box End */}
            </div>
          </div>
        </div>
      </div>
      {/* CTA Box Section End */}

      {/* What We Do Section Start */}
      <div className="what-we-do">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="what-we-box">
                <h3 className="text-effect">We fuse AI and creativity to deliver intelligent, personalized, and future-ready design experiences that inspire.</h3>
                <div className="what-we-img wow fadeInUp" data-wow-delay="0.2s">
                  <img src="/images/what-we-do-img.png" alt="" />
                </div>
                <div className="what-we-img-list wow fadeInUp" data-wow-delay="0.4s">
                  <ul>
                    <li>UI/UX Design</li>
                    <li>Chatbot Design</li>
                    <li>Predictive</li>
                    <li>Design Automation</li>
                    <li>Generative Branding</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="what-we-do-content">
                {/* Section Title Start */}
                <div className="section-title">
                  <h3 className="wow fadeInUp">what we do</h3>
                  <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">Innovative AI services, real-world <span>results</span></h2>
                  <p className="wow fadeInUp" data-wow-delay="0.4s">We craft cutting-edge AI solutions tailored to your business needs—driving smarter decisions, streamlined operations.</p>
                </div>
                {/* Section Title End */}

                {/* What We Do Body Start */}
                <div className="what-we-do-body wow fadeInUp" data-wow-delay="0.6s">
                  <ul>
                    <li>Computer Vision</li>
                    <li>AI Integration</li>
                    <li>Ongoing Support</li>
                    <li>AI Strategy</li>
                    <li>Custom AI Development</li>
                  </ul>
                </div>
                {/* What We Do Body End */}

                {/* What We Do Button Start */}
                <div className="what-we-do-button wow fadeInUp" data-wow-delay="0.8s">
                  <Link to="/contact" className="btn-default">contact us</Link>
                </div>
                {/* What We Do Button End */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* What We Do Section End */}

      {/* Our Testimonials Section Start */}
      <div className="our-testimonials">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="testimonials-box">
                {/* Testimonials Content Start */}
                <div className="testimonials-content">
                  {/* Section Title Start */}
                  <div className="section-title">
                    <h3 className="wow fadeInUp">testimonials</h3>
                    <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">Powering innovation with data-driven <span>design</span></h2>
                    <p className="wow fadeInUp" data-wow-delay="0.4s">Crafting intuitive, user-first interfaces by intelligence for smarter, faster, and more personalized digital artificial intelligence experiences.</p>
                  </div>
                  {/* Section Title End */}

                  {/* Testimonials Body Start */}
                  <div className="testimonials-body">
                    <div className="testimonials-counter-item">
                      <h2><span className="counter">200</span>+</h2>
                      <p>projects successfully</p>
                    </div>
                    <div className="testimonials-counter-item">
                      <h2><span className="counter">600</span>+</h2>
                      <p>projects successfully</p>
                    </div>
                  </div>
                  {/* Testimonials Body End */}
                </div>
                {/* Testimonials Content End */}

                {/* Testimonial Slider Start */}
                <div className="testimonial-slider">
                  <div className="swiper">
                    <div className="swiper-wrapper">
                      {displayTestimonials.map((t, index) => (
                        <div className="swiper-slide" key={t.id}>
                          <div className="testimonial-item">
                            <div className="testimonial-header">
                              <div className="testimonial-author">
                                <div className="author-image">
                                  <figure className="image-anime">
                                    <img src={getTestimonialImage(t as Testimonial, index)} alt={t.clientName} />
                                  </figure>
                                </div>
                                <div className="author-content">
                                  <h3>{t.clientName}</h3>
                                  <p>{t.clientRole || 'fintech startup'}</p>
                                </div>
                              </div>
                              <div className="testimonial-quotes-img">
                                <img src="/images/testimonials-quotes-img.svg" alt="" />
                              </div>
                            </div>
                            <div className="testimonial-content">
                              <p>"{t.content}"</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="testimonial-pagination"></div>
                  </div>
                </div>
                {/* Testimonial Slider End */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Our Testimonials Section End */}

      {/* Our Faqs Section Start */}
      <div className="our-faqs">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="faqs-content">
                {/* Section Title Start */}
                <div className="section-title">
                  <h3 className="wow fadeInUp">faq's</h3>
                  <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">Your AI questions, expertly <span>answered here</span></h2>
                </div>
                {/* Section Title End */}

                {/* Faq's Button Start */}
                <div className="faqs-button wow fadeInUp" data-wow-delay="0.4s">
                  <Link to="/faqs" className="btn-default">View all faqs</Link>
                </div>
                {/* Faq's Button End */}
              </div>
            </div>
            <div className="col-lg-6">
              {/* FAQ Accordion Start */}
              <div className="faq-accordion" id="accordion">
                {displayFaqs.map((faq, index) => (
                  <div className="accordion-item wow fadeInUp" data-wow-delay={index > 0 ? `${(index * 0.2).toFixed(1)}s` : undefined} key={faq.id}>
                    <h2 className="accordion-header" id={`heading${index}`}>
                      <button className={`accordion-button ${index !== 1 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded={index === 1 ? 'true' : 'false'} aria-controls={`collapse${index}`}>
                        {index + 1}. {faq.question}
                      </button>
                    </h2>
                    <div id={`collapse${index}`} className={`accordion-collapse collapse ${index === 1 ? 'show' : ''}`} aria-labelledby={`heading${index}`} data-bs-parent="#accordion">
                      <div className="accordion-body">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* FAQ Accordion End */}
            </div>
          </div>
        </div>
      </div>
      {/* Our Faqs Section End */}

      {/* Our Blog Section Start */}
      <div className="our-blog">
        <div className="container">
          <div className="row section-row align-items-center">
            <div className="col-lg-12">
              {/* Section Title Start */}
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">Latest blog</h3>
                <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">Your source for cybersecurity <span>news and trends</span></h2>
              </div>
              {/* Section Title End */}
            </div>
          </div>

          <div className="row">
            {displayBlogPosts.map((post, index) => (
              <div className="col-lg-4 col-md-6" key={post.id}>
                <div className="post-item wow fadeInUp" data-wow-delay={index > 0 ? `${(index * 0.2).toFixed(1)}s` : undefined}>
                  {/* Post Meta Start */}
                  <div className="post-meta">
                    <ul>
                      <li><span><i className="fa-solid fa-calendar-days"></i> {formatDate(post.publishedAt)}</span></li>
                    </ul>
                  </div>
                  {/* Post Meta End */}

                  {/* Post Item Content Start */}
                  <div className="post-item-content">
                    <h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2>
                    <p>{post.excerpt || 'As AI continue to evolve, ensuring use more important than ever this article explores how businesses can innovate '}</p>
                  </div>
                  {/* Post Item Content End */}

                  {/* Post Item Readmore Button Start*/}
                  <div className="post-item-btn">
                    <Link to={`/blog/${post.slug}`} className="readmore-btn">read more</Link>
                  </div>
                  {/* Post Item Readmore Button End*/}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Our Blog Section End */}
    </>
  )
}
