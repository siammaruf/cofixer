import { useLoaderData } from 'react-router'
import { SuspenseLoader } from '~/components/ui/suspense-loader'
import { EmptyState } from '~/components/ui/empty-state'
import { cmsService } from '~/services/httpServices/cmsService'
import { useTeam, useStats } from '~/services/httpServices/queries'
import type { TeamMember, SeoSettings } from '~/types/cms'

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
  const {
    data: teamData,
    isLoading: teamLoading,
    error: teamError,
  } = useTeam({ initialData: initialMembers })
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useStats({ initialData: initialStats ?? undefined })

  const isLoading = teamLoading || statsLoading

  if (isLoading) {
    return <SuspenseLoader message="Loading about page..." />
  }

  if (teamError || statsError) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="Error"
          description="Failed to load page data. Please try again later."
        />
      </div>
    )
  }

  const members = teamData?.slice(0, 4) ?? []

  return (
    <div className="container mx-auto p-4 space-y-16">
      {/* About Hero */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Cofixer is a leading AI agency dedicated to transforming businesses
          through innovative technology solutions. We combine cutting-edge
          artificial intelligence with deep industry expertise to deliver
          measurable results.
        </p>
      </section>

      {/* Stats */}
      {stats && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Projects Delivered', value: stats.projects },
            { label: 'Team Members', value: stats.teamMembers },
            { label: 'Services', value: stats.services },
            { label: 'Happy Clients', value: stats.testimonials },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 bg-card rounded-lg border"
            >
              <div className="text-3xl font-bold text-primary">
                {stat.value}+
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </section>
      )}

      {/* Team */}
      {members.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member: TeamMember) => (
              <div
                key={member.id}
                className="border rounded-lg p-6 text-center hover:shadow-md transition-shadow"
              >
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                )}
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
