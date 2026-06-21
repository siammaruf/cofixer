import { useState, useCallback, useEffect, useRef } from 'react'
import type { MediaItem } from '~/types/cms'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'
import { Copy, Download, Trash2, X, Check, FileImage, Video, FileText, File } from 'lucide-react'

interface MediaPreviewDialogProps {
  item: MediaItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (item: MediaItem) => void
  onSelect?: (item: MediaItem) => void
  selectLabel?: string
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return FileImage
  if (mimeType.startsWith('video/')) return Video
  if (mimeType.startsWith('application/pdf') || mimeType.includes('document') || mimeType.includes('text/')) return FileText
  return File
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
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function MediaPreviewDialog({
  item,
  open,
  onOpenChange,
  onDelete,
  onSelect,
  selectLabel = 'Select',
}: MediaPreviewDialogProps) {
  const [copied, setCopied] = useState(false)
  const [videoSrcAttempt, setVideoSrcAttempt] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setVideoSrcAttempt(0)
  }, [item?.id])

  const videoSrc =
    videoSrcAttempt === 0 && item?.largeUrl
      ? item.largeUrl
      : item?.url

  const handleCopyUrl = useCallback(async () => {
    if (!item) return
    try {
      await navigator.clipboard.writeText(item.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* Clipboard not available */ }
  }, [item])

  if (!item) return null

  const isImage = item.mimeType.startsWith('image/')
  const isVideo = item.mimeType.startsWith('video/')
  const Icon = getFileIcon(item.mimeType)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-1">
          <DialogTitle className="flex items-center gap-2 text-black text-lg">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            {item.originalName || item.filename}
          </DialogTitle>
        </DialogHeader>

        {/* Preview Area */}
        <div className={cn("flex-1 min-h-0 bg-muted/30 flex items-center justify-center", isVideo ? "p-0" : "p-4")}>
          {isImage ? (
            <img
              src={item.fullUrl || item.url}
              alt={item.originalName || item.filename}
              className="max-h-[50vh] max-w-full object-contain rounded-lg shadow-lg"
            />
          ) : isVideo ? (
            videoSrcAttempt >= 2 || !videoSrc ? (
              <div className="flex flex-col items-center gap-4 py-12 px-4">
                <Video className="size-20 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  This video cannot be played in the browser. It may be in an unsupported format or still processing.
                </p>
                <div className="flex items-center gap-2">
                  {item.largeUrl && (
                    <a href={item.largeUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="size-4" />
                        WebM
                      </Button>
                    </a>
                  )}
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="size-4" />
                      Original
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                key={item.id + videoSrcAttempt}
                src={videoSrc}
                poster={item.thumbUrl}
                controls
                playsInline
                muted
                autoPlay
                preload="metadata"
                className="w-full max-h-[50vh] rounded-lg shadow-lg"
                onError={() => setVideoSrcAttempt((prev) => prev + 1)}
              />
            )
          ) : (
            <div className="flex flex-col items-center gap-4 py-12">
              <Icon className="size-20 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Preview not available for this file type
              </p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                download={item.originalName || item.filename}
              >
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="size-4" />
                  Download File
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="px-6 py-3 space-y-2 border-t">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-0">File Name</p>
              <p className="font-medium truncate" title={item.filename}>{item.filename}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0">Type</p>
              <Badge variant="secondary" className="text-xs">
                {item.mimeType}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0">Size</p>
              <p className="font-medium">{formatFileSize(item.size)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0">Uploaded</p>
              <p className="font-medium">{formatDate(item.createdAt)}</p>
            </div>
          </div>

          <div className="pt-1">
            <p className="text-muted-foreground text-xs mb-0">URL</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-muted px-2 py-1.5 rounded truncate">
                {item.url}
              </code>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 shrink-0"
                onClick={handleCopyUrl}
              >
                <Copy className="size-3.5" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" className="h-9" onClick={() => onOpenChange(false)}>
              <X className="size-4 mr-1" />
              Close
            </Button>
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                className="h-9 gap-1.5"
                onClick={() => {
                  onDelete(item)
                  onOpenChange(false)
                }}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            )}
            {onSelect && (
              <Button
                size="sm"
                className="h-9 gap-1.5"
                onClick={() => {
                  onSelect(item)
                  onOpenChange(false)
                }}
              >
                <Check className="size-4" />
                {selectLabel}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
