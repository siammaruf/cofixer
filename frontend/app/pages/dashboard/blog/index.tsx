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

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link
          to="/admin/blog/create"
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Add Post
        </Link>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Title</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Author</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Category</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Published</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-4 py-3">{post.title}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {post.authorName || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {post.category || '-'}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleTogglePublish(post.id)}
                    className={`px-2 py-1 rounded text-xs ${
                      post.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {post.isPublished ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(post.id)}
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
