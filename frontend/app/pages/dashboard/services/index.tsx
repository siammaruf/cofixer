import { useEffect } from 'react'
import { Link } from 'react-router'
import { useAppDispatch, useAppSelector } from '~/redux/store/hooks'
import {
  fetchServices,
  deleteService,
  toggleServiceFeatured,
} from '~/redux/features/cmsSlice'

export default function ServicesDashboard() {
  const dispatch = useAppDispatch()
  const { services, loading, error } = useAppSelector((state) => state.cms)

  useEffect(() => {
    dispatch(fetchServices())
  }, [dispatch])

  const handleToggleFeatured = async (id: string) => {
    await dispatch(toggleServiceFeatured(id)).unwrap()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    await dispatch(deleteService(id)).unwrap()
  }

  if (loading) return <div className="text-center py-8 text-[#A7AABB]"><div className="relative mx-auto mb-4" style={{ width: 60, height: 60 }}><div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: "#A93E17", borderBottomColor: "#15399A" }} /><div className="absolute inset-0 flex items-center justify-center"><img src="/images/loader.svg" alt="" className="w-8 h-8" /></div></div>Loading...</div>
  if (error) return <div className="text-center py-8 text-[rgb(230,87,87)]">{error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="dashboard-section-title">Services</h1>
        <Link
          to="/admin/services/create"
          className="dashboard-btn"
        >
          Add Service
        </Link>
      </div>
      <div className="rounded-[20px] border border-[#FFFFFF0F] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0A0A0A]">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Title</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Slug</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Featured</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Active</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-[#A7AABB]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFFFFF0F]">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-[#FFFFFF08] transition-colors">
                <td className="px-4 py-3 text-white">{service.title}</td>
                <td className="px-4 py-3 text-sm text-[#A7AABB]">
                  {service.slug}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleFeatured(service.id)}
                    className={`dashboard-badge ${
                      service.featured
                        ? 'bg-[#15399A]/10 text-[#15399A]'
                        : 'bg-[#FFFFFF0F] text-[#A7AABB]'
                    }`}
                  >
                    {service.featured ? 'Featured' : 'Not Featured'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`dashboard-badge ${
                      service.isActive
                        ? 'bg-[#A93E17]/10 text-[#A93E17]'
                        : 'bg-[rgb(230,87,87)]/10 text-[rgb(230,87,87)]'
                    }`}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(service.id)}
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
