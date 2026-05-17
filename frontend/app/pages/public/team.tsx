import { Link, useLoaderData } from 'react-router'
import { cmsService } from '~/services/httpServices/cmsService'
import { useTeam } from '~/services/httpServices/queries'
import type { SeoSettings } from '~/types/cms'

export async function loader() {
  try {
    const [teamRes, seoRes] = await Promise.all([
      cmsService.getTeam(),
      cmsService.getSeoSettings('team'),
    ])
    return { members: teamRes.data, seo: seoRes.data }
  } catch (error) {
    console.error('Failed to load team', error)
    return { members: [], seo: null }
  }
}

export function meta({ data }: { data: { seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || 'Our Team | Cofixer' },
    { name: 'description', content: seo?.metaDescription || 'Meet our expert team' },
  ]
}

export default function TeamPage() {
  const { members: initialMembers } = useLoaderData<typeof loader>()
  const { data: members } = useTeam({
    initialData: initialMembers,
  })

  // Default team members if none from CMS
  const defaultMembers = [
    { id: '1', name: 'Sophia Bennett', role: 'Hacking specialist', image: '/images/team-1.jpg' },
    { id: '2', name: 'Darrell steward', role: 'Attack specialist', image: '/images/team-2.jpg' },
    { id: '3', name: 'Ava mitchell', role: 'Cyber Expert', image: '/images/team-3.jpg' },
    { id: '4', name: 'Ethan carter', role: 'Penetration Tester', image: '/images/team-4.jpg' },
    { id: '5', name: 'Olivia Carter', role: 'Security Analyst', image: '/images/team-5.jpg' },
    { id: '6', name: 'Ethan Cooper', role: 'Security Analyst', image: '/images/team-6.jpg' },
    { id: '7', name: 'Emma Hayes', role: 'Cyber Expert', image: '/images/team-7.jpg' },
    { id: '8', name: 'Liam Parker', role: 'Penetration Tester', image: '/images/team-8.jpg' },
  ]

  const displayMembers = members && members.length > 0 ? members : defaultMembers

  return (
    <>
      {/* Page Header Start */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              {/* Page Header Box Start */}
              <div className="page-header-box">
                <h1 className="wow fadeInUp" data-cursor="-opaque">Our <span>team</span></h1>
                <nav className="wow fadeInUp" data-wow-delay="0.2s">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">team</li>
                  </ol>
                </nav>
              </div>
              {/* Page Header Box End */}
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      {/* Page Team Section Start */}
      <div className="page-team">
        <div className="container">
          <div className="row">
            {displayMembers.map((member, index) => (
              <div className="col-lg-3 col-md-6" key={member.id}>
                {/* Team Member Item Start */}
                <div className="team-item wow fadeInUp" data-wow-delay={index > 0 ? `${(index * 0.2).toFixed(1)}s` : undefined}>
                  {/* team Image Start */}
                  <div className="team-image">
                    <Link to="/team" className="image-anime" data-cursor-text="View">
                      <figure>
                        <img src={member.image || `/images/team-${(index % 8) + 1}.jpg`} alt={member.name} />
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
      {/* Page Team Section End */}
    </>
  )
}
