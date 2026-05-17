import { useEffect, useState, useRef } from 'react'
import { getErrorMessage } from '~/utils/errorHandler'
import { cmsAdminService } from '~/services/httpServices/cmsService'

interface MediaItem {
  id: string
  url: string
  filename: string
  mimeType: string
  size: number
  createdAt: string
}

export default function MediaDashboard() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadMedia()
  }, [])

  const loadMedia = async () => {
    setLoading(true)
    setError(null)
    try {
      // Note: Backend doesn't have a list media endpoint yet; this is a placeholder
      setMedia([])
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await cmsAdminService.uploadMedia(formData)
      alert('File uploaded successfully')
      loadMedia()
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to upload file')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const deleteMediaItem = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await cmsAdminService.deleteMedia(id)
      setMedia((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      alert(getErrorMessage(err) || 'Failed to delete media')
    }
  }

  if (loading) return <div className="text-center py-8 text-[#A7AABB]"><div className="relative mx-auto mb-4" style={{ width: 60, height: 60 }}><div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: "#A93E17", borderBottomColor: "#15399A" }} /><div className="absolute inset-0 flex items-center justify-center"><img src="/images/loader.svg" alt="" className="w-8 h-8" /></div></div>Loading...</div>
  if (error) return <div className="text-center py-8 text-[rgb(230,87,87)]">{error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="dashboard-section-title">Media Library</h1>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleUpload}
            className="hidden"
            id="media-upload"
          />
          <label
            htmlFor="media-upload"
            className={`dashboard-btn cursor-pointer inline-block ${uploading ? 'opacity-50' : ''}`}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </label>
        </div>
      </div>

      {media.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-[#FFFFFF0F] rounded-[20px]">
          <p className="text-[#A7AABB]">No media files yet. Upload your first file.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <div key={item.id} className="border border-[#FFFFFF0F] rounded-[20px] overflow-hidden group relative bg-[#0A0A0A]">
              {item.mimeType.startsWith('image/') ? (
                <img src={item.url} alt={item.filename} className="w-full h-32 object-cover" />
              ) : (
                <div className="w-full h-32 flex items-center justify-center bg-[#060606]">
                  <span className="text-[#A7AABB] text-sm">{item.mimeType}</span>
                </div>
              )}
              <div className="p-2">
                <p className="text-xs truncate text-white">{item.filename}</p>
                <button
                  onClick={() => deleteMediaItem(item.id)}
                  className="text-[rgb(230,87,87)] text-xs hover:underline mt-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
