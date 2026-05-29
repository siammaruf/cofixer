import { useState, useEffect, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { fetchMedia, uploadMedia } from "~/redux/features/cmsSlice";
import type { MediaItem } from "~/types/cms";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { EmptyState } from "~/components/ui/empty-state";
import { SuspenseLoader } from "~/components/ui/suspense-loader";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import {
  Upload,
  Search,
  FileImage,
  Video,
  File,
  X,
  Check,
} from "lucide-react";

type MediaFilter = "all" | "image" | "document" | "video";

function getFileCategory(mimeType: string): MediaFilter {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "document";
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "—";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface MediaLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  acceptTypes?: MediaFilter[];
}

export default function MediaLibraryModal({
  open,
  onOpenChange,
  onSelect,
  acceptTypes,
}: MediaLibraryModalProps) {
  const dispatch = useAppDispatch();
  const { media, loading } = useAppSelector((state) => state.cms);
  const [filter, setFilter] = useState<MediaFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      dispatch(fetchMedia());
      setSelectedItem(null);
      setSearch("");
      setFilter("all");
    }
  }, [open, dispatch]);

  const filteredMedia = useMemo(() => {
    let items = media;
    if (acceptTypes && acceptTypes.length > 0) {
      items = items.filter((item) => acceptTypes.includes(getFileCategory(item.mimeType)));
    }
    return items.filter((item) => {
      const matchesFilter = filter === "all" || getFileCategory(item.mimeType) === filter;
      const matchesSearch = !search || item.filename.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [media, filter, search, acceptTypes]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await dispatch(uploadMedia(formData)).unwrap();
      if (result && result.url) {
        onSelect(result.url);
        onOpenChange(false);
      }
    } catch (err: any) {
      setUploadError(err?.message || "Upload failed");
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  }, [dispatch, onSelect, onOpenChange]);

  const handleConfirm = () => {
    if (selectedItem) {
      onSelect(selectedItem.url);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <FileImage className="h-4 w-4 text-primary" />
            </div>
            Media Library
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-[34px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Tabs value={filter} onValueChange={(v: string) => setFilter(v as MediaFilter)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="image">Images</TabsTrigger>
                <TabsTrigger value="video">Videos</TabsTrigger>
                <TabsTrigger value="document">Docs</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => fileInputRef[1](null)}
            >
              <label className="flex items-center gap-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
                  onChange={handleFileSelect}
                />
              </label>
            </Button>
          </div>
        </div>

        {uploadError && (
          <p className="text-sm text-destructive mt-1">{uploadError}</p>
        )}

        <div className="mt-3 overflow-y-auto flex-1 min-h-[300px]">
          {loading || uploading ? (
            <div className="flex items-center justify-center py-16">
              <SuspenseLoader size="lg" message={uploading ? "Uploading..." : "Loading media..."} />
            </div>
          ) : filteredMedia.length === 0 ? (
            <EmptyState
              size="default"
              title={search || filter !== "all" ? "No matching files" : "No media files yet"}
              description={search || filter !== "all" ? "Try adjusting your search or filter" : "Upload your first file to get started"}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredMedia.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const isImage = item.mimeType.startsWith("image/");
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className={cn(
                      "relative rounded-xl border overflow-hidden transition-all text-left",
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 shadow-lg"
                        : "border-border/50 hover:border-primary/30 hover:shadow-md"
                    )}
                  >
                    <div className="relative aspect-square bg-muted/50 flex items-center justify-center overflow-hidden">
                      {isImage ? (
                        <img
                          src={item.url}
                          alt={item.filename}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          {item.mimeType.startsWith("video/") ? (
                            <Video className="w-10 h-10" />
                          ) : (
                            <File className="w-10 h-10" />
                          )}
                          <span className="text-[10px] font-mono uppercase">
                            {item.mimeType.split("/")[1]}
                          </span>
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="bg-foreground/60 text-white backdrop-blur-sm text-[10px] px-1.5 py-0.5 h-5 rounded-md">
                          {getFileCategory(item.mimeType)}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-2.5 space-y-0.5">
                      <p className="text-xs font-semibold text-foreground truncate" title={item.filename}>
                        {item.filename}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{formatFileSize(item.size)}</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 mt-3">
          <Button variant="outline" onClick={handleClose} className="h-9 text-sm">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedItem}
            className="h-9 text-sm"
          >
            Select Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
