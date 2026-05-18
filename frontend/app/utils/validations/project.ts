import * as z from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  techStack: z.array(z.string()),
  featured: z.boolean(),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
