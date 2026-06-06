import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { fetchFaqs, updateFaq } from "~/redux/features/cmsSlice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ArrowLeft, Loader2 } from "lucide-react";

const faqSchema = z.object({
  question: z.string().min(1, "Question is required").max(500, "Question must be less than 500 characters"),
  answer: z.string().min(1, "Answer is required").max(5000, "Answer must be less than 5000 characters"),
  category: z.string().optional(),
  order: z.number().int().min(0),
  isActive: z.boolean(),
});

type FaqFormData = z.infer<typeof faqSchema>;

export default function EditFaq() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { faqs, loading, error } = useAppSelector((state) => state.cms);

  const faq = faqs.find((f) => f.id === id);

  const form = useForm<FaqFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "",
      order: 0,
      isActive: true,
    },
    mode: "onChange",
  });

  // Load FAQ data into form when available
  useEffect(() => {
    if (faq) {
      form.reset({
        question: faq.question,
        answer: faq.answer,
        category: faq.category || "",
        order: faq.order || 0,
        isActive: faq.isActive ?? true,
      });
    }
  }, [faq, form]);

  // Fetch FAQs if not loaded yet
  useEffect(() => {
    if (faqs.length === 0) {
      dispatch(fetchFaqs());
    }
  }, [dispatch, faqs.length]);

  const onSubmit = async (data: FaqFormData) => {
    if (!id) return;
    const result = await dispatch(updateFaq({ id, data }));
    if (updateFaq.fulfilled.match(result)) {
      navigate("/admin/faqs");
    }
  };

  if (!faq && faqs.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading FAQ...</p>
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
            <Link to="/admin/faqs">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to FAQs
            </Link>
          </Button>
        </div>
        <div className="text-center py-16">
          <p className="text-destructive font-medium mb-2">FAQ not found</p>
          <p className="text-muted-foreground text-sm mb-4">The FAQ you are trying to edit does not exist.</p>
          <Button asChild>
            <Link to="/admin/faqs">Back to FAQs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
          <Link to="/admin/faqs">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to FAQs
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-black">Edit FAQ</h1>
        <p className="text-black/70 mt-1">Update the frequently asked question</p>
      </div>

      <Card className="bg-card border-border max-w-2xl">
        <CardHeader>
          <CardTitle className="text-black">FAQ Details</CardTitle>
          <CardDescription>Update the question, answer, and optional category.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the FAQ question" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the FAQ answer"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Billing, General, Technical" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="accent-primary h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      Active
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-4 pt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update FAQ"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/admin/faqs">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
