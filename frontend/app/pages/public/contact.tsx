import { Link, useLoaderData } from 'react-router'
import { useState } from 'react'
import { getErrorMessage } from '~/utils/errorHandler'
import { cmsService } from '~/services/httpServices/cmsService'
import { useSubmitContact } from '~/services/httpServices/queries'
import type { SeoSettings } from '~/types/cms'

export async function loader() {
  try {
    const seoRes = await cmsService.getSeoSettings('contact')
    return { seo: seoRes.data }
  } catch (error) {
    console.error('Failed to load SEO settings', error)
    return { seo: null }
  }
}

export function meta({ data }: { data: { seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || 'Contact Us | Cofixer' },
    { name: 'description', content: seo?.metaDescription || 'Get in touch with our team' },
  ]
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    phone: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitContact = useSubmitContact()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await submitContact.mutateAsync({
        name: `${formData.fname} ${formData.lname}`,
        email: formData.email,
        phone: formData.phone,
        subject: 'Contact Form',
        message: formData.message,
      })
      setSubmitted(true)
      setFormData({ fname: '', lname: '', phone: '', email: '', message: '' })
    } catch (err) {
      setError(
        getErrorMessage(err) ||
          'Failed to submit contact form. Please try again.'
      )
    }
  }

  if (submitted) {
    return (
      <div className="page-contact-us">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="conatct-us-form">
                <div className="section-title">
                  <h2>Thank you!</h2>
                  <p>Your message has been submitted successfully.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Page Header Start */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              {/* Page Header Box Start */}
              <div className="page-header-box">
                <h1 className="wow fadeInUp" data-cursor="-opaque">Contact <span>us</span></h1>
                <nav className="wow fadeInUp" data-wow-delay="0.2s">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">contact us</li>
                  </ol>
                </nav>
              </div>
              {/* Page Header Box End */}
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      {/* Page Contact Us Start */}
      <div className="page-contact-us">
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              {/* Section Title Start */}
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">get in touch</h3>
                <h2 className="wow fadeInUp" data-wow-delay="0.2s" data-cursor="-opaque">Let's Collaborate and Create Powerful <span>AI Solutions</span></h2>
              </div>
              {/* Section Title End */}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              {/* Contact Us Form Start */}
              <div className="conatct-us-form">
                {/* Contact Form Start */}
                <div className="contact-form">
                  {/* Section Title Start */}
                  <div className="section-title">
                    <h2 className="wow fadeInUp" data-cursor="-opaque">Have any questions?</h2>
                  </div>
                  {/* Section Title End */}

                  {/* Contact Form Start */}
                  <form id="contactForm" onSubmit={handleSubmit} className="wow fadeInUp" data-wow-delay="0.2s">
                    <div className="row">
                      <div className="form-group col-md-6 mb-4">
                        <input type="text" name="fname" className="form-control" id="fname" placeholder="First Name" required
                          value={formData.fname} onChange={(e) => setFormData({ ...formData, fname: e.target.value })} />
                        <div className="help-block with-errors"></div>
                      </div>

                      <div className="form-group col-md-6 mb-4">
                        <input type="text" name="lname" className="form-control" id="lname" placeholder="Last Name" required
                          value={formData.lname} onChange={(e) => setFormData({ ...formData, lname: e.target.value })} />
                        <div className="help-block with-errors"></div>
                      </div>

                      <div className="form-group col-md-6 mb-4">
                        <input type="text" name="phone" className="form-control" id="phone" placeholder="Phone No." required
                          value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        <div className="help-block with-errors"></div>
                      </div>

                      <div className="form-group col-md-6 mb-4">
                        <input type="email" name="email" className="form-control" id="email" placeholder="Email Address" required
                          value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        <div className="help-block with-errors"></div>
                      </div>

                      <div className="form-group col-md-12 mb-5">
                        <textarea name="message" className="form-control" id="message" rows={4} placeholder="Write Message..."
                          value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}></textarea>
                        <div className="help-block with-errors"></div>
                      </div>

                      <div className="col-lg-12">
                        <div className="contact-form-btn">
                          <button type="submit" className="btn-default"><span>submit now</span></button>
                          <div id="msgSubmit" className="h3 hidden"></div>
                        </div>
                      </div>
                    </div>
                  </form>
                  {/* Contact Form End */}
                </div>
                {/* Contact Form End */}

                {/* Google Map Iframe Start */}
                <div className="google-map-iframe">
                  <iframe src="https://maps.google.com/maps?q=42+Bloomfield+House,+Old+Montague+Street,+London+E1+5PA,+UK&output=embed&iwloc=near" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
                {/* Google Map Iframe End */}
              </div>
              {/* Contact Us Form End */}
            </div>

            <div className="col-lg-12">
              {/* Contact Info List Start */}
              <div className="contact-info-list">
                {/* Contact Info Item Start (Phone hidden) */}
                {/*
                <div className="contact-info-item wow fadeInUp">
                  <div className="icon-box">
                    <img src="/images/icon-phone.svg" alt="" />
                  </div>
                  <div className="contact-info-content">
                    <h3>contact us</h3>
                    <p><a href="tel:+123254963">(+00) 123-254-963</a></p>
                    <p><a href="tel:+761852339">(+12) 761 852 339</a></p>
                  </div>
                </div>
                */}
                {/* Contact Info Item End */}

                {/* Contact Info Item Start */}
                <div className="contact-info-item wow fadeInUp" data-wow-delay="0.2s">
                  <div className="icon-box">
                    <img src="/images/icon-mail.svg" alt="" />
                  </div>
                  <div className="contact-info-content">
                    <h3>email us</h3>
                    <p><a href="mailto:support@cofixer.com">support@cofixer.com</a></p>
                  </div>
                </div>
                {/* Contact Info Item End */}

                {/* Contact Info Item Start */}
                <div className="contact-info-item wow fadeInUp" data-wow-delay="0.4s">
                  <div className="icon-box">
                    <img src="/images/icon-clock.svg" alt="" />
                  </div>
                  <div className="contact-info-content">
                    <h3>Working hours</h3>
                    <p>Mon - Fri : 08AM -  10PM</p>
                    <p>sat - sun : close</p>
                  </div>
                </div>
                {/* Contact Info Item End */}

                {/* Contact Info Item Start */}
                <div className="contact-info-item wow fadeInUp" data-wow-delay="0.6s">
                  <div className="icon-box">
                    <img src="/images/icon-location.svg" alt="" />
                  </div>
                  <div className="contact-info-content">
                    <h3>location</h3>
                    <p>42 Bloomfield House, Old Montague Street, London E1 5PA, UK</p>
                    <p>42 Bloomfield House, Old Montague Street, London E1 5PA, UK</p>
                  </div>
                </div>
                {/* Contact Info Item End */}
              </div>
              {/* Contact Info List Start */}
            </div>
          </div>
        </div>
      </div>
      {/* Page Contact Us End */}
    </>
  )
}
