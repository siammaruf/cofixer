import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { LoadingOverlay } from "~/components/ui/loading-overlay";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ArrowLeft, FileText, Search } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";
import FroalaEditor from "~/components/blog/FroalaEditor";
import FeaturedImageUploader from "~/components/blog/FeaturedImageUploader";
import TechStackSelector from "./TechStackSelector";
import type { Project } from "~/types/cms";

const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional().or(z.literal("")),
  imageUrl: z.string().optional().or(z.literal("")),
  techStack: z.array(z.string()),
  featured: z.boolean(),
  metaTitle: z.string().max(70, "Meta title must be less than 70 characters").optional().or(z.literal("")),
  metaDescription: z.string().max(160, "Meta description must be less than 160 characters").optional().or(z.literal("")),
  metaKeywords: z.string().optional().or(z.literal("")),
  ogImage: z.string().optional().or(z.literal("")),
  canonicalUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  robotsMeta: z.string().optional().or(z.literal("")),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Project>;
  onSubmit: (values: ProjectFormValues) => void;
  isSubmitting: boolean;
  error?: string | null;
}

export default function ProjectForm({
  mode,
  initialData,
  onSubmit,
  isSubmitting,
  error,
}: ProjectFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      imageUrl: initialData?.featuredImage || initialData?.imageUrl || "",
      techStack: initialData?.techStack || [],
      featured: initialData?.featured || false,
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      metaKeywords: initialData?.metaKeywords || "",
      ogImage: initialData?.ogImage || "",
      canonicalUrl: initialData?.canonicalUrl || "",
      robotsMeta: initialData?.robotsMeta || "",
    }),
    [initialData]
  );

  // DEBUG: log what the form receives
  useEffect(() => {
    console.log("[ProjectForm] initialData:", initialData);
    console.log("[ProjectForm] defaultValues:", defaultValues);
  }, [initialData, defaultValues]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      form.reset(defaultValues);
    }
  }, [initialData, defaultValues, form]);

  const slugEditedByUser = useRef(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("title", value, { shouldValidate: true });
    if (!slugEditedByUser.current) {
      const generated = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      form.setValue("slug", generated, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Link to="/admin/projects">
          <Button variant="ghost" size="sm" className="gap-1 text-black/70 hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-black">
            {mode === "edit" ? "Edit Project" : "Add New Project"}
          </h1>
          <p className="text-black/60 !mb-0">
            {mode === "edit" ? "Update project details" : "Create a new project for your portfolio"}
          </p>
        </div>
      </div>

      <Card className="bg-white border-border !mt-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <FileText className="h-5 w-5 text-primary" />
            Project Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingOverlay isLoading={isSubmitting} message={mode === "edit" ? "Updating project..." : "Creating project..."}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {error && (
                  <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter project title"
                            className="rounded-xl border-border bg-white text-black placeholder:text-black/50"
                            value={field.value}
                            onChange={handleTitleChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center !mb-0">
                          <FormLabel className="text-black">Slug</FormLabel>
                          <FormDescription className="text-black/60 text-xs">(URL-friendly identifier, lowercase, hyphens only)</FormDescription>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="project-slug"
                            className="rounded-xl border-border bg-white text-black placeholder:text-black/50"
                            {...field}
                            onChange={(e) => {
                              slugEditedByUser.current = true;
                              field.onChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Description</FormLabel>
                      <FormControl>
                        <div className="black-text-editor">
                          <FroalaEditor
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Describe the project..."
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel className="text-black">Featured Image</FormLabel>
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

                  <div className="md:col-span-2 space-y-4">
                    <FormField
                      control={form.control}
                      name="techStack"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Tech Stack</FormLabel>
                          <FormControl>
                            <TechStackSelector
                              selected={field.value || []}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-white">
                          <div className="space-y-0.5">
                            <FormLabel className="text-black">Featured Project</FormLabel>
                            <FormDescription className="text-black/60">
                              Show this project prominently on the homepage
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* SEO Settings */}
                <div className="rounded-xl border border-border bg-white p-3 space-y-3">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-border">
                    <Search className="h-3.5 w-3.5 text-primary" />
                    <h3 className="text-sm font-semibold text-black">SEO Settings</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="metaTitle"
                      render={({ field }) => {
                        const len = (field.value || "").length;
                        return (
                          <FormItem>
                            <FormLabel className="flex items-center justify-between text-black">
                              <span>Meta Title</span>
                              <span className={`text-xs ${len > 70 ? "text-destructive" : "text-black/50"}`}>
                                {len}/70
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="SEO title"
                                className="rounded-xl border-border bg-white text-black placeholder:text-black/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="canonicalUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Canonical URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/projects/project-slug"
                              className="rounded-xl border-border bg-white text-black placeholder:text-black/50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => {
                      const len = (field.value || "").length;
                      return (
                        <FormItem>
                          <FormLabel className="flex items-center justify-between text-black">
                            <span>Meta Description</span>
                            <span className={`text-xs ${len > 160 ? "text-destructive" : "text-black/50"}`}>
                              {len}/160
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="SEO description"
                              rows={2}
                              className="rounded-xl border-border bg-white text-black placeholder:text-black/50 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="metaKeywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Meta Keywords</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="React, Node.js, PostgreSQL"
                              className="rounded-xl border-border bg-white text-black placeholder:text-black/50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="robotsMeta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Robots Meta</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="index, follow"
                              className="rounded-xl border-border bg-white text-black placeholder:text-black/50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="ogImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">Open Graph Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/og-image.jpg"
                            className="rounded-xl border-border bg-white text-black placeholder:text-black/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("ogImage") && (
                    <div className="rounded-xl border border-border overflow-hidden aspect-video bg-muted/30">
                      <img
                        src={form.watch("ogImage")}
                        alt="Open Graph preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <Link to="/admin/projects">
                    <Button type="button" variant="outline" className="text-black">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? mode === "edit" ? "Updating..." : "Creating..."
                      : mode === "edit" ? "Update Project" : "Create Project"}
                  </Button>
                </div>
              </form>
            </Form>
          </LoadingOverlay>
        </CardContent>
      </Card>
    </div>
  );
}
