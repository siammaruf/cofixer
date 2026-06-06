import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { fetchTeamMembers, updateTeamMember } from "~/redux/features/cmsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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

const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  bio: z.string().optional(),
  image: z.string().url("Invalid URL").or(z.literal("")).optional(),
  twitter: z.string().url("Invalid URL").or(z.literal("")).optional(),
  linkedin: z.string().url("Invalid URL").or(z.literal("")).optional(),
  github: z.string().url("Invalid URL").or(z.literal("")).optional(),
});

type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

export default function EditTeamMember() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { teamMembers, loading, error } = useAppSelector((state) => state.cms);

  const member = teamMembers.find((m) => m.id === id);

  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      role: "",
      bio: "",
      image: "",
      twitter: "",
      linkedin: "",
      github: "",
    },
  });

  useEffect(() => {
    if (member) {
      form.reset({
        name: member.name,
        role: member.role,
        bio: member.bio || "",
        image: member.image || "",
        twitter: member.socialLinks?.twitter || "",
        linkedin: member.socialLinks?.linkedin || "",
        github: member.socialLinks?.github || "",
      });
    }
  }, [member, form]);

  useEffect(() => {
    if (teamMembers.length === 0) {
      dispatch(fetchTeamMembers());
    }
  }, [dispatch, teamMembers.length]);

  const onSubmit = async (data: TeamMemberFormData) => {
    if (!id) return;
    try {
      await dispatch(updateTeamMember({ id, data })).unwrap();
      navigate("/admin/team");
    } catch {
      // Error is already in Redux state
    }
  };

  if (!member && teamMembers.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading team member...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
            <Link to="/admin/team">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Team
            </Link>
          </Button>
        </div>
        <div className="text-center py-16">
          <p className="text-destructive font-medium mb-2">Team member not found</p>
          <Button asChild><Link to="/admin/team">Back to Team</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
          <Link to="/admin/team">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Team
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-black">Edit Team Member</h1>
        <p className="text-black/70 mt-1">Update team member details</p>
      </div>

      <Card className="bg-card border-border max-w-2xl">
        <CardHeader>
          <CardTitle className="text-black">Team Member Details</CardTitle>
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
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input placeholder="Full name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl><Input placeholder="e.g., AI Engineer" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="image" render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl><Textarea placeholder="Short bio..." rows={4} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField control={form.control} name="twitter" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl><Input placeholder="https://twitter.com/..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="linkedin" render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="github" render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex items-center gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Member"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/admin/team">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
