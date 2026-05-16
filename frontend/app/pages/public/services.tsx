import { Link, useLoaderData } from 'react-router'
import { SuspenseLoader } from '~/components/ui/suspense-loader'
import { EmptyState } from '~/components/ui/empty-state'
import { cmsService } from '~/services/httpServices/cmsService'
import { useServices } from '~/services/httpServices/queries'
import type { Service, SeoSettings } from '~/types/cms'

export async function loader() {
  try {
    const [servicesRes, seoRes] = await Promise.all([
      cmsService.getServices(),
      cmsService.getSeoSettings('services'),
    ])
    return { services: servicesRes.data, seo: seoRes.data }
  } catch (error) {
    console.error('Failed to load services', error)
    return { services: [], seo: null }
  }
}

export function meta({ data }: { data: { seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || 'Our Services | Cofixer' },
    { name: 'description', content: seo?.metaDescription || 'Explore our AI-powered services' },
  ]
}

export default function ServicesPage() {
  const { services: initialServices } = useLoaderData<typeof loader>()
  const { data: services, isLoading, error } = useServices({
    initialData: initialServices,
  })

  if (isLoading) {
    return <SuspenseLoader message="Loading services..." />
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="Error"
          description="Failed to load services. Please try again later."
        />
      </div>
    )
  }

  if (!services || services.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="No Services"
          description="No services available at the moment."
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service: Service) => (
          <Link
            key={service.id}
            to={`/services/${service.slug}`}
            className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow block"
          >
            {service.icon && <div className="text-4xl mb-4">{service.icon}</div>}
            <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
            <p className="text-gray-600 mb-4">{service.shortDescription}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
