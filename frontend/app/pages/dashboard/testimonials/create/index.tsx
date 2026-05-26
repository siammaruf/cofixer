import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { createTestimonial } from "~/redux/features/cmsSlice";
import {
  createTestimonialSchema,
  type CreateTestimonialFormData,
} from "~/utils/validations/testimonial";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { LoadingOverlay } from "~/components/ui/loading-overlay";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ArrowLeft, Star } from "lucide-react";

export default function CreateTestimonial() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.cms);

  const form = useForm<CreateTestimonialFormData>({
    resolver: zodResolver(createTestimonialSchema),
    defaultValues: {
      clientName: "",
      clientRole: "",
      company: "",
      content: "",
      rating: 5,
      image: "",
      featured: false,
      isActive: true,
    },
  });

  const onSubmit = async (data: CreateTestimonialFormData) => {
    const result = await dispatch(
      createTestimonial({
        clientName: data.clientName,
        clientRole: data.clientRole,
        company: data.company,
        content: data.content,
        rating: data.rating,
        image: data.image || undefined,
        featured: data.featured,
        isActive: data.isActive,
      })
    );

    if (createTestimonial.fulfilled.match(result)) {
      navigate("/admin/testimonials");
    }
  };

  const rating = form.watch("rating");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Link to="/admin/testimonials">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h2 className="dashboard-section-title">Add New Testimonial</h2>
          <p className="text-muted-foreground">
            Create a new client testimonial for your website
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-black">Testimonial Information</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingOverlay isLoading={loading} message="Creating testimonial...">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {error && (
                  <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Client Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter client name"
                            className="rounded-xl border-border bg-muted text-foreground placeholder:text-muted-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Client Role</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. CEO, Manager"
                            className="rounded-xl border-border bg-muted text-foreground placeholder:text-muted-foreground"
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
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Company</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter company name"
                          className="rounded-xl border-border bg-muted text-foreground placeholder:text-muted-foreground"
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
                      <FormLabel className="text-foreground">Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the testimonial content..."
                          rows={4}
                          className="rounded-xl border-border bg-muted text-foreground placeholder:text-muted-foreground resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Rating</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type="number"
                              min={1}
                              max={5}
                              className="rounded-xl border-border bg-muted text-foreground"
                              {...field}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                field.onChange(isNaN(val) ? 1 : Math.min(5, Math.max(1, val)));
                              }}
                              value={field.value ?? 5}
                            />
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/avatar.jpg"
                            className="rounded-xl border-border bg-muted text-foreground placeholder:text-muted-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-8">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-foreground">Featured</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-foreground">Active</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Link to="/admin/testimonials">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading} variant="gradient">
                    Create Testimonial
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
