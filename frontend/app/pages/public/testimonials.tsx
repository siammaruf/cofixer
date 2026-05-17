import { Link, useLoaderData } from 'react-router'
import { cmsService } from '~/services/httpServices/cmsService'
import { useTestimonials } from '~/services/httpServices/queries'
import type { SeoSettings } from '~/types/cms'

export async function loader() {
  try {
    const [testimonialsRes, seoRes] = await Promise.all([
      cmsService.getTestimonials(),
      cmsService.getSeoSettings('testimonials'),
    ])
    return { testimonials: testimonialsRes.data, seo: seoRes.data }
  } catch (error) {
    console.error('Failed to load testimonials', error)
    return { testimonials: [], seo: null }
  }
}

export function meta({ data }: { data: { seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || 'Testimonials | Cofixer' },
    { name: 'description', content: seo?.metaDescription || 'What our clients say about us' },
  ]
}

export default function TestimonialsPage() {
  const { testimonials: initialTestimonials } = useLoaderData<typeof loader>()
  const { data: testimonials } = useTestimonials({
    initialData: initialTestimonials,
  })

  // Default testimonials if none from CMS
  const defaultTestimonials = [
    { id: '1', clientName: 'Jenny W', clientRole: 'fintech startup', content: 'Working with this team we game-changer. The AI-enhanced they delivered helped  reduce bounce rates by 40% engagement like never before.', image: '/images/author-1.jpg' },
    { id: '2', clientName: 'jason m', clientRole: 'hardware Technician', content: 'Working with this team we game-changer. The AI-enhanced they delivered helped  reduce bounce rates by 40% engagement like never before.', image: '/images/author-2.jpg' },
    { id: '3', clientName: 'Lauren M', clientRole: 'hardware Technician', content: 'Working with this team we game-changer. The AI-enhanced they delivered helped  reduce bounce rates by 40% engagement like never before.', image: '/images/author-3.jpg' },
    { id: '4', clientName: 'Mason D', clientRole: 'fintech startup', content: 'Working with this team we game-changer. The AI-enhanced they delivered helped  reduce bounce rates by 40% engagement like never before.', image: '/images/author-4.jpg' },
    { id: '5', clientName: 'Ethan R', clientRole: 'fintech startup', content: 'Working with this team we game-changer. The AI-enhanced they delivered helped  reduce bounce rates by 40% engagement like never before.', image: '/images/author-5.jpg' },
    { id: '6', clientName: 'Logan P', clientRole: 'fintech startup', content: 'Working with this team we game-changer. The AI-enhanced they delivered helped  reduce bounce rates by 40% engagement like never before.', image: '/images/author-6.jpg' },
  ]

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials

  return (
    <>
      {/* Page Header Start */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              {/* Page Header Box Start */}
              <div className="page-header-box">
                <h1 className="wow fadeInUp" data-cursor="-opaque">Our <span>testimonials</span></h1>
                <nav className="wow fadeInUp" data-wow-delay="0.2s">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">testimonials</li>
                  </ol>
                </nav>
              </div>
              {/* Page Header Box End */}
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      {/* Page Testimonials Start */}
      <div className="page-testimonials">
        <div className="container">
          <div className="row">
            {displayTestimonials.map((t, index) => (
              <div className="col-lg-4 col-md-6" key={t.id}>
                {/* Testimonial Item Start */}
                <div className={`testimonial-item wow fadeInUp${index === 1 ? ' active' : ''}`} data-wow-delay={index > 0 ? `${(index * 0.2).toFixed(1)}s` : undefined}>
                  <div className="testimonial-header">
                    <div className="testimonial-author">
                      <div className="author-image">
                        <figure className="image-anime">
                          <img src={t.image || `/images/author-${(index % 6) + 1}.jpg`} alt={t.clientName} />
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
                {/* Testimonial Item End */}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Page Testimonials End */}

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
              {/* Facts Item Start */}
              <div className="facts-item wow fadeInUp">
                <div className="facts-item-title">
                  <h3>Proven Technical Expertise</h3>
                </div>
                <div className="facts-item-counter">
                  <h2><span className="counter">15</span>+</h2>
                  <p>Years of AI-Driven Design</p>
                </div>
                <div className="facts-item-content">
                  <p>Our team brings deep experience in machine learning, data engineering, and full-stack development.</p>
                </div>
              </div>
              {/* Facts Item End */}
            </div>

            <div className="col-lg-4 col-md-6">
              {/* Facts Item Start */}
              <div className="facts-item wow fadeInUp" data-wow-delay="0.2s">
                <div className="facts-item-title">
                  <h3>Highly customizable solutions</h3>
                </div>
                <div className="facts-item-counter">
                  <h2><span className="counter">200</span>+</h2>
                  <p>Projects Successfully Delivered</p>
                </div>
                <div className="facts-item-content">
                  <p>We don't believe in one size fits all. Every solution is tailored to your business needs and workflows.</p>
                </div>
              </div>
              {/* Facts Item End */}
            </div>

            <div className="col-lg-4 col-md-6">
              {/* Facts Item Start */}
              <div className="facts-item wow fadeInUp" data-wow-delay="0.4s">
                <div className="facts-item-title">
                  <h3>Focus on real results</h3>
                </div>
                <div className="facts-item-counter">
                  <h2><span className="counter">95</span>%</h2>
                  <p>Client Satisfaction Rate</p>
                </div>
                <div className="facts-item-content">
                  <p>We build AI that's safe, transparent, and responsible designed with security & compliance from day one.</p>
                </div>
              </div>
              {/* Facts Item End */}
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
