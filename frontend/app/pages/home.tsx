import { Link, useLoaderData } from 'react-router'
import { SuspenseLoader } from '~/components/ui/suspense-loader'
import { EmptyState } from '~/components/ui/empty-state'
import { cmsService } from '~/services/httpServices/cmsService'
import {
  useFeaturedServices,
  useFeaturedProjects,
  useTestimonials,
  useStats,
} from '~/services/httpServices/queries'
import type { Service, Project, Testimonial, SeoSettings } from '~/types/cms'

export async function loader() {
  try {
    const [servicesRes, projectsRes, testimonialsRes, statsRes, seoRes] =
      await Promise.all([
        cmsService.getFeaturedServices(),
        cmsService.getFeaturedProjects(),
        cmsService.getTestimonials(),
        cmsService.getStats(),
        cmsService.getSeoSettings('/'),
      ])
    return {
      services: servicesRes.data.slice(0, 6),
      projects: projectsRes.data.slice(0, 6),
      testimonials: testimonialsRes.data.slice(0, 6),
      stats: statsRes.data,
      seo: seoRes.data,
    }
  } catch (error) {
    console.error('Failed to load home page data', error)
    return {
      services: [],
      projects: [],
      testimonials: [],
      stats: null,
      seo: null,
    }
  }
}

export function meta({ data }: { data: { seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || 'Cofixer - AI Agency & Technology' },
    {
      name: 'description',
      content: seo?.metaDescription || 'AI-powered solutions for your business',
    },
  ]
}

export default function Home() {
  const {
    services: initialServices,
    projects: initialProjects,
    testimonials: initialTestimonials,
    stats: initialStats,
  } = useLoaderData<typeof loader>()

  const {
    data: services,
    isLoading: servicesLoading,
    error: servicesError,
  } = useFeaturedServices({ initialData: initialServices })
  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useFeaturedProjects({ initialData: initialProjects })
  const {
    data: testimonials,
    isLoading: testimonialsLoading,
    error: testimonialsError,
  } = useTestimonials({ initialData: initialTestimonials })
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useStats({ initialData: initialStats ?? undefined })

  const isLoading =
    servicesLoading || projectsLoading || testimonialsLoading || statsLoading

  if (isLoading) {
    return <SuspenseLoader message="Loading..." />
  }

  const hasError =
    servicesError || projectsError || testimonialsError || statsError

  if (hasError) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="Error"
          description="Failed to load page data. Please try again later."
        />
      </div>
    )
  }

  const featuredServices = services?.slice(0, 6) ?? []
  const featuredProjects = projects?.slice(0, 6) ?? []
  const featuredTestimonials = testimonials?.slice(0, 6) ?? []

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Cofixer</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered solutions for your business. We deliver innovative
            technology that drives growth and transforms industries.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/services"
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90"
            >
              Our Services
            </Link>
            <Link
              to="/contact"
              className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/5"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Services', value: stats.services },
              { label: 'Projects', value: stats.projects },
              { label: 'Team Members', value: stats.teamMembers },
              { label: 'Blog Posts', value: stats.blogPosts },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 bg-card rounded-lg border"
              >
                <div className="text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service: Service) => (
              <div
                key={service.id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                {service.icon && (
                  <div className="text-4xl mb-4">{service.icon}</div>
                )}
                <h3 className="text-xl font-semibold mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.shortDescription}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/services"
              className="text-primary hover:underline font-medium"
            >
              View All Services →
            </Link>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Our Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project: Project) => (
              <div
                key={project.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {project.featuredImage && (
                  <img
                    src={project.featuredImage}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{project.summary}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/projects"
              className="text-primary hover:underline font-medium"
            >
              View All Projects →
            </Link>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {featuredTestimonials.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTestimonials.map((t: Testimonial) => (
              <div key={t.id} className="border rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {t.image && (
                    <img
                      src={t.image}
                      alt={t.clientName}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{t.clientName}</h3>
                    <p className="text-sm text-gray-500">
                      {t.clientRole}{' '}
                      {t.company && `- ${t.company}`}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{t.content}"</p>
                <div className="mt-2 text-yellow-500">
                  {'★'.repeat(t.rating)}
                  {'☆'.repeat(5 - t.rating)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
