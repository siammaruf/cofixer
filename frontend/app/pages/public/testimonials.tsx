import { useLoaderData } from 'react-router'
import { SuspenseLoader } from '~/components/ui/suspense-loader'
import { EmptyState } from '~/components/ui/empty-state'
import { cmsService } from '~/services/httpServices/cmsService'
import { useTestimonials } from '~/services/httpServices/queries'
import type { Testimonial, SeoSettings } from '~/types/cms'

export async function loader() {
  try {
    const [testimonialsRes, seoRes] = await Promise.all([
      cmsService.getTestimonials(),
      cmsService.getSeoSettings('testimonials'),
    ])
    return { testimonials: testimonialsRes.data, seo: seoRes.data }
  } catch (error) {
    console.error('Failed to load testimonials', error)
    return { testimonials: [], seo: null }
  }
}

export function meta({ data }: { data: { seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || 'Testimonials | Cofixer' },
    { name: 'description', content: seo?.metaDescription || 'What our clients say about us' },
  ]
}

export default function TestimonialsPage() {
  const { testimonials: initialTestimonials } = useLoaderData<typeof loader>()
  const { data: testimonials, isLoading, error } = useTestimonials({
    initialData: initialTestimonials,
  })

  if (isLoading) {
    return <SuspenseLoader message="Loading testimonials..." />
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="Error"
          description="Failed to load testimonials. Please try again later."
        />
      </div>
    )
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="No Testimonials"
          description="No testimonials available at the moment."
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Testimonials</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial: Testimonial) => (
          <div key={testimonial.id} className="border rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              {testimonial.image && (
                <img
                  src={testimonial.image}
                  alt={testimonial.clientName}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
              )}
              <div>
                <h3 className="font-semibold">{testimonial.clientName}</h3>
                <p className="text-sm text-gray-500">
                  {testimonial.clientRole}{' '}
                  {testimonial.company && `- ${testimonial.company}`}
                </p>
              </div>
            </div>
            <p className="text-gray-600 italic">"{testimonial.content}"</p>
            <div className="mt-2 text-yellow-500">
              {'★'.repeat(testimonial.rating)}
              {'☆'.repeat(5 - testimonial.rating)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
