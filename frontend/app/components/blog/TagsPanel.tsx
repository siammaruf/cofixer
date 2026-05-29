import { useState, useRef } from "react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { X, Tag } from "lucide-react";

interface TagsPanelProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagsPanel({ tags, onChange }: TagsPanelProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const normalized = raw.trim().toLowerCase();
    if (!normalized) return;
    if (tags.includes(normalized)) return;
    onChange([...tags, normalized]);
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className="flex flex-wrap gap-1.5 items-center min-h-[36px] rounded-xl border border-input bg-card px-3 py-1.5 transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 cursor-text"
        onClick={() => inputRef.current?.focus()}
        role="list"
        aria-label="Selected tags"
      >
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="gap-1 pr-1 cursor-default"
            role="listitem"
          >
            <Tag className="w-3 h-3" />
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="ml-0.5 rounded-sm hover:bg-muted p-0.5"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          className="flex-1 min-w-[80px] h-7 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder={tags.length === 0 ? "Add tags..." : ""}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(input)}
        />
      </div>
      <p className="text-xs text-muted-foreground">Press Enter or comma to add a tag</p>
    </div>
  );
}
