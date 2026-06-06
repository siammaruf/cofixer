import { useState, useEffect } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Search, Plus, Wrench } from "lucide-react";

const DEFAULT_TECH_STACKS = [
  "React",
  "Vue.js",
  "Angular",
  "Next.js",
  "Node.js",
  "NestJS",
  "Express",
  "Python",
  "Django",
  "FastAPI",
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Redis",
  "AWS",
  "Docker",
  "Kubernetes",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "GraphQL",
  "REST API",
  "Prisma",
  "TypeORM",
  "Firebase",
  "Supabase",
  "Vercel",
  "Netlify",
  "GitHub Actions",
  "Jenkins",
  "Terraform",
  "Go",
  "Rust",
  "Java",
  "Spring Boot",
  "PHP",
  "Laravel",
  "Flutter",
  "React Native",
  "Swift",
  "Kotlin",
];

const STORAGE_KEY = "cofixer-custom-tech-stacks";

interface TechStackSelectorProps {
  selected: string[];
  onChange: (stacks: string[]) => void;
}

export default function TechStackSelector({ selected, onChange }: TechStackSelectorProps) {
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [customStacks, setCustomStacks] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCustomStacks(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const allStacks = [...new Set([...DEFAULT_TECH_STACKS, ...customStacks])].sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );

  const filtered = allStacks.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (stack: string) => {
    if (selected.includes(stack)) {
      onChange(selected.filter((s) => s !== stack));
    } else {
      onChange([...selected, stack]);
    }
  };

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (allStacks.includes(trimmed)) {
      if (!selected.includes(trimmed)) {
        onChange([...selected, trimmed]);
      }
      setNewName("");
      setShowCreate(false);
      return;
    }
    const updated = [...customStacks, trimmed];
    setCustomStacks(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    onChange([...selected, trimmed]);
    setNewName("");
    setShowCreate(false);
  };

  const removeSelected = (stack: string) => {
    onChange(selected.filter((s) => s !== stack));
  };

  return (
    <div className="space-y-3">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((stack) => (
            <Badge
              key={stack}
              variant="secondary"
              className="flex items-center gap-1 text-black cursor-default"
            >
              <Wrench className="h-3 w-3" />
              {stack}
              <button
                type="button"
                onClick={() => removeSelected(stack)}
                className="ml-0.5 rounded-sm hover:bg-muted p-0.5"
                aria-label={`Remove ${stack}`}
              >
                <span className="text-xs leading-none">×</span>
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search tech stacks..."
          className="pl-8 h-9 text-sm rounded-xl border-border bg-white text-black placeholder:text-black/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-h-48 overflow-y-auto space-y-1 pr-1 rounded-xl border border-border p-2 bg-white">
        {filtered.map((stack) => (
          <label
            key={stack}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <Checkbox
              checked={selected.includes(stack)}
              onCheckedChange={() => toggle(stack)}
              id={`tech-${stack}`}
            />
            <span className="text-sm text-black flex-1">{stack}</span>
          </label>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-black/50 text-center py-3">No tech stacks found</p>
        )}
      </div>

      {showCreate ? (
        <div className="flex gap-2">
          <Input
            placeholder="New tech stack name"
            className="h-9 text-sm rounded-xl border-border bg-white text-black placeholder:text-black/50"
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
          <Button type="button" size="sm" onClick={handleCreate} className="rounded-lg">
            Add
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full gap-1 text-black/60 hover:text-black hover:bg-black/5"
          onClick={() => setShowCreate(true)}
        >
          <Plus className="w-3.5 h-3.5" />
          Create new tech stack
        </Button>
      )}
    </div>
  );
}
