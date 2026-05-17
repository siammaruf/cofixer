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

  if (loading) return <div className="text-center py-8 text-[#A7AABB]"><div className="relative mx-auto mb-4" style={{ width: 60, height: 60 }}><div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: "#A93E17", borderBottomColor: "#15399A" }} /><div className="absolute inset-0 flex items-center justify-center"><img src="/images/loader.svg" alt="" className="w-8 h-8" /></div></div>Loading...</div>
  if (error) return <div className="text-center py-8 text-[rgb(230,87,87)]">{error}</div>

  return (
    <div>
      <h1 className="dashboard-section-title mb-6">Site Settings</h1>
      <form onSubmit={handleUpdate} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Site Name</label>
          <input
            type="text"
            value={form.siteName}
            onChange={(e) => setForm({ ...form, siteName: e.target.value })}
            className="dashboard-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">
            Copyright Text
          </label>
          <input
            type="text"
            value={form.copyrightText}
            onChange={(e) =>
              setForm({ ...form, copyrightText: e.target.value })
            }
            className="dashboard-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">
            Google Analytics ID
          </label>
          <input
            type="text"
            value={form.googleAnalyticsId}
            onChange={(e) =>
              setForm({ ...form, googleAnalyticsId: e.target.value })
            }
            className="dashboard-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-white">
            Google Tag Manager ID
          </label>
          <input
            type="text"
            value={form.googleTagManagerId}
            onChange={(e) =>
              setForm({ ...form, googleTagManagerId: e.target.value })
            }
            className="dashboard-input"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="dashboard-btn disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
