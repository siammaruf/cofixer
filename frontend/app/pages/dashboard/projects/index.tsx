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

  if (loading) return <div className="text-center py-8 text-[#A7AABB]"><div className="relative mx-auto mb-4" style={{ width: 60, height: 60 }}><div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: "#A93E17", borderBottomColor: "#15399A" }} /><div className="absolute inset-0 flex items-center justify-center"><img src="/images/loader.svg" alt="" className="w-8 h-8" /></div></div>Loading...</div>
  if (error) return <div className="text-center py-8 text-[rgb(230,87,87)]">{error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="dashboard-section-title">Projects</h1>
        <Link
          to="/admin/projects/create"
          className="dashboard-btn"
        >
          Add Project
        </Link>
      </div>
      <div className="rounded-[20px] border border-[#FFFFFF0F] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0A0A0A]">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Title</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Client</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Category</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Featured</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-[#A7AABB]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFFFFF0F]">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-[#FFFFFF08] transition-colors">
                <td className="px-4 py-3 text-white">{project.title}</td>
                <td className="px-4 py-3 text-sm text-[#A7AABB]">
                  {project.clientName || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-[#A7AABB]">
                  {project.category || '-'}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleFeatured(project.id)}
                    className={`dashboard-badge ${
                      project.featured
                        ? 'bg-[#15399A]/10 text-[#15399A]'
                        : 'bg-[#FFFFFF0F] text-[#A7AABB]'
                    }`}
                  >
                    {project.featured ? 'Featured' : 'Not Featured'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(project.id)}
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
