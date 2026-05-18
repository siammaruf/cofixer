import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function Profile() {
  return (
    <div className="space-y-6">
      <h2 className="dashboard-section-title">Profile</h2>
      <p className="text-muted-foreground">
        Manage your account settings and preferences
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">First Name</Label>
              <Input id="firstName" defaultValue="John" className="rounded-[20px] border-[#FFFFFF0F] bg-[#060606] text-white placeholder:text-[#A7AABB]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" className="rounded-[20px] border-[#FFFFFF0F] bg-[#060606] text-white placeholder:text-[#A7AABB]" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" className="rounded-[20px] border-[#FFFFFF0F] bg-[#060606] text-white placeholder:text-[#A7AABB]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">Phone Number</Label>
            <Input id="phone" defaultValue="+1 (555) 123-4567" className="rounded-[20px] border-[#FFFFFF0F] bg-[#060606] text-white placeholder:text-[#A7AABB]" />
          </div>

          <Button variant="gradient" className="mt-4">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
            <Input id="currentPassword" type="password" className="rounded-[20px] border-[#FFFFFF0F] bg-[#060606] text-white placeholder:text-[#A7AABB]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-white">New Password</Label>
            <Input id="newPassword" type="password" className="rounded-[20px] border-[#FFFFFF0F] bg-[#060606] text-white placeholder:text-[#A7AABB]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" className="rounded-[20px] border-[#FFFFFF0F] bg-[#060606] text-white placeholder:text-[#A7AABB]" />
          </div>

          <Button variant="gradient" className="mt-4">Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}