import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { BlogFormValues } from "./BlogForm";

interface SeoPanelProps {
  form: UseFormReturn<BlogFormValues>;
}

export default function SeoPanel({ form }: SeoPanelProps) {
  const metaTitle = form.watch("metaTitle") || "";
  const metaDescription = form.watch("metaDescription") || "";
  const ogImage = form.watch("ogImage") || "";

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="metaTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              <span>Meta Title</span>
              <span className={`text-xs ${metaTitle.length > 70 ? "text-destructive" : "text-muted-foreground"}`}>
                {metaTitle.length}/70
              </span>
            </FormLabel>
            <FormControl>
              <Input placeholder="SEO title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="metaDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              <span>Meta Description</span>
              <span className={`text-xs ${metaDescription.length > 160 ? "text-destructive" : "text-muted-foreground"}`}>
                {metaDescription.length}/160
              </span>
            </FormLabel>
            <FormControl>
              <Textarea placeholder="SEO description" rows={3} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="focusKeyword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Focus Keyword</FormLabel>
            <FormControl>
              <Input placeholder="Primary keyword" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="canonicalUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Canonical URL</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/blog/post-slug" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ogImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Open Graph Image URL</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/og-image.jpg" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {ogImage && (
        <div className="rounded-xl border border-border overflow-hidden aspect-video bg-muted/30">
          <img
            src={ogImage}
            alt="Open Graph preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}
