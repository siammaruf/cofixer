import { useEffect, useMemo } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ArrowLeft, FileText, Settings } from "lucide-react";
import FroalaEditor from "./FroalaEditor";
import FeaturedImageUploader from "./FeaturedImageUploader";
import CategorySelector from "./CategorySelector";
import TagsPanel from "./TagsPanel";
import SeoPanel from "./SeoPanel";
import PublishPanel from "./PublishPanel";
import AuthorSelector from "./AuthorSelector";
import type { BlogPost, BlogCategory } from "~/types/cms";
import type { User as UserType } from "~/types/user";

const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title must be less than 200 characters"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(500, "Excerpt must be less than 500 characters").optional().or(z.literal("")),
  coverImage: z.string().optional().or(z.literal("")),
  categoryIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  authorName: z.string().max(100, "Author name must be less than 100 characters").optional().or(z.literal("")),
  isPublished: z.boolean().optional(),
  publishedAt: z.string().optional().or(z.literal("")),
  metaTitle: z.string().max(70, "Meta title must be less than 70 characters").optional().or(z.literal("")),
  metaDescription: z.string().max(160, "Meta description must be less than 160 characters").optional().or(z.literal("")),
  focusKeyword: z.string().optional().or(z.literal("")),
  canonicalUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  ogImage: z.string().optional().or(z.literal("")),
});

export type BlogFormValues = z.infer<typeof blogPostSchema>;

interface BlogFormProps {
  mode: "create" | "edit";
  initialData?: Partial<BlogPost>;
  categories: BlogCategory[];
  users?: UserType[];
  onSubmit: (values: BlogFormValues) => void;
  onSaveDraft?: (values: BlogFormValues) => void;
  onCreateCategory?: (name: string) => void;
  isSubmitting: boolean;
  error?: string | null;
}

export default function BlogForm({
  mode,
  initialData,
  categories,
  users = [],
  onSubmit,
  onSaveDraft,
  onCreateCategory,
  isSubmitting,
  error,
}: BlogFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      content: initialData?.content || "",
      excerpt: initialData?.excerpt || "",
      coverImage: initialData?.coverImage || "",
      categoryIds: initialData?.categories?.map((c) => c.id) || initialData?.categoryIds || [],
      tags: initialData?.tags || [],
      authorName: initialData?.authorName || "",
      isPublished: initialData?.isPublished ?? false,
      publishedAt: initialData?.publishedAt || undefined,
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      focusKeyword: "",
      canonicalUrl: initialData?.canonicalUrl || "",
      ogImage: initialData?.ogImage || "",
    }),
    [initialData]
  );

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      form.reset(defaultValues);
    }
  }, [initialData, defaultValues, form]);

  const generateSlug = () => {
    const title = form.getValues("title");
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  };

  const handleSaveDraft = () => {
    const values = form.getValues();
    if (onSaveDraft) {
      onSaveDraft({ ...values, isPublished: false });
    } else {
      onSubmit({ ...values, isPublished: false });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Link to="/admin/blog">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-[26px] font-bold text-black">
            {mode === "edit" ? "Edit Blog Post" : "New Blog Post"}
          </h1>
          <p className="text-muted-foreground mb-0">
            {mode === "edit" ? "Update your blog post" : "Create a new blog post for your website"}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-3 space-y-5">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <FileText className="h-5 w-5 text-primary" />
                    Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              placeholder="Enter post title"
                              className="text-lg font-semibold"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={generateSlug}
                            className="shrink-0"
                          >
                            Generate Slug
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="post-url-slug" {...field} />
                        </FormControl>
                        <FormDescription className="mb-0">
                          URL-friendly identifier (lowercase, hyphens only)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief summary of the post..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <FroalaEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Write your blog post content here..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* SEO Section - Moved below content */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Settings className="h-5 w-5 text-primary" />
                    SEO Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SeoPanel form={form} />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-6 lg:self-start">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-foreground">Publish</CardTitle>
                </CardHeader>
                <CardContent>
                  <PublishPanel
                    form={form}
                    onSaveDraft={handleSaveDraft}
                    isSubmitting={isSubmitting}
                    mode={mode}
                  />
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-foreground">Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FeaturedImageUploader
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-foreground">Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="authorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <AuthorSelector
                            users={users}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-foreground">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="categoryIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CategorySelector
                            categories={categories}
                            selectedIds={field.value || []}
                            onChange={field.onChange}
                            onCreateCategory={onCreateCategory}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-foreground">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <TagsPanel
                            tags={field.value || []}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
