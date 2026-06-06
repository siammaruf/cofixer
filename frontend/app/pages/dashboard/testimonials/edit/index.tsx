import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { fetchTestimonials, updateTestimonial } from "~/redux/features/cmsSlice";
import {
  createTestimonialSchema,
  type CreateTestimonialFormData,
} from "~/utils/validations/testimonial";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ArrowLeft, Star, Loader2 } from "lucide-react";

export default function EditTestimonial() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { testimonials, loading, error } = useAppSelector((state) => state.cms);

  const testimonial = testimonials.find((t) => t.id === id);

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

  useEffect(() => {
    if (testimonial) {
      form.reset({
        clientName: testimonial.clientName,
        clientRole: testimonial.clientRole || "",
        company: testimonial.company || "",
        content: testimonial.content,
        rating: testimonial.rating || 5,
        image: testimonial.image || "",
        featured: testimonial.featured || false,
        isActive: testimonial.isActive ?? true,
      });
    }
  }, [testimonial, form]);

  useEffect(() => {
    if (testimonials.length === 0) {
      dispatch(fetchTestimonials());
    }
  }, [dispatch, testimonials.length]);

  const onSubmit = async (data: CreateTestimonialFormData) => {
    if (!id) return;
    const result = await dispatch(updateTestimonial({ id, data }));
    if (updateTestimonial.fulfilled.match(result)) {
      navigate("/admin/testimonials");
    }
  };

  if (!testimonial && testimonials.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading testimonial...</p>
      </div>
    );
  }

  if (!testimonial) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
            <Link to="/admin/testimonials">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Testimonials
            </Link>
          </Button>
        </div>
        <div className="text-center py-16">
          <p className="text-destructive font-medium mb-2">Testimonial not found</p>
          <Button asChild><Link to="/admin/testimonials">Back to Testimonials</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
          <Link to="/admin/testimonials">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Testimonials
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-black">Edit Testimonial</h1>
        <p className="text-black/70 mt-1">Update testimonial details</p>
      </div>

      <Card className="bg-card border-border max-w-2xl">
        <CardHeader>
          <CardTitle className="text-black">Testimonial Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="clientName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="clientRole" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl><Input placeholder="CEO" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="company" render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl><Input placeholder="Company name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl><Textarea placeholder="Testimonial content..." rows={5} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="image" render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="rating" render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating ({field.value}/5)</FormLabel>
                  <FormControl>
                    <Input type="range" min={1} max={5} {...field} />
                  </FormControl>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < field.value ? "fill-primary text-primary" : "text-muted"}`} />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="space-y-4">
                <FormField control={form.control} name="featured" render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured</FormLabel>
                      <FormDescription>Show on homepage</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="isActive" render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>Make visible to users</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />
              </div>

              <div className="flex items-center gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Testimonial"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/admin/testimonials">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
