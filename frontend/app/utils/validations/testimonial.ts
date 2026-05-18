import * as z from "zod";

export const createTestimonialSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  clientRole: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  content: z.string().min(1, "Content is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  featured: z.boolean(),
  isActive: z.boolean(),
});

export type CreateTestimonialFormData = z.infer<typeof createTestimonialSchema>;

export const updateTestimonialSchema = createTestimonialSchema.partial().extend({
  id: z.string(),
});

export type UpdateTestimonialFormData = z.infer<typeof updateTestimonialSchema>;
