import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { cmsAdminService } from "~/services";
import { uploadMediaChunked } from "~/lib/chunked-upload";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "~/components/ui/button";

interface FroalaEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

let ReactQuillComponent: React.ComponentType<any> | null = null;

export default function FroalaEditor({ value, onChange, placeholder }: FroalaEditorProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const quillRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const mod = await import("react-quill-new");
        if (mounted) {
          ReactQuillComponent = mod.default;
          setLoaded(true);
        }
      } catch (e) {
        if (mounted) setError(true);
      }
    }
    if (!ReactQuillComponent) {
      load();
    } else {
      setLoaded(true);
    }
    return () => { mounted = false; };
  }, []);

  // Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/jpeg,image/png,image/webp,image/jpg");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB");
        return;
      }

      try {
        const result = await uploadMediaChunked(file);
        if (result.url && quillRef.current) {
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection(true);
          editor.insertEmbed(range.index, "image", result.url);
          editor.setSelection(range.index + 1);
        }
      } catch {
        alert("Image upload failed");
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ script: "sub" }, { script: "super" }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: {
      matchVisual: false,
    },
  }), [imageHandler]);

  const formats = useMemo(() => [
    "header",
    "bold", "italic", "underline", "strike",
    "color", "background",
    "align",
    "list",
    "indent",
    "script",
    "blockquote", "code-block",
    "link", "image", "video",
  ], []);

  const handleChange = (content: string) => {
    onChange(content);
  };

  if (error) {
    return (
      <textarea
        className="w-full min-h-[300px] rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Write your content here..."}
        rows={12}
      />
    );
  }

  if (!loaded || !ReactQuillComponent) {
    return (
      <div className="w-full min-h-[300px] rounded-xl border border-input bg-card flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-muted border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={`blog-editor ${isFullscreen ? "is-fullscreen" : ""}`}
    >
      <div className="relative">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="editor-fullscreen-btn h-8 w-8 rounded-lg"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
        <ReactQuillComponent
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder || "Write your content here..."}
          className="bg-card rounded-xl border border-input"
        />
      </div>
    </div>
  );
}
