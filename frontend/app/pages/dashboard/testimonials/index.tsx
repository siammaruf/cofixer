import { useEffect } from 'react'
import { Link } from 'react-router'
import { useAppDispatch, useAppSelector } from '~/redux/store/hooks'
import {
  fetchTestimonials,
  deleteTestimonial,
  toggleTestimonialFeatured,
} from '~/redux/features/cmsSlice'

export default function TestimonialsDashboard() {
  const dispatch = useAppDispatch()
  const { testimonials, loading, error } = useAppSelector((state) => state.cms)

  useEffect(() => {
    dispatch(fetchTestimonials())
  }, [dispatch])

  const handleToggleFeatured = async (id: string) => {
    await dispatch(toggleTestimonialFeatured(id)).unwrap()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    await dispatch(deleteTestimonial(id)).unwrap()
  }

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Link
          to="/admin/testimonials/create"
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Add Testimonial
        </Link>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Client</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Company</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Rating</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Featured</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {testimonials.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3">{t.clientName}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {t.company || '-'}
                </td>
                <td className="px-4 py-3 text-yellow-500">
                  {'★'.repeat(t.rating)}
                  {'☆'.repeat(5 - t.rating)}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleFeatured(t.id)}
                    className={`px-2 py-1 rounded text-xs ${
                      t.featured
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {t.featured ? 'Featured' : 'Not Featured'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
