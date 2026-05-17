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
    { id: '1', title: 'AI Strategy & Consulting', shortDescription: 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.', image: '/images/service-item-1.png', slug: 'ai-strategy-consulting' },
    { id: '2', title: 'AI Integration & Deployment', shortDescription: 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.', image: '/images/service-item-2.png', slug: 'ai-integration-deployment' },
    { id: '3', title: 'Custom AI Solutions', shortDescription: 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.', image: '/images/service-item-3.png', slug: 'custom-ai-solutions' },
    { id: '4', title: 'Data-Driven Insights', shortDescription: 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.', image: '/images/service-item-4.png', slug: 'data-driven-insights' },
    { id: '5', title: 'Analytics-Powered Decisions', shortDescription: 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.', image: '/images/service-item-5.png', slug: 'analytics-powered-decisions' },
    { id: '6', title: 'Intelligent Data Solutions', shortDescription: 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.', image: '/images/service-item-6.png', slug: 'intelligent-data-solutions' },
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
                    <p>{service.shortDescription || 'We assess your business, identify high impact AI opportunities, and guide you with a clear roadmap for implementation.'}</p>
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
                                <p>fintech startup</p>
                              </div>
                            </div>
                            <div className="testimonial-quotes-img">
                              <img src="/images/testimonials-quotes-img.svg" alt="" />
                            </div>
                          </div>
                          <div className="testimonial-content">
                            <p>"Working with this team we game-changer. The AI-enhanced they delivered helped  reduce bounce rates by 40% engagement like never before."</p>
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
                                <h3>jason m</h3>
                                <p>hardware Technician</p>
                              </div>
                            </div>
                            <div className="testimonial-quotes-img">
                              <img src="/images/testimonials-quotes-img.svg" alt="" />
                            </div>
                          </div>
                          <div className="testimonial-content">
                            <p>"Working with this team we game-changer. The AI-enhanced they delivered helped  reduce bounce rates by 40% engagement like never before."</p>
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
                                  <img src="/images/author-3.jpg" alt="" />
                                </figure>
                              </div>
                              <div className="author-content">
                                <h3>Lauren M</h3>
                                <p>hardware Technician</p>
                              </div>
                            </div>
                            <div className="testimonial-quotes-img">
                              <img src="/images/testimonials-quotes-img.svg" alt="" />
                            </div>
                          </div>
                          <div className="testimonial-content">
                            <p>"Working with this team we game-changer. The AI-enhanced they delivered helped  reduce bounce rates by 40% engagement like never before."</p>
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
                      1. What services does your AI agency offer?
                    </button>
                  </h2>
                  <div id="collapse1" className="accordion-collapse collapse" aria-labelledby="heading1" data-bs-parent="#accordion">
                    <div className="accordion-body">
                      <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
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
                      <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
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
                      <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
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
                      <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
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
                      <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
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
