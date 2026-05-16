import { useEffect } from 'react'
import { Link } from 'react-router'
import { useAppDispatch, useAppSelector } from '~/redux/store/hooks'
import { fetchFaqs, deleteFaq } from '~/redux/features/cmsSlice'

export default function FaqsDashboard() {
  const dispatch = useAppDispatch()
  const { faqs, loading, error } = useAppSelector((state) => state.cms)

  useEffect(() => {
    dispatch(fetchFaqs())
  }, [dispatch])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    await dispatch(deleteFaq(id)).unwrap()
  }

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">FAQs</h1>
        <Link
          to="/admin/faqs/create"
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Add FAQ
        </Link>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Question</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Category</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Active</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {faqs.map((faq) => (
              <tr key={faq.id}>
                <td className="px-4 py-3 max-w-xs truncate">{faq.question}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {faq.category || '-'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      faq.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {faq.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(faq.id)}
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
