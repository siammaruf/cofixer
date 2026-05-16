import { useLoaderData } from 'react-router'
import { SuspenseLoader } from '~/components/ui/suspense-loader'
import { EmptyState } from '~/components/ui/empty-state'
import { cmsService } from '~/services/httpServices/cmsService'
import { useTeam } from '~/services/httpServices/queries'
import type { TeamMember, SeoSettings } from '~/types/cms'

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
  const { data: members, isLoading, error } = useTeam({
    initialData: initialMembers,
  })

  if (isLoading) {
    return <SuspenseLoader message="Loading team..." />
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="Error"
          description="Failed to load team members. Please try again later."
        />
      </div>
    )
  }

  if (!members || members.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="No Team Members"
          description="No team members available at the moment."
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((member: TeamMember) => (
          <div
            key={member.id}
            className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow"
          >
            {member.image && (
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
            )}
            <h2 className="text-lg font-semibold">{member.name}</h2>
            <p className="text-gray-500 text-sm">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
