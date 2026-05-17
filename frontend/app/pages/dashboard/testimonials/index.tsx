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

  if (loading) return <div className="text-center py-8 text-[#A7AABB]"><div className="relative mx-auto mb-4" style={{ width: 60, height: 60 }}><div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: "#A93E17", borderBottomColor: "#15399A" }} /><div className="absolute inset-0 flex items-center justify-center"><img src="/images/loader.svg" alt="" className="w-8 h-8" /></div></div>Loading...</div>
  if (error) return <div className="text-center py-8 text-[rgb(230,87,87)]">{error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="dashboard-section-title">Testimonials</h1>
        <Link
          to="/admin/testimonials/create"
          className="dashboard-btn"
        >
          Add Testimonial
        </Link>
      </div>
      <div className="rounded-[20px] border border-[#FFFFFF0F] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0A0A0A]">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Client</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Company</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Rating</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Featured</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-[#A7AABB]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFFFFF0F]">
            {testimonials.map((t) => (
              <tr key={t.id} className="hover:bg-[#FFFFFF08] transition-colors">
                <td className="px-4 py-3 text-white">{t.clientName}</td>
                <td className="px-4 py-3 text-sm text-[#A7AABB]">
                  {t.company || '-'}
                </td>
                <td className="px-4 py-3 text-[#A93E17]">
                  {'★'.repeat(t.rating)}
                  <span className="text-[#FFFFFF1A">{'☆'.repeat(5 - t.rating)}</span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleFeatured(t.id)}
                    className={`dashboard-badge ${
                      t.featured
                        ? 'bg-[#15399A]/10 text-[#15399A]'
                        : 'bg-[#FFFFFF0F] text-[#A7AABB]'
                    }`}
                  >
                    {t.featured ? 'Featured' : 'Not Featured'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-[rgb(230,87,87)] text-sm hover:underline"
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
