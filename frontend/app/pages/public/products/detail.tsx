import { Link, useParams, useLoaderData } from 'react-router'
import { EmptyState } from '~/components/ui/empty-state'
import { cmsService } from '~/services/httpServices/cmsService'
import { useProject } from '~/services/httpServices/queries'
import type { Project, SeoSettings } from '~/types/cms'

export async function loader({ params }: { params: { slug: string } }) {
  try {
    const [projectRes, seoRes] = await Promise.all([
      cmsService.getProject(params.slug),
      cmsService.getSeoSettings(`projects/${params.slug}`),
    ])
    return { project: projectRes.data, seo: seoRes.data }
  } catch (error) {
    console.error('Failed to load product', error)
    return { project: null, seo: null }
  }
}

export function meta({ data }: { data: { project?: Project; seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || `${data?.project?.title || 'Product'} | Cofixer` },
    { name: 'description', content: seo?.metaDescription || data?.project?.summary || '' },
  ]
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { project: initialProject } = useLoaderData<typeof loader>()
  const { data: project, error } = useProject(slug || '', {
    initialData: initialProject ?? undefined,
  })

  if (error || !project) {
    return (
      <div className="page-service-single">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <EmptyState
                title="Product Not Found"
                description="The product you are looking for does not exist."
                action={
                  <Link to="/products" className="btn-default">
                    ← Back to Products
                  </Link>
                }
              />
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
              <div className="page-header-box">
                <h1 className="wow fadeInUp" data-cursor="-opaque">
                  {project.title.split(' ').slice(0, -1).join(' ')}{' '}
                  <span>{project.title.split(' ').slice(-1)}</span>
                </h1>
                <nav className="wow fadeInUp" data-wow-delay="0.2s">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">home</Link></li>
                    <li className="breadcrumb-item"><Link to="/products">products</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{project.title}</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      {/* Page Service Single Start */}
      <div className="page-service-single">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              {/* Page Single Sidebar Start */}
              <div className="page-single-sidebar">
                {/* Page Category List Start */}
                <div className="page-catagery-list wow fadeInUp">
                  <h3>What We Offer</h3>
                  <ul>
                    <li><Link to="/services">AI Strategy & Consulting</Link></li>
                    <li><Link to="/services">AI Integration & Deployment</Link></li>
                    <li><Link to="/services">Custom AI Solutions</Link></li>
                    <li><Link to="/services">Data-Driven Insights</Link></li>
                    <li><Link to="/services">Intelligent Data Solutions</Link></li>
                  </ul>
                </div>
                {/* Page Category List End */}

                {/* Sidebar CTA Box Start */}
                <div className="sidebar-cta-box">
                  <div className="sidebar-cta-logo">
                    <img src="/images/sidebar-cta-logo.svg" alt="" />
                  </div>
                  <div className="sidebar-cta-content">
                    <h3>We're here to help!</h3>
                    <p>Need assistance? We're here to help with support, guidance, and resources. Reach out to us anytime.</p>
                  </div>
                  <div className="sidebar-cta-contact">
                    <ul>
                      <li><Link to="/contact"><img src="/images/icon-phone-gradiant.svg" alt="" />Contact Us</Link></li>
                      <li><Link to="/contact"><img src="/images/icon-mail-gradiant.svg" alt="" />Get Support</Link></li>
                    </ul>
                  </div>
                </div>
                {/* Sidebar CTA Box End */}
              </div>
              {/* Page Single Sidebar End */}
            </div>

            <div className="col-lg-8">
              {/* Service Single Content Start */}
              <div className="service-single-content">
                {/* Page Single Image Start */}
                {project.featuredImage && (
                  <div className="page-single-image">
                    <figure className="image-anime reveal">
                      <img src={project.featuredImage} alt={project.title} />
                    </figure>
                  </div>
                )}
                {/* Page Single Image End */}

                {/* Service Entry Start */}
                <div className="service-entry">
                  {project.summary && (
                    <p className="wow fadeInUp">{project.summary}</p>
                  )}
                  {project.description && (
                    <p className="wow fadeInUp" data-wow-delay="0.2s">{project.description}</p>
                  )}
                  {project.clientName && (
                    <div className="service-solution-box wow fadeInUp" data-wow-delay="0.4s">
                      <h2>Client <span>Details</span></h2>
                      <p><strong>Client:</strong> {project.clientName}</p>
                      {project.category && (
                        <p><strong>Category:</strong> {project.category}</p>
                      )}
                    </div>
                  )}
                </div>
                {/* Service Entry End */}

                {/* Project Gallery Start */}
                {project.images && project.images.length > 0 && (
                  <div className="building-smarter-box wow fadeInUp" data-wow-delay="0.2s">
                    <h2>Project <span>Gallery</span></h2>
                    <div className="building-steps-image">
                      <div className="building-smarter-steps">
                        {project.images.map((img, idx) => (
                          <div className="building-step-item wow fadeInUp" data-wow-delay={`${0.2 + idx * 0.2}s`} key={idx}>
                            <div className="building-step-no">
                              <h2>{String(idx + 1).padStart(2, '0')}</h2>
                            </div>
                            <div className="building-step-content">
                              <figure className="image-anime reveal">
                                <img src={img} alt={`${project.title} - ${idx + 1}`} />
                              </figure>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {/* Project Gallery End */}
              </div>
              {/* Service Single Content End */}
            </div>
          </div>
        </div>
      </div>
      {/* Page Service Single End */}
    </>
  )
}
