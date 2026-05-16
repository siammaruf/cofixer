import { Link, useParams, useLoaderData } from 'react-router'
import { SuspenseLoader } from '~/components/ui/suspense-loader'
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
    console.error('Failed to load project', error)
    return { project: null, seo: null }
  }
}

export function meta({ data }: { data: { project?: Project; seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || `${data?.project?.title || 'Project'} | Cofixer` },
    { name: 'description', content: seo?.metaDescription || data?.project?.summary || '' },
  ]
}

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const { project: initialProject } = useLoaderData<typeof loader>()
  const { data: project, isLoading, error } = useProject(slug || '', {
    initialData: initialProject ?? undefined,
  })

  if (isLoading) {
    return <SuspenseLoader message="Loading project..." />
  }

  if (error || !project) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="Project Not Found"
          description="The project you are looking for does not exist."
          action={
            <Link to="/projects" className="text-primary hover:underline">
              ← Back to Projects
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Link
        to="/projects"
        className="text-primary hover:underline mb-4 inline-block"
      >
        ← Back to Projects
      </Link>
      {project.featuredImage && (
        <img
          src={project.featuredImage}
          alt={project.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
      {project.clientName && (
        <p className="text-gray-500 mb-4">Client: {project.clientName}</p>
      )}
      {project.category && (
        <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm mb-6">
          {project.category}
        </span>
      )}
      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-6">{project.summary}</p>
        {project.description && (
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {project.description}
          </div>
        )}
      </div>
      {project.images && project.images.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {project.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${project.title} - ${idx + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  )
}
