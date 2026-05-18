import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '~/redux/store/hooks'
import { fetchMedia, uploadMedia, deleteMedia } from '~/redux/features/cmsSlice'
import type { MediaItem } from '~/types/cms'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { EmptyState } from '~/components/ui/empty-state'
import { SuspenseLoader } from '~/components/ui/suspense-loader'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'
import {
  Upload,
  Search,
  Trash2,
  Copy,
  FileImage,
  FileText,
  Video,
  File,
  X,
  AlertTriangle,
} from 'lucide-react'

type MediaFilter = 'all' | 'image' | 'document' | 'video'

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return FileImage
  if (mimeType.startsWith('video/')) return Video
  if (
    mimeType.startsWith('application/pdf') ||
    mimeType.startsWith('application/msword') ||
    mimeType.includes('document') ||
    mimeType.includes('text/')
  )
    return FileText
  return File
}

function getFileCategory(mimeType: string): MediaFilter {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  return 'document'
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '—'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface MediaCardProps {
  item: MediaItem
  onDelete: (item: MediaItem) => void
}

function MediaCard({ item, onDelete }: MediaCardProps) {
  const [copied, setCopied] = useState(false)
  const Icon = getFileIcon(item.mimeType)

  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(item.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard not available
    }
  }, [item.url])

  return (
    <div className="group relative rounded-[20px] border border-[#FFFFFF0F] bg-card overflow-hidden transition-all hover:border-white/20 hover:shadow-lg">
      {/* Thumbnail */}
      <div className="relative aspect-square bg-[#060606] flex items-center justify-center overflow-hidden">
        {item.mimeType.startsWith('image/') ? (
          <img
            src={item.url}
            alt={item.filename}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Icon className="size-12" />
            <span className="text-xs font-mono">{item.mimeType.split('/')[1]?.toUpperCase()}</span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <Badge
            variant="secondary"
            className="bg-black/60 text-white backdrop-blur-sm text-[10px] px-1.5 py-0 h-5"
          >
            {getFileCategory(item.mimeType)}
          </Badge>
        </div>

        {/* Hover actions overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="size-9 rounded-full"
            onClick={handleCopyUrl}
            aria-label="Copy URL"
          >
            <Copy className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="size-9 rounded-full"
            onClick={() => onDelete(item)}
            aria-label="Delete media"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <p className="text-sm font-medium text-foreground truncate" title={item.filename}>
          {item.filename}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatFileSize(item.size)}</span>
          <span>{formatDate(item.createdAt)}</span>
        </div>
      </div>

      {/* Copied toast */}
      {copied && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-3 py-1.5 rounded-full animate-in fade-in slide-in-from-bottom-2">
          URL copied!
        </div>
      )}
    </div>
  )
}

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const dispatch = useAppDispatch()
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
    }
  }, [])

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      await dispatch(uploadMedia(formData)).unwrap()
      setSelectedFile(null)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [selectedFile, dispatch, onOpenChange])

  const handleClose = useCallback(() => {
    setSelectedFile(null)
    setError(null)
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
          <DialogDescription>
            Upload images, documents, or videos to your media library.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop zone */}
          <div
            className={cn(
              'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
              dragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground/50',
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Drop files here or click to browse"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,video/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
            />

            {selectedFile ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-foreground">
                  <File className="size-5" />
                  <span className="font-medium text-sm">{selectedFile.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFile(null)
                  }}
                >
                  <X className="size-3 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="size-10 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Drop files here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Images, videos, documents up to 50MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteDialogProps {
  item: MediaItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

function DeleteDialog({ item, open, onOpenChange, onConfirm }: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false)

  const handleConfirm = useCallback(async () => {
    if (!item) return
    setDeleting(true)
    try {
      await onConfirm()
    } finally {
      setDeleting(false)
    }
  }, [item, onConfirm])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="mx-auto size-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <AlertTriangle className="size-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">Delete Media</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">{item?.filename}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function MediaDashboard() {
  const dispatch = useAppDispatch()
  const { media, loading, error } = useAppSelector((state) => state.cms)

  const [filter, setFilter] = useState<MediaFilter>('all')
  const [search, setSearch] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<MediaItem | null>(null)

  useEffect(() => {
    dispatch(fetchMedia())
  }, [dispatch])

  const handleDelete = useCallback(
    async (item: MediaItem) => {
      setDeleteItem(item)
    },
    [],
  )

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteItem) return
    try {
      await dispatch(deleteMedia(deleteItem.id)).unwrap()
      setDeleteItem(null)
    } catch {
      // Error is in Redux state
    }
  }, [deleteItem, dispatch])

  const filteredMedia = media.filter((item) => {
    const matchesFilter =
      filter === 'all' || getFileCategory(item.mimeType) === filter
    const matchesSearch =
      !search || item.filename.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your images, documents, and videos
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="size-4" />
          Upload Media
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter tabs */}
        <Tabs value={filter} onValueChange={(v: string) => setFilter(v as MediaFilter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {loading ? (
        <SuspenseLoader size="lg" message="Loading media files..." />
      ) : error ? (
        <div className="text-center py-8 space-y-4">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={() => dispatch(fetchMedia())}>
            Retry
          </Button>
        </div>
      ) : filteredMedia.length === 0 ? (
        <EmptyState
          size="lg"
          title={search || filter !== 'all' ? 'No matching files' : 'No media files yet'}
          description={
            search || filter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Upload your first file to get started'
          }
          action={
            !search && filter === 'all' ? (
              <Button onClick={() => setUploadOpen(true)}>
                <Upload className="size-4" />
                Upload Media
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <MediaCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Upload dialog */}
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />

      {/* Delete confirmation dialog */}
      <DeleteDialog
        item={deleteItem}
        open={!!deleteItem}
        onOpenChange={(open) => {
          if (!open) setDeleteItem(null)
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
