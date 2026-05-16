import { useLoaderData } from 'react-router'
import { SuspenseLoader } from '~/components/ui/suspense-loader'
import { EmptyState } from '~/components/ui/empty-state'
import { cmsService } from '~/services/httpServices/cmsService'
import { useProjects } from '~/services/httpServices/queries'
import type { Project, SeoSettings } from '~/types/cms'

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
  const { data: projects, isLoading, error } = useProjects({
    initialData: initialProjects,
  })

  if (isLoading) {
    return <SuspenseLoader message="Loading projects..." />
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="Error"
          description="Failed to load projects. Please try again later."
        />
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="No Projects"
          description="No projects available at the moment."
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Our Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: Project) => (
          <div
            key={project.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {project.featuredImage && (
              <img
                src={project.featuredImage}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600 text-sm">{project.summary}</p>
              {project.clientName && (
                <p className="text-sm text-gray-500 mt-2">
                  Client: {project.clientName}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
