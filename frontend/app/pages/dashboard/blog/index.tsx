import { useEffect } from 'react'
import { Link } from 'react-router'
import { useAppDispatch, useAppSelector } from '~/redux/store/hooks'
import {
  fetchBlogPosts,
  deleteBlogPost,
  toggleBlogPublish,
} from '~/redux/features/cmsSlice'

export default function BlogDashboard() {
  const dispatch = useAppDispatch()
  const { blogPosts: posts, loading, error } = useAppSelector(
    (state) => state.cms
  )

  useEffect(() => {
    dispatch(fetchBlogPosts())
  }, [dispatch])

  const handleTogglePublish = async (id: string) => {
    await dispatch(toggleBlogPublish(id)).unwrap()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    await dispatch(deleteBlogPost(id)).unwrap()
  }

  if (loading) return <div className="text-center py-8 text-[#A7AABB]"><div className="relative mx-auto mb-4" style={{ width: 60, height: 60 }}><div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: "#A93E17", borderBottomColor: "#15399A" }} /><div className="absolute inset-0 flex items-center justify-center"><img src="/images/loader.svg" alt="" className="w-8 h-8" /></div></div>Loading...</div>
  if (error) return <div className="text-center py-8 text-[rgb(230,87,87)]">{error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="dashboard-section-title">Blog Posts</h1>
        <Link
          to="/admin/blog/create"
          className="dashboard-btn"
        >
          Add Post
        </Link>
      </div>
      <div className="rounded-[20px] border border-[#FFFFFF0F] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0A0A0A]">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Title</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Author</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Category</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Published</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-[#A7AABB]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFFFFF0F]">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-[#FFFFFF08] transition-colors">
                <td className="px-4 py-3 text-white">{post.title}</td>
                <td className="px-4 py-3 text-sm text-[#A7AABB]">
                  {post.authorName || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-[#A7AABB]">
                  {post.category || '-'}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleTogglePublish(post.id)}
                    className={`dashboard-badge ${
                      post.isPublished
                        ? 'bg-[#A93E17]/10 text-[#A93E17]'
                        : 'bg-[#FFFFFF0F] text-[#A7AABB]'
                    }`}
                  >
                    {post.isPublished ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(post.id)}
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
