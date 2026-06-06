import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { createProject } from "~/redux/features/cmsSlice";
import ProjectForm, { type ProjectFormValues } from "~/components/projects/ProjectForm";

export default function CreateProject() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.cms);

  const handleSubmit = async (values: ProjectFormValues) => {
    const result = await dispatch(
      createProject({
        title: values.title,
        slug: values.slug,
        description: values.description || undefined,
        featuredImage: values.imageUrl || undefined,
        imageUrl: values.imageUrl || undefined,
        techStack: values.techStack,
        featured: values.featured,
        isActive: true,
        images: values.imageUrl ? [values.imageUrl] : [],
        metaTitle: values.metaTitle || undefined,
        metaDescription: values.metaDescription || undefined,
        metaKeywords: values.metaKeywords || undefined,
        ogImage: values.ogImage || undefined,
        canonicalUrl: values.canonicalUrl || undefined,
        robotsMeta: values.robotsMeta || undefined,
      })
    );

    if (createProject.fulfilled.match(result)) {
      toast.success("Project created successfully!", {
        description: `"${values.title}" has been added to your portfolio.`,
      });
      navigate("/admin/projects");
    } else {
      toast.error("Failed to create project", {
        description: error || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <ProjectForm
      mode="create"
      onSubmit={handleSubmit}
      isSubmitting={loading}
      error={error}
    />
  );
}
