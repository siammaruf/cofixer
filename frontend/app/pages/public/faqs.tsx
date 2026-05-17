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
                    <li><a href="#faq_1">AI Solutions</a></li>
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
                    <h3>We're here help!</h3>
                    <p>Need assistance? We're here to help with support, guidance, and resources. Reach out to us anytime.</p>
                  </div>
                  {/* Sidebar CTA Content End */}

                  <div className="sidebar-cta-contact">
                    <ul>
                      <li><a href="tel:152885253"><img src="/images/icon-phone-gradiant.svg" alt="" />+(00) - 152 885 253</a></li>
                      <li><a href="mailto:support@domainname.com"><img src="/images/icon-mail-gradiant.svg" alt="" />support@domainname.com</a></li>
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
                    <h2 className="wow fadeInUp" data-cursor="-opaque">AI <span>solutions</span></h2>
                  </div>
                  {/* FAQ Accordion Start */}
                  <div className="faq-accordion" id="accordion">
                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.2s">
                      <h2 className="accordion-header" id="heading1">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
                          1. What types of AI solutions do you offer?
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
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.4s">
                      <h2 className="accordion-header" id="heading2">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                          2. How can AI solutions benefit my business?
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
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.6s">
                      <h2 className="accordion-header" id="heading3">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
                          3. Are your AI solutions customizable to specific business needs?
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
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.8s">
                      <h2 className="accordion-header" id="heading4">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
                          4. How long does it take to implement an AI solution?
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
                    <div className="accordion-item wow fadeInUp" data-wow-delay="1s">
                      <h2 className="accordion-header" id="heading5">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="false" aria-controls="collapse5">
                          5. Is technical expertise required to manage your AI solutions?
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
                          1. What is the process for integrating AI solutions into existing systems?
                        </button>
                      </h2>
                      <div id="collapse6" className="accordion-collapse collapse show" aria-labelledby="heading6" data-bs-parent="#accordion1">
                        <div className="accordion-body">
                          <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.4s">
                      <h2 className="accordion-header" id="heading7">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse7" aria-expanded="false" aria-controls="collapse7">
                          2. How long does the deployment of an AI solution typically take?
                        </button>
                      </h2>
                      <div id="collapse7" className="accordion-collapse collapse" aria-labelledby="heading7" data-bs-parent="#accordion1">
                        <div className="accordion-body">
                          <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
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
                          <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.8s">
                      <h2 className="accordion-header" id="heading9">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse9" aria-expanded="false" aria-controls="collapse9">
                          4. Can your AI solutions scale as our business grows?
                        </button>
                      </h2>
                      <div id="collapse9" className="accordion-collapse collapse" aria-labelledby="heading9" data-bs-parent="#accordion1">
                        <div className="accordion-body">
                          <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
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
                          <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
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
                          1. What kind of technical support do you offer for AI solutions?
                        </button>
                      </h2>
                      <div id="collapse11" className="accordion-collapse collapse" aria-labelledby="heading11" data-bs-parent="#accordion2">
                        <div className="accordion-body">
                          <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
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
                          <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
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
                          <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.8s">
                      <h2 className="accordion-header" id="heading14">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse14" aria-expanded="false" aria-controls="collapse14">
                          4. What happens if an AI system update causes a technical problem?
                        </button>
                      </h2>
                      <div id="collapse14" className="accordion-collapse collapse show" aria-labelledby="heading14" data-bs-parent="#accordion2">
                        <div className="accordion-body">
                          <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
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
                          <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
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
                          1. What is the process for integrating AI solutions into existing systems?
                        </button>
                      </h2>
                      <div id="collapse16" className="accordion-collapse collapse" aria-labelledby="heading16" data-bs-parent="#accordion3">
                        <div className="accordion-body">
                          <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.4s">
                      <h2 className="accordion-header" id="heading17">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse17" aria-expanded="false" aria-controls="collapse17">
                          2. How long does the deployment of an AI solution typically take?
                        </button>
                      </h2>
                      <div id="collapse17" className="accordion-collapse collapse" aria-labelledby="heading17" data-bs-parent="#accordion3">
                        <div className="accordion-body">
                          <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.6s">
                      <h2 className="accordion-header" id="heading18">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse18" aria-expanded="false" aria-controls="collapse18">
                          3. Will there be any downtime during integration and deployment?
                        </button>
                      </h2>
                      <div id="collapse18" className="accordion-collapse collapse" aria-labelledby="heading18" data-bs-parent="#accordion3">
                        <div className="accordion-body">
                          <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
                        </div>
                      </div>
                    </div>
                    {/* FAQ Item End */}

                    {/* FAQ Item Start */}
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.8s">
                      <h2 className="accordion-header" id="heading19">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse19" aria-expanded="false" aria-controls="collapse19">
                          4. Can your AI solutions scale as our business grows?
                        </button>
                      </h2>
                      <div id="collapse19" className="accordion-collapse collapse" aria-labelledby="heading19" data-bs-parent="#accordion3">
                        <div className="accordion-body">
                          <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
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
                          <p>Project timelines vary depending on complexity but typically range from 4 to 12 weeks. We provide a clear roadmap during the discovery phase.</p>
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
