import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppDispatch, useAppSelector } from '~/redux/store/hooks'
import { getCurrentUser, updateProfile, changePassword, clearProfileUpdateState, clearPasswordChangeState } from '~/redux/features/authSlice'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { User, Mail, Shield, Edit3, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

// --- Validation Schemas ---

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  image: z.string().url('Invalid URL').optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').max(17, 'Password must be at most 17 characters'),
  confirmNewPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ['confirmNewPassword'],
})

type PasswordFormData = z.infer<typeof passwordSchema>

// --- Helper ---

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// --- Main Page ---

export default function Profile() {
  const dispatch = useAppDispatch()
  const { user, loading, profileUpdating, profileUpdateError, passwordChanging, passwordChangeError } =
    useAppSelector((state) => state.auth)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Fetch current user on mount
  useEffect(() => {
    dispatch(getCurrentUser())
  }, [dispatch])

  // --- Edit Profile Form ---
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      image: '',
    },
    mode: 'onChange',
  })

  // Reset form when user data loads or dialog opens
  useEffect(() => {
    if (user && editDialogOpen) {
      profileForm.reset({
        fullName: user.fullName ?? '',
        email: user.email ?? '',
        image: user.image ?? '',
      })
    }
  }, [user, editDialogOpen, profileForm])

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (!user?.id) return
    try {
      const result = await dispatch(
        updateProfile({
          id: user.id,
          data: {
            fullName: data.fullName,
            email: data.email,
            image: data.image || null,
          },
        })
      ).unwrap()
      if (result) {
        setSuccessMessage('Profile updated successfully')
        setEditDialogOpen(false)
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    } catch {
      // Error is in Redux state
    }
  }

  // --- Password Change Form ---
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    mode: 'onChange',
  })

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await dispatch(
        changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmNewPassword,
        })
      ).unwrap()
      setSuccessMessage('Password changed successfully')
      setPasswordDialogOpen(false)
      passwordForm.reset()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch {
      // Error is in Redux state
    }
  }

  // Clear states when dialogs close
  const handleEditDialogClose = () => {
    setEditDialogOpen(false)
    dispatch(clearProfileUpdateState())
  }

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false)
    dispatch(clearPasswordChangeState())
    passwordForm.reset()
  }

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative mx-auto mb-4" style={{ width: 48, height: 48 }}>
            <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin border-t-primary border-b-secondary" />
          </div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-2">Unable to load profile</p>
          <Button onClick={() => dispatch(getCurrentUser())}>Retry</Button>
        </div>
      </div>
    )
  }

  const initials = getInitials(user.fullName ?? 'User')

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information and security settings
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Profile Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-border">
                <AvatarImage src={user.image ?? undefined} alt={user.fullName} />
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl text-white">{user.fullName}</CardTitle>
                <CardDescription className="text-muted-foreground mt-1">{user.email}</CardDescription>
                {user.role && (
                  <span className="inline-flex items-center gap-1.5 mt-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Shield className="h-3 w-3" />
                    {user.role}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              className="shrink-0"
              onClick={() => setEditDialogOpen(true)}
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium text-white">{user.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Mail className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-white">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Shield className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-medium text-white capitalize">{user.role ?? 'User'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <CheckCircle2 className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-medium text-white">{user.isActive ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Security</CardTitle>
          <CardDescription>Manage your password and account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border border-border bg-background/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Shield className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Password</p>
                <p className="text-xs text-muted-foreground">Change your account password</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => setPasswordDialogOpen(true)}
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={handleEditDialogClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information below
            </DialogDescription>
          </DialogHeader>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/avatar.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {profileUpdateError && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {profileUpdateError}
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleEditDialogClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={profileUpdating || !profileForm.formState.isValid}>
                  {profileUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={handlePasswordDialogClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password
            </DialogDescription>
          </DialogHeader>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter current password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {passwordChangeError && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {passwordChangeError}
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handlePasswordDialogClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={passwordChanging || !passwordForm.formState.isValid}>
                  {passwordChanging ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
