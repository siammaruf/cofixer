import { useLoaderData } from 'react-router'
import { SuspenseLoader } from '~/components/ui/suspense-loader'
import { EmptyState } from '~/components/ui/empty-state'
import { cmsService } from '~/services/httpServices/cmsService'
import { useFaqs } from '~/services/httpServices/queries'
import type { Faq, SeoSettings } from '~/types/cms'

export async function loader() {
  try {
    const [faqsRes, seoRes] = await Promise.all([
      cmsService.getFaqs(),
      cmsService.getSeoSettings('faqs'),
    ])
    return { faqs: faqsRes.data, seo: seoRes.data }
  } catch (error) {
    console.error('Failed to load FAQs', error)
    return { faqs: [], seo: null }
  }
}

export function meta({ data }: { data: { seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || 'FAQs | Cofixer' },
    { name: 'description', content: seo?.metaDescription || 'Frequently asked questions' },
  ]
}

export default function FaqsPage() {
  const { faqs: initialFaqs } = useLoaderData<typeof loader>()
  const { data: faqs, isLoading, error } = useFaqs({
    initialData: initialFaqs,
  })

  if (isLoading) {
    return <SuspenseLoader message="Loading FAQs..." />
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="Error"
          description="Failed to load FAQs. Please try again later."
        />
      </div>
    )
  }

  if (!faqs || faqs.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="No FAQs"
          description="No FAQs available at the moment."
        />
      </div>
    )
  }

  const grouped = faqs.reduce(
    (acc: Record<string, Faq[]>, faq: Faq) => {
      const category = faq.category || 'General'
      if (!acc[category]) acc[category] = []
      acc[category].push(faq)
      return acc
    },
    {}
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">
        Frequently Asked Questions
      </h1>
      <div className="space-y-8">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="space-y-4">
              {items.map((faq: Faq) => (
                <div key={faq.id} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
