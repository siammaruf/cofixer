import { Link, useLoaderData } from 'react-router'
import { cmsService } from '~/services/httpServices/cmsService'
import { useProjects } from '~/services/httpServices/queries'
import type { SeoSettings } from '~/types/cms'

export async function loader() {
  try {
    const [projectsRes, seoRes] = await Promise.all([
      cmsService.getProjects(),
      cmsService.getSeoSettings('projects'),
    ])
    return { projects: projectsRes.data, seo: seoRes.data }
  } catch (error) {
    console.error('Failed to load projects', error)
    return { projects: [], seo: null }
  }
}

export function meta({ data }: { data: { seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || 'Our Projects | Cofixer' },
    { name: 'description', content: seo?.metaDescription || 'Explore our portfolio of AI projects' },
  ]
}

export default function ProjectsPage() {
  const { projects: initialProjects } = useLoaderData<typeof loader>()
  const { data: projects } = useProjects({
    initialData: initialProjects,
  })

  // Default project items if none from CMS
  const defaultProjects = [
    { id: '1', title: 'Success Stories AI In Action', category: 'Data Analytics', featuredImage: '/images/project-1.jpg', slug: 'success-stories' },
    { id: '2', title: 'Success Stories AI In Action', category: 'Data Analytics', featuredImage: '/images/project-2.jpg', slug: 'success-stories-2' },
    { id: '3', title: 'Success Stories AI In Action', category: 'Data Analytics', featuredImage: '/images/project-3.jpg', slug: 'success-stories-3' },
    { id: '4', title: 'Success Stories AI In Action', category: 'Data Analytics', featuredImage: '/images/project-4.jpg', slug: 'success-stories-4' },
    { id: '5', title: 'AI Innovations Unleashed', category: 'Data Analytics', featuredImage: '/images/project-5.jpg', slug: 'ai-innovations' },
    { id: '6', title: 'Transforming Industries AI', category: 'Data Analytics', featuredImage: '/images/project-6.jpg', slug: 'transforming-industries' },
    { id: '7', title: 'AI at the Forefront of Change', category: 'Data Analytics', featuredImage: '/images/project-7.jpg', slug: 'ai-forefront' },
    { id: '8', title: 'Revolutionizing Business AI', category: 'Data Analytics', featuredImage: '/images/project-8.jpg', slug: 'revolutionizing-business' },
  ]

  const displayProjects = projects && projects.length > 0 ? projects : defaultProjects

  return (
    <>
      {/* Page Header Start */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              {/* Page Header Box Start */}
              <div className="page-header-box">
                <h1 className="wow fadeInUp" data-cursor="-opaque">Our <span>projects</span></h1>
                <nav className="wow fadeInUp" data-wow-delay="0.2s">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">projects</li>
                  </ol>
                </nav>
              </div>
              {/* Page Header Box End */}
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      {/* Page Projects Section Start */}
      <div className="our-projects page-projects">
        <div className="container-fluid">
          <div className="row">
            {displayProjects.map((project, index) => (
              <div className="col-lg-3 col-md-6" key={project.id}>
                {/* Project Item Start */}
                <div className="project-item wow fadeInUp" data-wow-delay={index > 0 ? `${(index * 0.2).toFixed(1)}s` : undefined}>
                  <div className="project-image">
                    <Link to={`/projects/${project.slug || project.id}`} data-cursor-text="View">
                      <figure className="image-anime">
                        <img src={project.featuredImage || `/images/project-${(index % 8) + 1}.jpg`} alt={project.title} />
                      </figure>
                    </Link>
                  </div>
                  <div className="project-content">
                    <h3><Link to={`/projects/${project.slug || project.id}`}>{project.title}</Link></h3>
                    <p>{project.category || 'Data Analytics'}</p>
                  </div>
                  <div className="project-btn">
                    <Link to={`/projects/${project.slug || project.id}`}>
                      <img src="/images/arrow-white.svg" alt="" />
                    </Link>
                  </div>
                </div>
                {/* Project Item End */}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Page Projects Section End */}
    </>
  )
}
