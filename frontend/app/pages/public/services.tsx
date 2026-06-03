import { Link, useLoaderData } from 'react-router'
import { cmsService } from '~/services/httpServices/cmsService'
import { useServices } from '~/services/httpServices/queries'
import type { SeoSettings } from '~/types/cms'

export async function loader() {
  try {
    const [servicesRes, seoRes] = await Promise.all([
      cmsService.getServices(),
      cmsService.getSeoSettings('services'),
    ])
    return { services: servicesRes.data, seo: seoRes.data }
  } catch (error) {
    console.error('Failed to load services', error)
    return { services: [], seo: null }
  }
}

export function meta({ data }: { data: { seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || 'Our Services | Cofixer' },
    { name: 'description', content: seo?.metaDescription || 'Explore our AI-powered services' },
  ]
}

export default function ServicesPage() {
  const { services: initialServices } = useLoaderData<typeof loader>()
  const { data: services } = useServices({
    initialData: initialServices,
  })

  // Default service items if none from CMS
  const defaultServices: any[] = [
    { id: '1', title: 'AI Workflow Automation', shortDescription: 'Automate repetitive business processes with intelligent AI systems that save time, reduce costs, and improve operational efficiency.', image: '/images/service-item-1.png', slug: 'ai-workflow-automation' },
    { id: '2', title: 'Autonomous AI Agents', shortDescription: 'Deploy intelligent agents that handle complex tasks autonomously, streamlining operations and accelerating digital transformation.', image: '/images/service-item-2.png', slug: 'autonomous-ai-agents' },
    { id: '3', title: 'Custom AI Solutions', shortDescription: 'Tailored AI systems designed to solve your unique business challenges with scalable, cost-effective implementation.', image: '/images/service-item-3.png', slug: 'custom-ai-solutions' },
    { id: '4', title: 'Software Development', shortDescription: 'Custom software and system architecture for startups and enterprises, built with modern technologies and scalable design.', image: '/images/service-item-4.png', slug: 'software-development' },
    { id: '5', title: 'Workflow Automation', shortDescription: 'End-to-end automation of business processes using both AI and traditional methods to maximize efficiency and minimize manual work.', image: '/images/service-item-5.png', slug: 'workflow-automation' },
    { id: '6', title: 'Infrastructure Optimization', shortDescription: 'Cost-effective AI and software infrastructure that scales with your business without compromising performance or reliability.', image: '/images/service-item-6.png', slug: 'infrastructure-optimization' },
  ]

  const displayServices: any[] = services && services.length > 0 ? services : defaultServices

  return (
    <>
      {/* Page Header Start */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              {/* Page Header Box Start */}
              <div className="page-header-box">
                <h1 className="wow fadeInUp" data-cursor="-opaque">Our <span>services</span></h1>
                <nav className="wow fadeInUp" data-wow-delay="0.2s">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">services</li>
                  </ol>
                </nav>
              </div>
              {/* Page Header Box End */}
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      {/* Page Services Section Start */}
      <div className="page-services">
        <div className="container">
          <div className="row">
            {displayServices.map((service, index) => (
              <div className="col-lg-4 col-md-6" key={service.id}>
                <div className="service-item wow fadeInUp" data-wow-delay={index > 0 ? `${(index * 0.2).toFixed(1)}s` : undefined}>
                  <div className="service-item-content">
                    <h3><Link to={`/services/${'slug' in service ? service.slug : service.id}`}>{service.title}</Link></h3>
                    <p>{service.shortDescription || 'We build intelligent SaaS products and custom AI solutions that automate workflows, improve efficiency, and drive real business results.'}</p>
                  </div>
                  <div className="service-item-image">
                    <figure>
                      <img src={service.image || `/images/service-item-${(index % 6) + 1}.png`} alt={service.title} />
                    </figure>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Page Services Section End */}

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
                  <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">Our process for building <span>AI products</span></h2>
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
                      <p>We analyze your workflows, infrastructure, and goals to identify the best AI or software solution for your needs.</p>
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
                      <p>We evaluate your existing systems, data readiness, and infrastructure to design a scalable, cost-effective architecture.</p>
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
                      <h3>Product Development</h3>
                      <p>We build your SaaS product, AI agent, or custom software with agile methodology, ensuring quality at every sprint.</p>
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
                      <p>We continuously optimize performance, reduce infrastructure costs, and provide ongoing support to maximize your ROI.</p>
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
                  <p>We help businesses automate workflows, build intelligent SaaS products, and deploy autonomous agents that drive real results. <Link to="/contact">Contact Now</Link></p>
                </div>
                {/* Section Footer Text End */}
              </div>
              {/* How Work Video Content End */}
            </div>
          </div>
        </div>
      </div>
      {/* How It Work Section End */}

      {/* What We Do Section Start */}
      <div className="what-we-do">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="what-we-box">
                <h3 className="text-effect">We build AI-powered SaaS products and autonomous agents that automate workflows, streamline operations, and accelerate digital transformation.</h3>
                <div className="what-we-img wow fadeInUp" data-wow-delay="0.2s">
                  <img src="/images/what-we-do-img.png" alt="" />
                </div>
                <div className="what-we-img-list wow fadeInUp" data-wow-delay="0.4s">
                  <ul>
                    <li>Workflow Automation</li>
                    <li>AI Agents</li>
                    <li>SaaS Products</li>
                    <li>Infrastructure Optimization</li>
                    <li>Custom AI Development</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="what-we-do-content">
                {/* Section Title Start */}
                <div className="section-title">
                  <h3 className="wow fadeInUp">what we do</h3>
                  <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">Innovative AI products, real-world <span>results</span></h2>
                  <p className="wow fadeInUp" data-wow-delay="0.4s">We build intelligent SaaS products that solve real business problems—backed by custom AI services when you need them.</p>
                </div>
                {/* Section Title End */}

                {/* What We Do Body Start */}
                <div className="what-we-do-body wow fadeInUp" data-wow-delay="0.6s">
                  <ul>
                    <li>Workflow Automation</li>
                    <li>AI Agents</li>
                    <li>SaaS Products</li>
                    <li>Infrastructure Optimization</li>
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
                    <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">Powering innovation with AI-driven <span>automation</span></h2>
                    <p className="wow fadeInUp" data-wow-delay="0.4s">Building intelligent SaaS products and automation systems that make AI practical, accessible, and efficient for modern businesses.</p>
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
                      {/* Testimonial Slide Start */}
                      <div className="swiper-slide">
                        <div className="testimonial-item">
                          <div className="testimonial-header">
                            <div className="testimonial-author">
                              <div className="author-image">
                                <figure className="image-anime">
                                  <img src="/images/author-1.jpg" alt="" />
                                </figure>
                              </div>
                              <div className="author-content">
                                <h3>Jenny W</h3>
                                <p>Operations Director</p>
                              </div>
                            </div>
                            <div className="testimonial-quotes-img">
                              <img src="/images/testimonials-quotes-img.svg" alt="" />
                            </div>
                          </div>
                          <div className="testimonial-content">
                            <p>"CoFixer automated our core workflows with AI agents, cutting operational costs by 40% and freeing our team to focus on strategic growth."</p>
                          </div>
                        </div>
                      </div>
                      {/* Testimonial Slide End */}

                      {/* Testimonial Slide Start */}
                      <div className="swiper-slide">
                        <div className="testimonial-item">
                          <div className="testimonial-header">
                            <div className="testimonial-author">
                              <div className="author-image">
                                <figure className="image-anime">
                                  <img src="/images/author-2.jpg" alt="" />
                                </figure>
                              </div>
                              <div className="author-content">
                                <h3>Jason M</h3>
                                <p>CTO</p>
                              </div>
                            </div>
                            <div className="testimonial-quotes-img">
                              <img src="/images/testimonials-quotes-img.svg" alt="" />
                            </div>
                          </div>
                          <div className="testimonial-content">
                            <p>"Their SaaS product streamlined our entire software development lifecycle. We ship faster, with fewer bugs, and at a fraction of the previous infrastructure cost."</p>
                          </div>
                        </div>
                      </div>
                      {/* Testimonial Slide End */}
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
      <div className="our-faqs about-our-faqs">
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
                {/* FAQ Item Start */}
                <div className="accordion-item wow fadeInUp">
                  <h2 className="accordion-header" id="heading1">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
                       1. What does your AI company offer?
                    </button>
                  </h2>
                  <div id="collapse1" className="accordion-collapse collapse" aria-labelledby="heading1" data-bs-parent="#accordion">
                    <div className="accordion-body">
                       <p>We build AI-powered SaaS products and autonomous agents as our primary focus. We also offer custom software development, workflow automation, system architecture, and scalable digital solutions as our secondary service offering.</p>
                     </div>
                   </div>
                 </div>
                 {/* FAQ Item End */}
 
                 {/* FAQ Item Start */}
                 <div className="accordion-item wow fadeInUp" data-wow-delay="0.2s">
                   <h2 className="accordion-header" id="heading2">
                     <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                       2. Do I need a large amount of data to use AI?
                     </button>
                   </h2>
                   <div id="collapse2" className="accordion-collapse collapse show" aria-labelledby="heading2" data-bs-parent="#accordion">
                     <div className="accordion-body">
                       <p>Not necessarily. Our SaaS products are designed to work with varying data volumes. For custom solutions, we help you collect, clean, and structure data effectively, even if you are starting small.</p>
                    </div>
                  </div>
                </div>
                {/* FAQ Item End */}

                {/* FAQ Item Start */}
                <div className="accordion-item wow fadeInUp" data-wow-delay="0.4s">
                  <h2 className="accordion-header" id="heading3">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
                      3. How long does it take to develop an AI solution?
                    </button>
                  </h2>
                  <div id="collapse3" className="accordion-collapse collapse" aria-labelledby="heading3" data-bs-parent="#accordion">
                    <div className="accordion-body">
                       <p>SaaS products are available immediately upon subscription. For custom AI and software development, timelines typically range from 4 to 12 weeks depending on complexity. We provide a clear roadmap during the discovery phase.</p>
                     </div>
                   </div>
                 </div>
                 {/* FAQ Item End */}

                 {/* FAQ Item Start */}
                 <div className="accordion-item wow fadeInUp" data-wow-delay="0.6s">
                   <h2 className="accordion-header" id="heading4">
                     <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
                       4. Is my data secure with you?
                     </button>
                   </h2>
                   <div id="collapse4" className="accordion-collapse collapse" aria-labelledby="heading4" data-bs-parent="#accordion">
                     <div className="accordion-body">
                        <p>Absolutely. Security and compliance are built into every product and service from day one. We use enterprise-grade encryption, secure infrastructure, and follow industry best practices for data protection.</p>
                      </div>
                    </div>
                  </div>
                  {/* FAQ Item End */}

                 {/* FAQ Item Start */}
                 <div className="accordion-item wow fadeInUp" data-wow-delay="0.8s">
                  <h2 className="accordion-header" id="heading5">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="false" aria-controls="collapse5">
                      5. Can you integrate AI into our existing systems?
                    </button>
                  </h2>
                  <div id="collapse5" className="accordion-collapse collapse" aria-labelledby="heading5" data-bs-parent="#accordion">
                    <div className="accordion-body">
                       <p>Yes. Our SaaS products and custom solutions are designed to integrate seamlessly with your existing tech stack, including CRMs, ERPs, databases, and third-party APIs through standard protocols.</p>
                     </div>
                   </div>
                 </div>
                 {/* FAQ Item End */}
               </div>
               {/* FAQ Accordion End */}
            </div>
          </div>
        </div>
      </div>
      {/* Our Faqs Section End */}
    </>
  )
}
