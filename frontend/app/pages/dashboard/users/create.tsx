import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { createUser } from "~/redux/features/userSlice";
import {
  createUserSchema,
  type CreateUserFormData,
} from "~/utils/validations/user";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { LoadingOverlay } from "~/components/ui/loading-overlay";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ArrowLeft } from "lucide-react";

export default function CreateUser() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.user);

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "",
      startDate: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: CreateUserFormData) => {
    const result = await dispatch(
      createUser({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        position: data.position,
        status: data.isActive ? "Active" : "Inactive",
        startDate: data.startDate,
      })
    );

    if (createUser.fulfilled.match(result)) {
      navigate("/admin/users");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/admin/users">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h2 className="dashboard-section-title">Add New User</h2>
          <p className="text-muted-foreground">
            Create a new user record in the system
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingOverlay isLoading={loading} message="Creating user...">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" className="rounded-xl border-border bg-muted text-foreground placeholder:text-muted-foreground" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" className="rounded-xl border-border bg-muted text-foreground placeholder:text-muted-foreground" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="user@example.com"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" className="rounded-xl border-border bg-muted text-foreground placeholder:text-muted-foreground" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Position</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Admin, Editor, Viewer" className="rounded-xl border-border bg-muted text-foreground placeholder:text-muted-foreground" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" className="rounded-xl border-border bg-muted text-foreground placeholder:text-muted-foreground" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-foreground">Active User</FormLabel>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Link to="/admin/users">
                    <Button type="button" variant="outline" className="rounded-lg border-border text-foreground hover:bg-muted">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading} variant="gradient">
                    Create User
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
