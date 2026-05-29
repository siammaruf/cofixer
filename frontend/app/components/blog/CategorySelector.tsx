import { useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Search, Plus, Tag } from "lucide-react";
import type { BlogCategory } from "~/types/cms";

interface CategorySelectorProps {
  categories: BlogCategory[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onCreateCategory?: (name: string) => void;
}

export default function CategorySelector({
  categories,
  selectedIds,
  onChange,
  onCreateCategory,
}: CategorySelectorProps) {
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleCreate = () => {
    if (newName.trim() && onCreateCategory) {
      onCreateCategory(newName.trim());
      setNewName("");
      setShowCreate(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          className="pl-8 h-9 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
        {filtered.map((cat) => (
          <label
            key={cat.id}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <Checkbox
              checked={selectedIds.includes(cat.id)}
              onCheckedChange={() => toggle(cat.id)}
              id={`cat-${cat.id}`}
            />
            <span className="text-sm text-foreground flex-1">{cat.name}</span>
            <Badge variant="outline" className="text-[10px] h-5 px-1.5">
              {cat.postCount ?? 0}
            </Badge>
          </label>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-3">No categories found</p>
        )}
      </div>

      {showCreate ? (
        <div className="flex gap-2">
          <Input
            placeholder="New category name"
            className="h-9 text-sm"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
            }}
            autoFocus
          />
          <Button type="button" size="sm" onClick={handleCreate}>
            Add
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full gap-1 text-muted-foreground hover:text-foreground"
          onClick={() => setShowCreate(true)}
        >
          <Plus className="w-3.5 h-3.5" />
          Create new category
        </Button>
      )}
    </div>
  );
}
