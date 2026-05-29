import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "~/components/ui/button";
import { cmsAdminService } from "~/services";
import { ImagePlus, X, Loader2, Library } from "lucide-react";
import MediaLibraryModal from "./MediaLibraryModal";

interface FeaturedImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
}

export default function FeaturedImageUploader({ value, onChange }: FeaturedImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
        setError("Only JPG, PNG, and WEBP images are allowed");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be smaller than 5MB");
        return;
      }

      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await cmsAdminService.uploadMedia(formData);
        if (res.data?.url) {
          onChange(res.data.url);
        }
      } catch (err: any) {
        setError(err?.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    disabled: uploading,
  });

  const handleRemove = () => {
    onChange("");
    setError(null);
  };

  const handleSelectFromLibrary = (url: string) => {
    onChange(url);
    setError(null);
  };

  if (value) {
    return (
      <div className="space-y-3">
        <div className="relative rounded-xl overflow-hidden border border-border bg-muted/30 aspect-video">
          <img
            src={value}
            alt="Featured"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
            aria-label="Remove featured image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => setMediaModalOpen(true)}
          >
            <Library className="w-3.5 h-3.5" />
            Replace Image
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
          >
            Remove
          </Button>
        </div>
        <MediaLibraryModal
          open={mediaModalOpen}
          onOpenChange={setMediaModalOpen}
          onSelect={handleSelectFromLibrary}
          acceptTypes={["image"]}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"}
          ${uploading ? "pointer-events-none opacity-70" : ""}
        `}
        role="button"
        aria-label="Upload featured image"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            (e.target as HTMLElement).click();
          }
        }}
      >
        <input {...getInputProps()} aria-label="Featured image upload" />
        {uploading ? (
          <div className="space-y-2">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <ImagePlus className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              {isDragActive ? "Drop the image here" : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP up to 5MB</p>
          </div>
        )}
        {error && <p className="text-xs text-destructive mt-2">{error}</p>}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full gap-1.5"
        onClick={() => setMediaModalOpen(true)}
      >
        <Library className="w-3.5 h-3.5" />
        Select from Media Library
      </Button>
      <MediaLibraryModal
        open={mediaModalOpen}
        onOpenChange={setMediaModalOpen}
        onSelect={handleSelectFromLibrary}
        acceptTypes={["image"]}
      />
    </div>
  );
}
