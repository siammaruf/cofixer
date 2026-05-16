import { useLoaderData } from 'react-router'
import { useState } from 'react'
import { getErrorMessage } from '~/utils/errorHandler'
import { cmsService } from '~/services/httpServices/cmsService'
import { useSubmitContact } from '~/services/httpServices/queries'
import type { SeoSettings } from '~/types/cms'

export async function loader() {
  try {
    const seoRes = await cmsService.getSeoSettings('contact')
    return { seo: seoRes.data }
  } catch (error) {
    console.error('Failed to load SEO settings', error)
    return { seo: null }
  }
}

export function meta({ data }: { data: { seo?: SeoSettings } }) {
  const seo = data?.seo
  return [
    { title: seo?.title || 'Contact Us | Cofixer' },
    { name: 'description', content: seo?.metaDescription || 'Get in touch with our team' },
  ]
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitContact = useSubmitContact()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await submitContact.mutateAsync(formData)
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setError(
        getErrorMessage(err) ||
          'Failed to submit contact form. Please try again.'
      )
    }
  }

  if (submitted) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">
            Thank you!
          </h2>
          <p className="text-green-700">
            Your message has been submitted successfully.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input
            type="text"
            required
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            required
            rows={5}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={submitContact.isPending}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {submitContact.isPending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
