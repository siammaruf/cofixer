import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '~/redux/store/hooks'
import {
  fetchSiteSettings,
  updateSiteSettings,
} from '~/redux/features/cmsSlice'

export default function SettingsDashboard() {
  const dispatch = useAppDispatch()
  const { siteSettings, loading, error } = useAppSelector((state) => state.cms)
  const [form, setForm] = useState({
    siteName: '',
    copyrightText: '',
    googleAnalyticsId: '',
    googleTagManagerId: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch(fetchSiteSettings())
  }, [dispatch])

  useEffect(() => {
    if (siteSettings) {
      setForm({
        siteName: siteSettings.siteName || '',
        copyrightText: siteSettings.copyrightText || '',
        googleAnalyticsId: siteSettings.googleAnalyticsId || '',
        googleTagManagerId: siteSettings.googleTagManagerId || '',
      })
    }
  }, [siteSettings])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await dispatch(updateSiteSettings(form)).unwrap()
      alert('Settings saved successfully')
    } catch {
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Site Settings</h1>
      <form onSubmit={handleUpdate} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Site Name</label>
          <input
            type="text"
            value={form.siteName}
            onChange={(e) => setForm({ ...form, siteName: e.target.value })}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Copyright Text
          </label>
          <input
            type="text"
            value={form.copyrightText}
            onChange={(e) =>
              setForm({ ...form, copyrightText: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Google Analytics ID
          </label>
          <input
            type="text"
            value={form.googleAnalyticsId}
            onChange={(e) =>
              setForm({ ...form, googleAnalyticsId: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Google Tag Manager ID
          </label>
          <input
            type="text"
            value={form.googleTagManagerId}
            onChange={(e) =>
              setForm({ ...form, googleTagManagerId: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
