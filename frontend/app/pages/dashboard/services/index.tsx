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

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <Link
          to="/admin/services/create"
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Add Service
        </Link>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Title</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Slug</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Featured</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Active</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {services.map((service) => (
              <tr key={service.id}>
                <td className="px-4 py-3">{service.title}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {service.slug}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleFeatured(service.id)}
                    className={`px-2 py-1 rounded text-xs ${
                      service.featured
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {service.featured ? 'Featured' : 'Not Featured'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      service.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(service.id)}
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
