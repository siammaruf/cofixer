import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '~/redux/store/hooks'
import {
  fetchContacts,
  updateContactStatus,
  deleteContact,
} from '~/redux/features/cmsSlice'
import type { ContactMessage } from '~/types/cms'

type ContactStatus = ContactMessage['status']

export default function ContactsDashboard() {
  const dispatch = useAppDispatch()
  const { contacts, loading, error } = useAppSelector((state) => state.cms)

  useEffect(() => {
    dispatch(fetchContacts())
  }, [dispatch])

  const handleMarkAsRead = async (id: string, status: ContactStatus) => {
    await dispatch(updateContactStatus({ id, data: { status, read: true } })).unwrap()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    await dispatch(deleteContact(id)).unwrap()
  }

  if (loading) return <div className="text-center py-8 text-[#A7AABB]"><div className="relative mx-auto mb-4" style={{ width: 60, height: 60 }}><div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: "#A93E17", borderBottomColor: "#15399A" }} /><div className="absolute inset-0 flex items-center justify-center"><img src="/images/loader.svg" alt="" className="w-8 h-8" /></div></div>Loading...</div>
  if (error) return <div className="text-center py-8 text-[rgb(230,87,87)]">{error}</div>

  return (
    <div>
      <h1 className="dashboard-section-title mb-6">Contact Inbox</h1>
      <div className="rounded-[20px] border border-[#FFFFFF0F] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0A0A0A]">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Email</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Subject</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-[#A7AABB]">Status</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-[#A7AABB]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFFFFF0F]">
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className={contact.read ? 'hover:bg-[#FFFFFF08] transition-colors' : 'bg-[#15399A]/5 hover:bg-[#15399A]/10 transition-colors'}
              >
                <td className="px-4 py-3 text-white">{contact.name}</td>
                <td className="px-4 py-3 text-sm text-[#A7AABB]">
                  {contact.email}
                </td>
                <td className="px-4 py-3 text-sm text-[#A7AABB]">{contact.subject}</td>
                <td className="px-4 py-3">
                  <span
                    className={`dashboard-badge ${
                      contact.status === 'new'
                        ? 'bg-[#15399A]/10 text-[#15399A]'
                        : contact.status === 'in_progress'
                          ? 'bg-[#A93E17]/10 text-[#A93E17]'
                          : contact.status === 'resolved'
                            ? 'bg-[#A93E17]/10 text-[#A93E17]'
                            : 'bg-[rgb(230,87,87)]/10 text-[rgb(230,87,87)]'
                    }`}
                  >
                    {contact.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {!contact.read && (
                    <button
                      onClick={() => handleMarkAsRead(contact.id, 'in_progress')}
                      className="text-[#15399A] text-sm hover:underline"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(contact.id)}
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
