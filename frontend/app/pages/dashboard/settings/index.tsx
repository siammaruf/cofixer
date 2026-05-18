import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '~/redux/store/hooks';
import {
  fetchSiteSettings,
  updateSiteSettings,
} from '~/redux/features/cmsSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '~/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  generalSettingsSchema,
  appearanceSettingsSchema,
  socialSettingsSchema,
  analyticsSettingsSchema,
  type GeneralSettingsFormData,
  type AppearanceSettingsFormData,
  type SocialSettingsFormData,
  type AnalyticsSettingsFormData,
} from '~/utils/validations/settings';
import { Settings, Palette, Share2, BarChart3, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router';

interface TabFormProps<T> {
  defaultValues: T;
  isSaving: boolean;
  onSave: (data: T) => void;
  saveError: string | null;
  saveSuccess: boolean;
}

function GeneralTab({ defaultValues, isSaving, onSave, saveError, saveSuccess }: TabFormProps<GeneralSettingsFormData>) {
  const form = useForm<GeneralSettingsFormData>({ resolver: zodResolver(generalSettingsSchema), defaultValues, mode: 'onChange' });
  useEffect(() => { form.reset(defaultValues); }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        {saveError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">{saveError}</p>
          </div>
        )}
        {saveSuccess && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-sm text-emerald-700 font-medium">Settings saved successfully</p>
          </div>
        )}
        <FormField control={form.control} name="siteName" render={({ field }) => (
          <FormItem>
            <FormLabel>Site Name</FormLabel>
            <FormControl><Input placeholder="My Awesome Site" {...field} /></FormControl>
            <FormDescription>The name of your website displayed across the site.</FormDescription>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="siteDescription" render={({ field }) => (
          <FormItem>
            <FormLabel>Site Description</FormLabel>
            <FormControl><Textarea placeholder="A brief description of your website..." rows={3} {...field} value={field.value ?? ''} /></FormControl>
            <FormDescription>Used for SEO meta descriptions and social sharing.</FormDescription>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField control={form.control} name="siteUrl" render={({ field }) => (
            <FormItem>
              <FormLabel>Site URL</FormLabel>
              <FormControl><Input placeholder="https://example.com" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="adminEmail" render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Email</FormLabel>
              <FormControl><Input type="email" placeholder="admin@example.com" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}

function AppearanceTab({ defaultValues, isSaving, onSave, saveError, saveSuccess }: TabFormProps<AppearanceSettingsFormData>) {
  const form = useForm<AppearanceSettingsFormData>({ resolver: zodResolver(appearanceSettingsSchema), defaultValues, mode: 'onChange' });
  useEffect(() => { form.reset(defaultValues); }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        {saveError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">{saveError}</p>
          </div>
        )}
        {saveSuccess && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-sm text-emerald-700 font-medium">Settings saved successfully</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField control={form.control} name="logoUrl" render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl><Input placeholder="https://example.com/logo.png" {...field} value={field.value ?? ''} /></FormControl>
              <FormDescription>URL to your site logo image.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="faviconUrl" render={({ field }) => (
            <FormItem>
              <FormLabel>Favicon URL</FormLabel>
              <FormControl><Input placeholder="https://example.com/favicon.ico" {...field} value={field.value ?? ''} /></FormControl>
              <FormDescription>URL to your site favicon.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField control={form.control} name="themeColor" render={({ field }) => (
            <FormItem>
              <FormLabel>Theme Color</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input placeholder="#3B82F6" {...field} value={field.value ?? ''} className="flex-1" />
                  <input type="color" value={field.value || '#3B82F6'} onChange={(e) => field.onChange(e.target.value)} className="h-10 w-10 rounded-xl border border-input bg-card cursor-pointer" />
                </div>
              </FormControl>
              <FormDescription>Primary theme color for the site.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="accentColor" render={({ field }) => (
            <FormItem>
              <FormLabel>Accent Color</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input placeholder="#F59E0B" {...field} value={field.value ?? ''} className="flex-1" />
                  <input type="color" value={field.value || '#F59E0B'} onChange={(e) => field.onChange(e.target.value)} className="h-10 w-10 rounded-xl border border-input bg-card cursor-pointer" />
                </div>
              </FormControl>
              <FormDescription>Accent color for highlights and CTAs.</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}

function SocialTab({ defaultValues, isSaving, onSave, saveError, saveSuccess }: TabFormProps<SocialSettingsFormData>) {
  const form = useForm<SocialSettingsFormData>({ resolver: zodResolver(socialSettingsSchema), defaultValues, mode: 'onChange' });
  useEffect(() => { form.reset(defaultValues); }, [defaultValues, form]);

  const socialFields: { name: keyof SocialSettingsFormData; label: string; placeholder: string; description: string }[] = [
    { name: 'facebookUrl', label: 'Facebook URL', placeholder: 'https://facebook.com/yourpage', description: 'Link to your Facebook page.' },
    { name: 'twitterUrl', label: 'Twitter / X URL', placeholder: 'https://twitter.com/yourhandle', description: 'Link to your Twitter/X profile.' },
    { name: 'instagramUrl', label: 'Instagram URL', placeholder: 'https://instagram.com/yourprofile', description: 'Link to your Instagram profile.' },
    { name: 'linkedinUrl', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/yourcompany', description: 'Link to your LinkedIn page.' },
    { name: 'githubUrl', label: 'GitHub URL', placeholder: 'https://github.com/yourorg', description: 'Link to your GitHub organization.' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        {saveError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">{saveError}</p>
          </div>
        )}
        {saveSuccess && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-sm text-emerald-700 font-medium">Settings saved successfully</p>
          </div>
        )}
        {socialFields.map(({ name, label, placeholder, description }) => (
          <FormField key={name} control={form.control} name={name} render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl><Input placeholder={placeholder} {...field} value={field.value ?? ''} /></FormControl>
              <FormDescription>{description}</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        ))}
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}

function AnalyticsTab({ defaultValues, isSaving, onSave, saveError, saveSuccess }: TabFormProps<AnalyticsSettingsFormData>) {
  const form = useForm<AnalyticsSettingsFormData>({ resolver: zodResolver(analyticsSettingsSchema), defaultValues, mode: 'onChange' });
  useEffect(() => { form.reset(defaultValues); }, [defaultValues, form]);

  const analyticsFields: { name: keyof AnalyticsSettingsFormData; label: string; placeholder: string; description: string }[] = [
    { name: 'googleAnalyticsId', label: 'Google Analytics ID', placeholder: 'G-XXXXXXXXXX', description: 'Your Google Analytics measurement ID.' },
    { name: 'googleTagManagerId', label: 'Google Tag Manager ID', placeholder: 'GTM-XXXXXXX', description: 'Your Google Tag Manager container ID.' },
    { name: 'facebookPixelId', label: 'Facebook Pixel ID', placeholder: '123456789012345', description: 'Your Facebook Pixel ID for tracking.' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        {saveError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">{saveError}</p>
          </div>
        )}
        {saveSuccess && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-sm text-emerald-700 font-medium">Settings saved successfully</p>
          </div>
        )}
        {analyticsFields.map(({ name, label, placeholder, description }) => (
          <FormField key={name} control={form.control} name={name} render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl><Input placeholder={placeholder} {...field} value={field.value ?? ''} /></FormControl>
              <FormDescription>{description}</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        ))}
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}

export default function SettingsDashboard() {
  const dispatch = useAppDispatch();
  const { siteSettings, loading, error } = useAppSelector((state) => state.cms);
  const [searchParams, setSearchParams] = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const activeTab = searchParams.get('tab') || 'general';

  useEffect(() => { dispatch(fetchSiteSettings()); }, [dispatch]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const handleSaveGeneral = useCallback((data: GeneralSettingsFormData) => {
    setSaving(true); setSaveError(null); setSaveSuccess(false);
    dispatch(updateSiteSettings({ siteName: data.siteName })).unwrap()
      .then(() => { setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); })
      .catch((err: unknown) => { setSaveError(err instanceof Error ? err.message : 'Failed to save settings'); })
      .finally(() => { setSaving(false); });
  }, [dispatch]);

  const handleSaveAppearance = useCallback((data: AppearanceSettingsFormData) => {
    setSaving(true); setSaveError(null); setSaveSuccess(false);
    dispatch(updateSiteSettings({ logo: data.logoUrl || undefined, favicon: data.faviconUrl || undefined, themeColors: { primary: data.themeColor || undefined, accent: data.accentColor || undefined } })).unwrap()
      .then(() => { setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); })
      .catch((err: unknown) => { setSaveError(err instanceof Error ? err.message : 'Failed to save settings'); })
      .finally(() => { setSaving(false); });
  }, [dispatch]);

  const handleSaveSocial = useCallback((data: SocialSettingsFormData) => {
    setSaving(true); setSaveError(null); setSaveSuccess(false);
    dispatch(updateSiteSettings({ socialLinks: { twitter: data.twitterUrl || undefined, linkedin: data.linkedinUrl || undefined, github: data.githubUrl || undefined } })).unwrap()
      .then(() => { setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); })
      .catch((err: unknown) => { setSaveError(err instanceof Error ? err.message : 'Failed to save settings'); })
      .finally(() => { setSaving(false); });
  }, [dispatch]);

  const handleSaveAnalytics = useCallback((data: AnalyticsSettingsFormData) => {
    setSaving(true); setSaveError(null); setSaveSuccess(false);
    dispatch(updateSiteSettings({ googleAnalyticsId: data.googleAnalyticsId || undefined, googleTagManagerId: data.googleTagManagerId || undefined })).unwrap()
      .then(() => { setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); })
      .catch((err: unknown) => { setSaveError(err instanceof Error ? err.message : 'Failed to save settings'); })
      .finally(() => { setSaving(false); });
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-10 h-10 rounded-full border-4 border-muted border-t-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive font-medium">Error: {error}</p>
        <Button onClick={() => dispatch(fetchSiteSettings())} className="mt-4">Retry</Button>
      </div>
    );
  }

  const settings = siteSettings;
  const generalDefaults: GeneralSettingsFormData = { siteName: settings?.siteName ?? '', siteDescription: '', siteUrl: '', adminEmail: '' };
  const appearanceDefaults: AppearanceSettingsFormData = { logoUrl: settings?.logo ?? '', faviconUrl: settings?.favicon ?? '', themeColor: settings?.themeColors?.primary ?? '', accentColor: settings?.themeColors?.accent ?? '' };
  const socialDefaults: SocialSettingsFormData = { facebookUrl: '', twitterUrl: settings?.socialLinks?.twitter ?? '', instagramUrl: '', linkedinUrl: settings?.socialLinks?.linkedin ?? '', githubUrl: settings?.socialLinks?.github ?? '' };
  const analyticsDefaults: AnalyticsSettingsFormData = { googleAnalyticsId: settings?.googleAnalyticsId ?? '', googleTagManagerId: settings?.googleTagManagerId ?? '', facebookPixelId: '' };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>Site Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your website configuration, appearance, social links, and analytics.</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList className="grid w-full sm:w-auto grid-cols-2 lg:grid-cols-4 gap-2">
            <TabsTrigger value="general" className="gap-2"><Settings className="h-4 w-4" /><span className="hidden sm:inline">General</span></TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2"><Palette className="h-4 w-4" /><span className="hidden sm:inline">Appearance</span></TabsTrigger>
            <TabsTrigger value="social" className="gap-2"><Share2 className="h-4 w-4" /><span className="hidden sm:inline">Social</span></TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2"><BarChart3 className="h-4 w-4" /><span className="hidden sm:inline">Analytics</span></TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-muted-foreground" />General Settings</CardTitle>
              <CardDescription>Configure basic site information and contact details.</CardDescription>
            </CardHeader>
            <CardContent>
              <GeneralTab defaultValues={generalDefaults} isSaving={saving} onSave={handleSaveGeneral} saveError={saveError} saveSuccess={saveSuccess} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-muted-foreground" />Appearance Settings</CardTitle>
              <CardDescription>Customize your site logo, favicon, and color scheme.</CardDescription>
            </CardHeader>
            <CardContent>
              <AppearanceTab defaultValues={appearanceDefaults} isSaving={saving} onSave={handleSaveAppearance} saveError={saveError} saveSuccess={saveSuccess} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Share2 className="h-5 w-5 text-muted-foreground" />Social Media Links</CardTitle>
              <CardDescription>Add links to your social media profiles.</CardDescription>
            </CardHeader>
            <CardContent>
              <SocialTab defaultValues={socialDefaults} isSaving={saving} onSave={handleSaveSocial} saveError={saveError} saveSuccess={saveSuccess} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-muted-foreground" />Analytics & Tracking</CardTitle>
              <CardDescription>Configure analytics and tracking scripts for your site.</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsTab defaultValues={analyticsDefaults} isSaving={saving} onSave={handleSaveAnalytics} saveError={saveError} saveSuccess={saveSuccess} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
