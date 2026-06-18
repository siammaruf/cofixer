import { cmsAdminService } from '~/services/httpServices/cmsService'

const CHUNK_SIZE = 1024 * 1024 // 1MB chunks

function generateUploadId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export interface ChunkedUploadOptions {
  onProgress?: (progress: number) => void
  onStatus?: (status: string) => void
}

export interface ChunkedUploadResult {
  id: string
  url: string
  filename: string
  mimeType: string
  size: number
  createdAt: string
}

export async function uploadMediaChunked(
  file: File,
  options: ChunkedUploadOptions = {},
): Promise<ChunkedUploadResult> {
  if (!file || file.size === 0) {
    throw new Error('File is empty or invalid. Please select a valid file.')
  }

  const { onProgress, onStatus } = options
  const uploadId = generateUploadId()
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

  if (totalChunks < 1) {
    throw new Error('File is too small or empty.')
  }

  onStatus?.('uploading')

  // Upload chunks sequentially
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, file.size)
    const chunk = file.slice(start, end)

    const formData = new FormData()
    formData.append('file', chunk)
    formData.append('uploadId', uploadId)
    formData.append('chunkIndex', String(i))
    formData.append('totalChunks', String(totalChunks))

    await cmsAdminService.uploadChunk(formData)
    onProgress?.(Math.round(((i + 1) / totalChunks) * 50))
  }

  onStatus?.('processing')
  onProgress?.(60)

  // Signal completion
  await cmsAdminService.completeChunkUpload({
    uploadId,
    originalName: file.name,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
    totalChunks,
  })

  // Poll for status
  let completed = false
  let attempts = 0
  const maxAttempts = 120 // 120 seconds max

  while (!completed && attempts < maxAttempts) {
    await new Promise((r) => setTimeout(r, 1000))
    attempts++

    const statusRes = await cmsAdminService.getChunkStatus(uploadId)
    const status = statusRes.data

    if (status.status === 'completed') {
      completed = true
      onProgress?.(100)
      onStatus?.('completed')
      if (status.result) {
        return status.result
      }
      throw new Error('Upload completed but no result returned')
    } else if (status.status === 'failed') {
      throw new Error(status.error || 'Processing failed')
    } else {
      onProgress?.(60 + Math.min(40, Math.round((attempts / maxAttempts) * 40)))
    }
  }

  throw new Error('Upload timed out. Please check the media library later.')
}
