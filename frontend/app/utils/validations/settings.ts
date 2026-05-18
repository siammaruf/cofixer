import { z } from 'zod';

export const generalSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required').max(100, 'Site name must be less than 100 characters'),
  siteDescription: z.string().max(500, 'Description must be less than 500 characters').optional(),
  siteUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  adminEmail: z.string().email('Please enter a valid email address').or(z.literal('')).optional(),
});

export const appearanceSettingsSchema = z.object({
  logoUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  faviconUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  themeColor: z.string().max(20, 'Invalid color value').optional(),
  accentColor: z.string().max(20, 'Invalid color value').optional(),
});

export const socialSettingsSchema = z.object({
  facebookUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  twitterUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  instagramUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  linkedinUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  githubUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
});

export const analyticsSettingsSchema = z.object({
  googleAnalyticsId: z.string().max(50, 'Invalid ID format').optional(),
  googleTagManagerId: z.string().max(50, 'Invalid ID format').optional(),
  facebookPixelId: z.string().max(50, 'Invalid ID format').optional(),
});

export type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>;
export type AppearanceSettingsFormData = z.infer<typeof appearanceSettingsSchema>;
export type SocialSettingsFormData = z.infer<typeof socialSettingsSchema>;
export type AnalyticsSettingsFormData = z.infer<typeof analyticsSettingsSchema>;
