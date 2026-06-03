import { Link, useLoaderData } from 'react-router'
import { cmsService } from '~/services/httpServices/cmsService'
import { useFaqs } from '~/services/httpServices/queries'
import type { SeoSettings } from '~/types/cms'

export async function loader() {
  try {
    const [faqsRes, seoRes] = await Promise.all([
      cmsService.getFaqs(),
      cmsService.getSeoSettings('faqs'),
    ])
    return { faqs: faqsRes.data, seo: seoRes.data }
  } catch (error) {
    console.error('Failed to load FAQs', error)
    return { faqs: [], seo: null }
  }
}

export function meta({ data }: { data: { seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || 'FAQs | Cofixer' },
    { name: 'description', content: seo?.metaDescription || 'Frequently asked questions' },
  ]
}

export default function FaqsPage() {
  const { faqs: initialFaqs } = useLoaderData<typeof loader>()
  const { data: faqs } = useFaqs({
    initialData: initialFaqs,
  })

  return (
    <>
      {/* Page Header Start */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              {/* Page Header Box Start */}
              <div className="page-header-box">
                <h1 className="wow fadeInUp" data-cursor="-opaque">Frequently asked <span>question</span></h1>
                <nav className="wow fadeInUp" data-wow-delay="0.2s">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">FAQs</li>
                  </ol>
                </nav>
              </div>
              {/* Page Header Box End */}
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      {/* Page Faqs Start */}
      <div className="page-faqs">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              {/* Page Single Sidebar Start */}
              <div className="page-single-sidebar">
                {/* Page Category List Start */}
                <div className="page-catagery-list wow fadeInUp">
                   <ul>
                    <li><a href="#faq_1">AI Products & Solutions</a></li>
                    <li><a href="#faq_2">Integration & Deployment</a></li>
                    <li><a href="#faq_3">Technical Support</a></li>
                    <li><a href="#faq_4">Pricing & Plans</a></li>
                  </ul>
                </div>
                {/* Page Category List End */}

                {/* Sidebar CTA Box Start */}
                <div className="sidebar-cta-box">
                  {/* Sidebar CTA Logo Start */}
                  <div className="sidebar-cta-logo">
                    <img src="/images/sidebar-cta-logo.svg" alt="" />
                  </div>
                  {/* Sidebar CTA Logo End */}

                  {/* Sidebar CTA Content Start */}
                  <div className="sidebar-cta-content">
                    <h3>We're here to help!</h3>
                    <p>Have questions about our AI products or services? Our team is ready to assist you with product demos, custom solutions, and technical support.</p>
                  </div>
                  {/* Sidebar CTA Content End */}

                  <div className="sidebar-cta-contact">
                    <ul>
                      <li><a href="tel:+1234567890"><img src="/images/icon-phone-gradiant.svg" alt="" />+1 (234) 567-890</a></li>
                      <li><a href="mailto:hello@cofixer.com"><img src="/images/icon-mail-gradiant.svg" alt="" />hello@cofixer.com</a></li>
                    </ul>
                  </div>
                </div>
                {/* Sidebar CTA Box End */}
              </div>
              {/* Page Single Sidebar End */}
            </div>

            <div className="col-lg-8">
              {/* Page FAQs Catagery Start */}
              <div className="page-faqs-catagery">
                {/* FAQs section start */}
                <div className="page-single-faqs page-faq-accordion" id="faq_1">
                   <div className="section-title">
                     <h2 className="wow fadeInUp" data-cursor="-opaque">AI Products & <span>Solutions</span></h2>
                   </div>
                  {/* FAQ Accordion Start */}
                  <div className="faq-accordion" id="accordion">
                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.2s">
                      <h2 className="accordion-header" id="heading1">
                       <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
                           1. What AI products and services do you offer?
                         </button>
                      </h2>
                      <div id="collapse1" className="accordion-collapse collapse" aria-labelledby="heading1" data-bs-parent="#accordion">
                        <div className="accordion-body">
                           <p>Our primary focus is AI-powered SaaS products including workflow automation platforms and autonomous AI agents. Our secondary services include custom AI development, software development, system architecture, workflow automation, and infrastructure optimization for startups and enterprises.</p>
                         </div>
                       </div>
                     </div>
                     {/* FAQ Item End */}
 
                     {/* FAQ Item Start */}
                     <div className="accordion-item wow fadeInUp" data-wow-delay="0.4s">
                       <h2 className="accordion-header" id="heading2">
                         <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                           2. How can AI automation benefit my business?
                         </button>
                       </h2>
                       <div id="collapse2" className="accordion-collapse collapse show" aria-labelledby="heading2" data-bs-parent="#accordion">
                         <div className="accordion-body">
                           <p>AI automation reduces manual work, cuts operational costs, improves accuracy, and accelerates digital transformation. Our SaaS products handle repetitive tasks 24/7, while our custom solutions address your unique challenges.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.6s">
                      <h2 className="accordion-header" id="heading3">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
                           3. Are your AI products customizable to specific business needs?
                         </button>
                       </h2>
                       <div id="collapse3" className="accordion-collapse collapse" aria-labelledby="heading3" data-bs-parent="#accordion">
                         <div className="accordion-body">
                           <p>Yes. Our SaaS products offer configurable workflows and settings to match your processes. For unique requirements, our custom AI and software development services create tailored solutions from scratch.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.8s">
                      <h2 className="accordion-header" id="heading4">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
                           4. How long does it take to implement your AI products?
                         </button>
                       </h2>
                       <div id="collapse4" className="accordion-collapse collapse" aria-labelledby="heading4" data-bs-parent="#accordion">
                         <div className="accordion-body">
                           <p>Our SaaS products are available immediately upon subscription. For custom AI and software development projects, timelines typically range from 4 to 12 weeks depending on complexity, with a clear roadmap provided during discovery.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="1s">
                      <h2 className="accordion-header" id="heading5">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="false" aria-controls="collapse5">
                           5. Is technical expertise required to use your AI products?
                         </button>
                       </h2>
                       <div id="collapse5" className="accordion-collapse collapse" aria-labelledby="heading5" data-bs-parent="#accordion">
                         <div className="accordion-body">
                           <p>No. Our SaaS products are designed for business users with intuitive interfaces and minimal learning curves. We provide comprehensive onboarding, documentation, and support. For custom solutions, we handle all technical complexity.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}
                  </div>
                  {/* FAQ Accordion End */}
                </div>
                {/* FAQs section End */}

                {/* FAQs section start */}
                <div className="page-single-faqs page-faq-accordion" id="faq_2">
                  <div className="section-title">
                    <h2 className="wow fadeInUp" data-cursor="-opaque">Integration & <span>deployment</span></h2>
                  </div>
                  {/* FAQ Accordion Start */}
                  <div className="faq-accordion" id="accordion1">
                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.2s">
                      <h2 className="accordion-header" id="heading6">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse6" aria-expanded="true" aria-controls="collapse6">
                           1. What is the process for integrating your AI products into existing systems?
                         </button>
                       </h2>
                       <div id="collapse6" className="accordion-collapse collapse show" aria-labelledby="heading6" data-bs-parent="#accordion1">
                         <div className="accordion-body">
                           <p>We start with a technical assessment of your current stack, then design an integration plan using APIs, webhooks, or middleware. Our SaaS products support standard protocols and popular platforms. We ensure minimal disruption during deployment.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.4s">
                      <h2 className="accordion-header" id="heading7">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse7" aria-expanded="false" aria-controls="collapse7">
                           2. How long does deployment typically take?
                         </button>
                       </h2>
                       <div id="collapse7" className="accordion-collapse collapse" aria-labelledby="heading7" data-bs-parent="#accordion1">
                         <div className="accordion-body">
                           <p>SaaS product setup takes minutes to hours. Custom solution deployment ranges from days to weeks depending on integration complexity. We use phased rollouts to minimize risk and ensure smooth transitions.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.6s">
                      <h2 className="accordion-header" id="heading8">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse8" aria-expanded="false" aria-controls="collapse8">
                           3. Will there be any downtime during integration and deployment?
                         </button>
                       </h2>
                       <div id="collapse8" className="accordion-collapse collapse" aria-labelledby="heading8" data-bs-parent="#accordion1">
                         <div className="accordion-body">
                           <p>We design deployments to minimize or eliminate downtime. For critical systems, we use parallel deployment, blue-green strategies, or scheduled maintenance windows. SaaS products require zero downtime for your existing systems.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.8s">
                      <h2 className="accordion-header" id="heading9">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse9" aria-expanded="false" aria-controls="collapse9">
                           4. Can your AI products scale as our business grows?
                         </button>
                       </h2>
                       <div id="collapse9" className="accordion-collapse collapse" aria-labelledby="heading9" data-bs-parent="#accordion1">
                         <div className="accordion-body">
                           <p>Absolutely. Our SaaS products run on cloud infrastructure that auto-scales with your usage. Custom solutions are built with scalability in mind, allowing you to add capacity, features, or integrations as you grow without rebuilding.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="1s">
                      <h2 className="accordion-header" id="heading10">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse10" aria-expanded="false" aria-controls="collapse10">
                           5. Do you provide support after integration and deployment?
                         </button>
                       </h2>
                       <div id="collapse10" className="accordion-collapse collapse show" aria-labelledby="heading10" data-bs-parent="#accordion1">
                         <div className="accordion-body">
                           <p>Yes. We offer ongoing technical support, product updates, and optimization services. SaaS customers get automatic updates and priority support. Custom project clients receive maintenance packages tailored to their needs.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}
                  </div>
                  {/* FAQ Accordion End */}
                </div>
                {/* FAQs section End */}

                {/* FAQs section start */}
                <div className="page-single-faqs page-faq-accordion" id="faq_3">
                  <div className="section-title">
                    <h2 className="wow fadeInUp" data-cursor="-opaque">Technical <span>support</span></h2>
                  </div>
                  {/* FAQ Accordion Start */}
                  <div className="faq-accordion" id="accordion2">
                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.2s">
                      <h2 className="accordion-header" id="heading11">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse11" aria-expanded="true" aria-controls="collapse11">
                           1. What kind of technical support do you offer?
                         </button>
                       </h2>
                       <div id="collapse11" className="accordion-collapse collapse" aria-labelledby="heading11" data-bs-parent="#accordion2">
                         <div className="accordion-body">
                           <p>We offer multiple support channels including email, chat, and video calls. SaaS customers get access to documentation, tutorials, and community forums. Enterprise clients receive dedicated account managers and 24/7 priority support.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.4s">
                      <h2 className="accordion-header" id="heading12">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse12" aria-expanded="false" aria-controls="collapse12">
                           2. How quickly can I expect a response to a technical issue?
                         </button>
                       </h2>
                       <div id="collapse12" className="accordion-collapse collapse" aria-labelledby="heading12" data-bs-parent="#accordion2">
                         <div className="accordion-body">
                           <p>Standard support responds within 24 hours on business days. Priority and enterprise support offer response times of 4 hours or less. Critical issues are addressed immediately regardless of plan.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.6s">
                      <h2 className="accordion-header" id="heading13">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse13" aria-expanded="false" aria-controls="collapse13">
                           3. Do you offer remote assistance for technical problems?
                         </button>
                       </h2>
                       <div id="collapse13" className="accordion-collapse collapse" aria-labelledby="heading13" data-bs-parent="#accordion2">
                         <div className="accordion-body">
                           <p>Yes. Our support team can access your systems remotely with permission to diagnose and resolve issues. We also offer video conferencing for hands-on guidance, training sessions, and troubleshooting.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.8s">
                      <h2 className="accordion-header" id="heading14">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse14" aria-expanded="false" aria-controls="collapse14">
                           4. What happens if a system update causes a technical problem?
                         </button>
                       </h2>
                       <div id="collapse14" className="accordion-collapse collapse show" aria-labelledby="heading14" data-bs-parent="#accordion2">
                         <div className="accordion-body">
                           <p>We thoroughly test all updates in staging environments before production deployment. If issues occur, our rollback procedures restore service within minutes. We monitor all deployments and proactively address any anomalies.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="1s">
                      <h2 className="accordion-header" id="heading15">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse15" aria-expanded="false" aria-controls="collapse15">
                           5. Is there a dedicated account manager or support specialist assigned?
                         </button>
                       </h2>
                       <div id="collapse15" className="accordion-collapse collapse" aria-labelledby="heading15" data-bs-parent="#accordion2">
                         <div className="accordion-body">
                           <p>Enterprise and custom project clients receive a dedicated account manager. SaaS customers on professional and business plans get priority support specialists. All customers have access to our comprehensive knowledge base and community.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}
                  </div>
                  {/* FAQ Accordion End */}
                </div>
                {/* FAQs section End */}

                {/* FAQs section start */}
                <div className="page-single-faqs page-faq-accordion" id="faq_4">
                  <div className="section-title">
                    <h2 className="wow fadeInUp" data-cursor="-opaque">Pricing & <span>plans</span></h2>
                  </div>
                  {/* FAQ Accordion Start */}
                  <div className="faq-accordion" id="accordion3">
                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.2s">
                      <h2 className="accordion-header" id="heading16">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse16" aria-expanded="false" aria-controls="collapse16">
                           1. How is your SaaS product pricing structured?
                         </button>
                       </h2>
                       <div id="collapse16" className="accordion-collapse collapse" aria-labelledby="heading16" data-bs-parent="#accordion3">
                         <div className="accordion-body">
                           <p>Our SaaS products use tiered subscription pricing based on usage volume, number of users, and features needed. We offer Starter, Professional, and Business plans with monthly and annual billing options. Annual plans include a discount.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.4s">
                      <h2 className="accordion-header" id="heading17">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse17" aria-expanded="false" aria-controls="collapse17">
                           2. How do you price custom AI and software development services?
                         </button>
                       </h2>
                       <div id="collapse17" className="accordion-collapse collapse" aria-labelledby="heading17" data-bs-parent="#accordion3">
                         <div className="accordion-body">
                           <p>Custom projects are priced based on scope, complexity, and timeline. We provide detailed estimates after the discovery phase. Options include fixed-price contracts for well-defined scopes or time-and-materials for evolving requirements.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.6s">
                      <h2 className="accordion-header" id="heading18">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse18" aria-expanded="false" aria-controls="collapse18">
                           3. Is there a free trial available?
                         </button>
                       </h2>
                       <div id="collapse18" className="accordion-collapse collapse" aria-labelledby="heading18" data-bs-parent="#accordion3">
                         <div className="accordion-body">
                           <p>Yes. Most SaaS products include a 14-day free trial with full feature access. No credit card required. For custom services, we offer a discovery consultation to assess your needs before any commitment.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.8s">
                      <h2 className="accordion-header" id="heading19">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse19" aria-expanded="false" aria-controls="collapse19">
                           4. What happens if we outgrow our current plan?
                         </button>
                       </h2>
                       <div id="collapse19" className="accordion-collapse collapse" aria-labelledby="heading19" data-bs-parent="#accordion3">
                         <div className="accordion-body">
                           <p>You can upgrade your plan anytime with prorated billing. Our team can help you choose the right tier based on your growth trajectory. For businesses with unique needs, we also offer custom enterprise agreements.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="1s">
                      <h2 className="accordion-header" id="heading20">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse20" aria-expanded="false" aria-controls="collapse20">
                           5. Do you provide support after integration and deployment?
                         </button>
                       </h2>
                       <div id="collapse20" className="accordion-collapse collapse" aria-labelledby="heading20" data-bs-parent="#accordion3">
                         <div className="accordion-body">
                           <p>Yes. All plans include ongoing support. SaaS subscriptions include automatic updates, bug fixes, and feature enhancements. Custom project clients can opt for maintenance retainers or ad-hoc support as needed.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}
                  </div>
                  {/* FAQ Accordion End */}
                </div>
                {/* FAQs section End */}
              </div>
              {/* Page FAQs Catagery End */}
            </div>
          </div>
        </div>
      </div>
      {/* Page Faqs End */}
    </>
  )
}
