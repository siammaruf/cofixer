import { Link, useLoaderData } from 'react-router'
import { cmsService } from '~/services/httpServices/cmsService'
import { useTeam, useStats } from '~/services/httpServices/queries'
import type { SeoSettings } from '~/types/cms'

export async function loader() {
  try {
    const [teamRes, statsRes, seoRes] = await Promise.all([
      cmsService.getTeam(),
      cmsService.getStats(),
      cmsService.getSeoSettings('about'),
    ])
    return {
      members: teamRes.data.slice(0, 4),
      stats: statsRes.data,
      seo: seoRes.data,
    }
  } catch (error) {
    console.error('Failed to load about page data', error)
    return { members: [], stats: null, seo: null }
  }
}

export function meta({ data }: { data: { seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || 'About Us | Cofixer' },
    { name: 'description', content: seo?.metaDescription || 'Learn about Cofixer and our team' },
  ]
}

export default function About() {
  const { members: initialMembers, stats: initialStats } = useLoaderData<typeof loader>()
  const { data: teamData } = useTeam({ initialData: initialMembers })
  const { data: stats } = useStats({ initialData: initialStats ?? undefined })

  const members = teamData?.slice(0, 4) ?? []

  // Default team members if none from CMS
  const defaultMembers = [
    { id: '1', name: 'Sophia Bennett', role: 'Hacking specialist', image: '/images/team-1.jpg' },
    { id: '2', name: 'Darrell steward', role: 'Attack specialist', image: '/images/team-2.jpg' },
    { id: '3', name: 'Ava mitchell', role: 'Cyber Expert', image: '/images/team-3.jpg' },
    { id: '4', name: 'Ethan carter', role: 'Penetration Tester', image: '/images/team-4.jpg' },
  ]

  const displayMembers = members.length > 0 ? members : defaultMembers

  return (
    <>
      {/* Page Header Start */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              {/* Page Header Box Start */}
              <div className="page-header-box">
                <h1 className="wow fadeInUp" data-cursor="-opaque">About <span>us</span></h1>
                <nav className="wow fadeInUp" data-wow-delay="0.2s">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">about us</li>
                  </ol>
                </nav>
              </div>
              {/* Page Header Box End */}
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

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

      {/* Our Approach Section Start */}
      <div className="our-approach">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              {/* Section Title Start */}
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">Our mission</h3>
                <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">Driving innovation through intelligent <span>technology</span></h2>
              </div>
              {/* Section Title End */}
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6">
              {/* Approach Item List Start */}
              <div className="approach-item-list">
                {/* Approach Item Start */}
                <div className="approach-item wow fadeInUp">
                  <div className="icon-box">
                    <img src="/images/icon-approach-1.svg" alt="" />
                  </div>
                  <div className="approach-item-content">
                    <h3>Our Mission</h3>
                    <p>Our mission is to harness the power of AI to solve real-world problems. From automating tasks to delivering data-driven insights.</p>
                  </div>
                </div>
                {/* Approach Item End */}

                {/* Approach Item Start */}
                <div className="approach-item wow fadeInUp" data-wow-delay="0.2s">
                  <div className="icon-box">
                    <img src="/images/icon-approach-2.svg" alt="" />
                  </div>
                  <div className="approach-item-content">
                    <h3>Our vision</h3>
                    <p>Our vision is to harness the power of AI to solve real-world problems. From automating tasks to delivering data-driven insights.</p>
                  </div>
                </div>
                {/* Approach Item End */}

                {/* Approach Item Start */}
                <div className="approach-item wow fadeInUp" data-wow-delay="0.4s">
                  <div className="icon-box">
                    <img src="/images/icon-approach-3.svg" alt="" />
                  </div>
                  <div className="approach-item-content">
                    <h3>Our goal</h3>
                    <p>Our goal is to harness the power of AI to solve real-world problems. From automating tasks to delivering data-driven insights.</p>
                  </div>
                </div>
                {/* Approach Item End */}
              </div>
              {/* Approach Item List End */}
            </div>

            <div className="col-lg-6">
              {/* Approach Image Start */}
              <div className="approach-image">
                <figure className="image-anime reveal">
                  <img src="/images/approach-image.jpg" alt="" />
                </figure>

                {/* Approach Counter Box Start */}
                <div className="approach-counter-box">
                  {/* Approach Counter Item Start */}
                  <div className="approach-counter-item">
                    <h2><span className="counter">15</span>+</h2>
                    <p>Business problem</p>
                  </div>
                  {/* Approach Counter Item End */}

                  {/* Approach Counter Item Start */}
                  <div className="approach-counter-item">
                    <h2><span className="counter">2.3</span>+</h2>
                    <p>Business setup</p>
                  </div>
                  {/* Approach Counter Item End */}
                </div>
                {/* Approach Counter Box End */}
              </div>
              {/* Approach Image End */}
            </div>
          </div>
        </div>
      </div>
      {/* Our Approach Section End */}

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

      {/* Our Solution Section Start */}
      <div className="our-solution">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              {/* Our Solution Content Start */}
              <div className="our-solution-content">
                {/* Section Title Start */}
                <div className="section-title">
                  <h3 className="wow fadeInUp">all in one solution</h3>
                  <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">Delivering real-world impact <span>solution</span></h2>
                  <p className="wow fadeInUp" data-wow-delay="0.4s">We envision a world where artificial intelligence transforms lives, industries, and possibilities. Our goal is to lead this evolution by creating intuitive, ethical.</p>
                </div>
                {/* Section Title End */}
              </div>
              {/* Our Solution Content ENd */}
            </div>

            <div className="col-lg-7">
              {/* Solution Item List Start */}
              <div className="solution-item-list">
                {/* Solution Item Start */}
                <div className="solution-item wow fadeInUp">
                  <div className="icon-box">
                    <img src="/images/icon-solution-1.svg" alt="" />
                  </div>
                  <div className="solution-item-content">
                    <h3>Custom AI Development</h3>
                    <p>We dive deep into your goals challenges to uncover high-impact AI opportunities.</p>
                  </div>
                </div>
                {/* Solution Item End */}

                {/* Solution Item Start */}
                <div className="solution-item wow fadeInUp" data-wow-delay="0.2s">
                  <div className="icon-box">
                    <img src="/images/icon-solution-2.svg" alt="" />
                  </div>
                  <div className="solution-item-content">
                    <h3>Custom AI Solutions</h3>
                    <p>We dive deep into your goals challenges to uncover high-impact AI opportunities.</p>
                  </div>
                </div>
                {/* Solution Item End */}

                {/* Solution Item Start */}
                <div className="solution-item wow fadeInUp" data-wow-delay="0.4s">
                  <div className="icon-box">
                    <img src="/images/icon-solution-3.svg" alt="" />
                  </div>
                  <div className="solution-item-content">
                    <h3>Automated Intelligence</h3>
                    <p>We dive deep into your goals challenges to uncover high-impact AI opportunities.</p>
                  </div>
                </div>
                {/* Solution Item End */}

                {/* Solution Item Start */}
                <div className="solution-item wow fadeInUp" data-wow-delay="0.6s">
                  <div className="icon-box">
                    <img src="/images/icon-solution-4.svg" alt="" />
                  </div>
                  <div className="solution-item-content">
                    <h3>Scalable Infrastructure</h3>
                    <p>We dive deep into your goals challenges to uncover high-impact AI opportunities.</p>
                  </div>
                </div>
                {/* Solution Item End */}
              </div>
              {/* Solution Item List End */}
            </div>
          </div>
        </div>
      </div>
      {/* Our Solution Section End */}

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

      {/* Our Team Section Start */}
      <div className="our-team">
        <div className="container">
          <div className="row section-row align-items-center">
            <div className="col-lg-12">
              {/* Section Title Start */}
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">our team</h3>
                <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">The human intelligence powering <span>our AI</span></h2>
              </div>
              {/* Section Title End */}
            </div>
          </div>

          <div className="row">
            {displayMembers.map((member, index) => (
              <div className="col-lg-3 col-md-6" key={member.id}>
                {/* Team Member Item Start */}
                <div className="team-item wow fadeInUp" data-wow-delay={index > 0 ? `${(index * 0.2).toFixed(1)}s` : undefined}>
                  {/* team Image Start */}
                  <div className="team-image">
                    <Link to="/team" className="image-anime" data-cursor-text="View">
                      <figure>
                        <img src={member.image || `/images/team-${index + 1}.jpg`} alt={member.name} />
                      </figure>
                    </Link>
                  </div>
                  {/* team Image End */}

                  {/* Team Body Start */}
                  <div className="team-body">
                    {/* Team Content Start */}
                    <div className="team-content">
                      <h3><Link to="/team">{member.name}</Link></h3>
                      <p>{member.role}</p>
                    </div>
                    {/* Team Content End */}

                    {/* Team Social List Start */}
                    <div className="team-social-list">
                      <ul>
                        <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                        <li><a href="#"><i className="fa-brands fa-pinterest-p"></i></a></li>
                      </ul>
                    </div>
                    {/* Team Social List End */}
                  </div>
                  {/* Team Body End */}
                </div>
                {/* Team Member Item End */}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Our Team Section End */}

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
                      {displayMembers.slice(0, 3).map((member, index) => (
                        <div className="swiper-slide" key={member.id}>
                          <div className="testimonial-item">
                            <div className="testimonial-header">
                              <div className="testimonial-author">
                                <div className="author-image">
                                  <figure className="image-anime">
                                    <img src={member.image || `/images/author-${index + 1}.jpg`} alt={member.name} />
                                  </figure>
                                </div>
                                <div className="author-content">
                                  <h3>{member.name}</h3>
                                  <p>{member.role || 'fintech startup'}</p>
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
