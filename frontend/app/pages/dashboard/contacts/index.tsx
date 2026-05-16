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

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Contact Inbox</h1>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Email</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Subject</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className={contact.read ? '' : 'bg-blue-50'}
              >
                <td className="px-4 py-3">{contact.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {contact.email}
                </td>
                <td className="px-4 py-3 text-sm">{contact.subject}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      contact.status === 'new'
                        ? 'bg-blue-100 text-blue-800'
                        : contact.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : contact.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {contact.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {!contact.read && (
                    <button
                      onClick={() => handleMarkAsRead(contact.id, 'in_progress')}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(contact.id)}
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
