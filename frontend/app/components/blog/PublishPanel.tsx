import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "~/components/ui/form";
import { Badge } from "~/components/ui/badge";
import { Eye, EyeOff, Save, Globe, Loader2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { BlogFormValues } from "./BlogForm";

interface PublishPanelProps {
  form: UseFormReturn<BlogFormValues>;
  onSaveDraft: () => void;
  onPreview?: () => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
}

export default function PublishPanel({
  form,
  onSaveDraft,
  onPreview,
  isSubmitting,
  mode,
}: PublishPanelProps) {
  const isPublished = form.watch("isPublished");
  const publishedAt = form.watch("publishedAt");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant={isPublished ? "success" : "secondary"} className="gap-1">
          {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {isPublished ? "Published" : "Draft"}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {mode === "edit" ? "Updating" : "Creating"}
        </span>
      </div>

      <FormField
        control={form.control}
        name="isPublished"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-xl border border-border p-3">
            <div className="space-y-0.5">
              <FormLabel className="text-sm">Publish</FormLabel>
              <FormDescription className="text-xs mb-0">
                {field.value ? "Visible to public" : "Saved as draft"}
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Toggle publish status"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="publishedAt"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm flex items-center gap-1.5">
              Publish Date
            </FormLabel>
            <FormControl>
              <input
                type="datetime-local"
                className="w-full h-10 rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                value={
                  field.value
                    ? new Date(field.value).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val ? new Date(val).toISOString() : undefined);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          className="flex-1 gap-2 h-10"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          {isSubmitting
            ? isPublished
              ? "Publishing..."
              : "Saving..."
            : mode === "edit"
            ? "Update"
            : isPublished
            ? "Publish"
            : "Save"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 gap-2 h-10"
          onClick={onSaveDraft}
          disabled={isSubmitting}
        >
          <Save className="w-4 h-4" />
          Save as Draft
        </Button>
      </div>

      {onPreview && (
        <Button
          type="button"
          variant="ghost"
          className="w-full gap-2 h-10"
          onClick={onPreview}
        >
          <Eye className="w-4 h-4" />
          Preview
        </Button>
      )}
    </div>
  );
}
