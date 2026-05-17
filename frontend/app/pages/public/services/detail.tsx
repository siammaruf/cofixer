import { Link, useParams, useLoaderData } from 'react-router'
import { EmptyState } from '~/components/ui/empty-state'
import { cmsService } from '~/services/httpServices/cmsService'
import { useService } from '~/services/httpServices/queries'
import type { Service, SeoSettings } from '~/types/cms'

export async function loader({ params }: { params: { slug: string } }) {
  try {
    const [serviceRes, seoRes] = await Promise.all([
      cmsService.getService(params.slug),
      cmsService.getSeoSettings(`services/${params.slug}`),
    ])
    return { service: serviceRes.data, seo: seoRes.data }
  } catch (error) {
    console.error('Failed to load service', error)
    return { service: null, seo: null }
  }
}

export function meta({ data }: { data: { service?: Service; seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || `${data?.service?.title || 'Service'} | Cofixer` },
    { name: 'description', content: seo?.metaDescription || data?.service?.shortDescription || '' },
  ]
}

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const { service: initialService } = useLoaderData<typeof loader>()
  const { data: service, error } = useService(slug || '', {
    initialData: initialService ?? undefined,
  })

  if (error || !service) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="Service Not Found"
          description="The service you are looking for does not exist."
          action={
            <Link to="/services" className="text-primary hover:underline">
              ← Back to Services
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Link
        to="/services"
        className="text-primary hover:underline mb-4 inline-block"
      >
        ← Back to Services
      </Link>
      {service.image && (
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
      {service.icon && <div className="text-5xl mb-4">{service.icon}</div>}
      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          {service.shortDescription}
        </p>
        {service.description && (
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {service.description}
          </div>
        )}
      </div>
    </div>
  )
}
