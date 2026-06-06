import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { fetchProjects, updateProject, clearError } from "~/redux/features/cmsSlice";
import { cmsAdminService } from "~/services";
import ProjectForm, { type ProjectFormValues } from "~/components/projects/ProjectForm";
import type { Project } from "~/types/cms";

export default function EditProject() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projects, loading, error } = useAppSelector((state) => state.cms);
  const [project, setProject] = useState<Project | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    dispatch(clearError());
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  useEffect(() => {
    async function loadProject() {
      if (!id) return;
      setFetchLoading(true);
      try {
        const res = await cmsAdminService.getProjectById(id);
        console.log("[EditProject] API raw response:", res);
        console.log("[EditProject] API res.data:", res.data);
        if (res.data) {
          setProject(res.data);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Failed to load project:", err);
        setNotFound(true);
      } finally {
        setFetchLoading(false);
      }
    }
    loadProject();
  }, [id]);

  const handleSubmit = async (values: ProjectFormValues) => {
    if (!id) return;
    const result = await dispatch(
      updateProject({
        id,
        data: {
          title: values.title,
          slug: values.slug,
          description: values.description || undefined,
          featuredImage: values.imageUrl || undefined,
          imageUrl: values.imageUrl || undefined,
          techStack: values.techStack,
          featured: values.featured,
          metaTitle: values.metaTitle || undefined,
          metaDescription: values.metaDescription || undefined,
          metaKeywords: values.metaKeywords || undefined,
          ogImage: values.ogImage || undefined,
          canonicalUrl: values.canonicalUrl || undefined,
          robotsMeta: values.robotsMeta || undefined,
        },
      })
    );
    if (updateProject.fulfilled.match(result)) {
      toast.success("Project updated successfully!", {
        description: `Changes to "${values.title}" have been saved.`,
      });
      navigate("/admin/projects");
    } else {
      toast.error("Failed to update project", {
        description: error || "Something went wrong. Please try again.",
      });
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full border-4 border-muted border-t-primary animate-spin" />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="space-y-5">
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-black mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-4">The project you are looking for does not exist.</p>
          <button
            onClick={() => navigate("/admin/projects")}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold transition-all rounded-full bg-primary text-white hover:bg-primary/90"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProjectForm
      mode="edit"
      initialData={project}
      onSubmit={handleSubmit}
      isSubmitting={loading}
      error={error}
    />
  );
}
