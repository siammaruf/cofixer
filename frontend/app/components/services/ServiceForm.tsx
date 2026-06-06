import { useEffect, useMemo, useRef, useState } from "react";
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
import { ArrowLeft, Wrench } from "lucide-react";
import FroalaEditor from "~/components/blog/FroalaEditor";
import type { Service } from "~/types/cms";

const serviceFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional().or(z.literal("")),
  shortDescription: z.string().optional().or(z.literal("")),
  icon: z.string().optional().or(z.literal("")),
  order: z.number().int().min(0),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Service>;
  onSubmit: (values: ServiceFormValues) => void;
  isSubmitting: boolean;
  error?: string | null;
}

export default function ServiceForm({
  mode,
  initialData,
  onSubmit,
  isSubmitting,
  error,
}: ServiceFormProps) {
  const defaultValues = useMemo(
    () => ({
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      shortDescription: initialData?.shortDescription || "",
      icon: initialData?.icon || "",
      order: initialData?.order ?? 0,
      featured: initialData?.featured ?? false,
      isActive: initialData?.isActive ?? true,
    }),
    [initialData]
  );

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
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
      <div className="flex items-center mb-2">
        <Link to="/admin/services">
          <Button variant="ghost" size="sm" className="gap-2 text-black/70 hover:text-black">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-black">
            {mode === "edit" ? "Edit Service" : "Add Service"}
          </h1>
          <p className="text-black/70 !mb-0">
            {mode === "edit" ? "Update service details" : "Create a new service for your business"}
          </p>
        </div>
      </div>

      <Card className="bg-white border-border !mt-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Wrench className="h-5 w-5 text-primary" />
            Service Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingOverlay isLoading={isSubmitting} message={mode === "edit" ? "Updating service..." : "Creating service..."}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {error && (
                  <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Web Development"
                            className="bg-white text-black placeholder:text-black/50"
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
                        <div className="flex items-center gap-2 !mb-0">
                          <FormLabel className="text-black">Slug</FormLabel>
                          <FormDescription className="text-black/60 text-xs">(URL-friendly identifier, lowercase, hyphens only)</FormDescription>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="web-development"
                            className="bg-white text-black placeholder:text-black/50"
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
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Short Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief summary of the service"
                          className="bg-white text-black placeholder:text-black/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            placeholder="Detailed description of the service..."
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">Icon</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Emoji or icon class"
                            className="bg-white text-black placeholder:text-black/50"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-black/60">
                          Emoji (e.g., 🔧) or icon class name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            className="bg-white text-black placeholder:text-black/50"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription className="text-black/60">
                          Display order (lower numbers appear first)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border border-border p-4 bg-white">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base text-black">Featured</FormLabel>
                          <FormDescription className="text-black/60">
                            Show this service in the featured section
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border border-border p-4 bg-white">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base text-black">Active</FormLabel>
                          <FormDescription className="text-black/60">
                            Make this service visible to users
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

      <div className="flex items-center gap-4 !mb-0">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? mode === "edit" ? "Updating..." : "Creating..."
                      : mode === "edit" ? "Update Service" : "Create Service"}
                  </Button>
                  <Link to="/admin/services">
                    <Button variant="outline" type="button" className="text-black">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </LoadingOverlay>
        </CardContent>
      </Card>
    </div>
  );
}
