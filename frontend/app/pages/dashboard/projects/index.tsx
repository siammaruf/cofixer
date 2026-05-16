import { useEffect } from 'react'
import { Link } from 'react-router'
import { useAppDispatch, useAppSelector } from '~/redux/store/hooks'
import {
  fetchProjects,
  deleteProject,
  toggleProjectFeatured,
} from '~/redux/features/cmsSlice'

export default function ProjectsDashboard() {
  const dispatch = useAppDispatch()
  const { projects, loading, error } = useAppSelector((state) => state.cms)

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  const handleToggleFeatured = async (id: string) => {
    await dispatch(toggleProjectFeatured(id)).unwrap()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    await dispatch(deleteProject(id)).unwrap()
  }

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          to="/admin/projects/create"
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Add Project
        </Link>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Title</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Client</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Category</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Featured</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-4 py-3">{project.title}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {project.clientName || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {project.category || '-'}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleFeatured(project.id)}
                    className={`px-2 py-1 rounded text-xs ${
                      project.featured
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {project.featured ? 'Featured' : 'Not Featured'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(project.id)}
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
