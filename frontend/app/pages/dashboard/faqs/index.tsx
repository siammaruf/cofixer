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

  if (loading) return <div className="text-center py-8 text-[#A7AABB]"><div className="relative mx-auto mb-4" style={{ width: 60, height: 60 }}><div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: "#A93E17", borderBottomColor: "#15399A" }} /><div className="absolute inset-0 flex items-center justify-center"><img src="/images/loader.svg" alt="" className="w-8 h-8" /></div></div>Loading...</div>
  if (error) return <div className="text-center py-8 text-[rgb(230,87,87)]">{error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="dashboard-section-title">FAQs</h1>
        <Link
          to="/admin/faqs/create"
          className="dashboard-btn"
        >
          Add FAQ
        </Link>
      </div>
      <div className="rounded-[20px] border border-[#FFFFFF0F] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0A0A0A]">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Question</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Category</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Active</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-[#A7AABB]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFFFFF0F]">
            {faqs.map((faq) => (
              <tr key={faq.id} className="hover:bg-[#FFFFFF08] transition-colors">
                <td className="px-4 py-3 max-w-xs truncate text-white">{faq.question}</td>
                <td className="px-4 py-3 text-sm text-[#A7AABB]">
                  {faq.category || '-'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`dashboard-badge ${
                      faq.isActive
                        ? 'bg-[#A93E17]/10 text-[#A93E17]'
                        : 'bg-[rgb(230,87,87)]/10 text-[rgb(230,87,87)]'
                    }`}
                  >
                    {faq.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(faq.id)}
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
