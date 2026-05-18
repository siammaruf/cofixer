import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { createProject } from "~/redux/features/cmsSlice";
import {
  createProjectSchema,
  type CreateProjectFormData,
} from "~/utils/validations/project";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Badge } from "~/components/ui/badge";
import { LoadingOverlay } from "~/components/ui/loading-overlay";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ArrowLeft, X, Plus } from "lucide-react";
import { useState } from "react";

export default function CreateProject() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.cms);
  const [techInput, setTechInput] = useState("");

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      imageUrl: "",
      liveUrl: "",
      githubUrl: "",
      techStack: [],
      featured: false,
    },
  });

  const onSubmit = async (data: CreateProjectFormData) => {
    const result = await dispatch(
      createProject({
        title: data.title,
        slug: data.slug,
        description: data.description || undefined,
        featuredImage: data.imageUrl || undefined,
        imageUrl: data.imageUrl || undefined,
        liveUrl: data.liveUrl || undefined,
        githubUrl: data.githubUrl || undefined,
        techStack: data.techStack,
        featured: data.featured,
        isActive: true,
        images: data.imageUrl ? [data.imageUrl] : [],
      })
    );

    if (createProject.fulfilled.match(result)) {
      navigate("/admin/projects");
    }
  };

  const addTech = () => {
    const trimmed = techInput.trim();
    if (!trimmed) return;
    const current = form.getValues("techStack");
    if (current.includes(trimmed)) {
      setTechInput("");
      return;
    }
    form.setValue("techStack", [...current, trimmed]);
    setTechInput("");
  };

  const removeTech = (tech: string) => {
    const current = form.getValues("techStack");
    form.setValue("techStack", current.filter((t) => t !== tech));
  };

  const handleTechKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTech();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/admin/projects">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold text-foreground">Add New Project</h2>
          <p className="text-muted-foreground">
            Create a new project for your portfolio
          </p>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingOverlay isLoading={loading} message="Creating project...">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter project title"
                            className="rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground"
                            {...field}
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
                        <FormLabel className="text-foreground">Slug</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="project-slug"
                            className="rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground"
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the project..."
                          rows={4}
                          className="rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground"
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
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/image.jpg"
                            className="rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="liveUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Live URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com"
                            className="rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground"
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
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">GitHub URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/username/repo"
                          className="rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="techStack"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-foreground">Tech Stack</FormLabel>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a technology and press Enter"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={handleTechKeyDown}
                            className="rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={addTech}
                            className="rounded-lg border-border"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {form.getValues("techStack").length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {form.getValues("techStack").map((tech) => (
                              <Badge
                                key={tech}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {tech}
                                <button
                                  type="button"
                                  onClick={() => removeTech(tech)}
                                  className="ml-1 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-foreground">Featured Project</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Show this project prominently on the homepage
                        </p>
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

                <div className="flex justify-end space-x-4">
                  <Link to="/admin/projects">
                    <Button type="button" variant="outline" className="rounded-lg border-border text-foreground hover:bg-muted">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading}>
                    Create Project
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
