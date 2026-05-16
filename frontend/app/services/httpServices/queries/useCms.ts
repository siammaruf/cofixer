import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cmsService } from '../cmsService'
import type {
  Service,
  Project,
  BlogPost,
  TeamMember,
  Testimonial,
  Faq,
  ContactMessage,
  SeoSettings,
  NavigationMenu,
  Stats,
  ContactFormData,
} from '~/types/cms'

// ─── Query Key Factories ───

export const cmsKeys = {
  all: ['cms'] as const,

  // Services
  services: () => [...cmsKeys.all, 'services'] as const,
  service: (slug: string) => [...cmsKeys.services(), 'detail', slug] as const,
  featuredServices: () => [...cmsKeys.services(), 'featured'] as const,

  // Projects
  projects: () => [...cmsKeys.all, 'projects'] as const,
  project: (slug: string) => [...cmsKeys.projects(), 'detail', slug] as const,
  featuredProjects: () => [...cmsKeys.projects(), 'featured'] as const,

  // Blog
  blogPosts: () => [...cmsKeys.all, 'blog'] as const,
  blogPost: (slug: string) => [...cmsKeys.blogPosts(), 'detail', slug] as const,

  // Team
  team: () => [...cmsKeys.all, 'team'] as const,
  teamMember: (id: string) => [...cmsKeys.team(), 'detail', id] as const,

  // Testimonials
  testimonials: () => [...cmsKeys.all, 'testimonials'] as const,

  // FAQs
  faqs: () => [...cmsKeys.all, 'faqs'] as const,

  // Stats
  stats: () => [...cmsKeys.all, 'stats'] as const,

  // SEO
  seo: (route: string) => [...cmsKeys.all, 'seo', route] as const,

  // Navigation
  navigation: () => [...cmsKeys.all, 'navigation'] as const,
}

// ─── Service Queries ───

export function useServices(opts?: { initialData?: Service[] }) {
  return useQuery({
    queryKey: cmsKeys.services(),
    queryFn: async () => {
      const response = await cmsService.getServices()
      return response.data
    },
    initialData: opts?.initialData,
  })
}

export function useService(slug: string, opts?: { initialData?: Service }) {
  return useQuery({
    queryKey: cmsKeys.service(slug),
    queryFn: async () => {
      const response = await cmsService.getService(slug)
      return response.data
    },
    enabled: Boolean(slug),
    initialData: opts?.initialData,
  })
}

export function useFeaturedServices(opts?: { initialData?: Service[] }) {
  return useQuery({
    queryKey: cmsKeys.featuredServices(),
    queryFn: async () => {
      const response = await cmsService.getFeaturedServices()
      return response.data
    },
    initialData: opts?.initialData,
  })
}

// ─── Project Queries ───

export function useProjects(opts?: { initialData?: Project[] }) {
  return useQuery({
    queryKey: cmsKeys.projects(),
    queryFn: async () => {
      const response = await cmsService.getProjects()
      return response.data
    },
    initialData: opts?.initialData,
  })
}

export function useProject(slug: string, opts?: { initialData?: Project }) {
  return useQuery({
    queryKey: cmsKeys.project(slug),
    queryFn: async () => {
      const response = await cmsService.getProject(slug)
      return response.data
    },
    enabled: Boolean(slug),
    initialData: opts?.initialData,
  })
}

export function useFeaturedProjects(opts?: { initialData?: Project[] }) {
  return useQuery({
    queryKey: cmsKeys.featuredProjects(),
    queryFn: async () => {
      const response = await cmsService.getFeaturedProjects()
      return response.data
    },
    initialData: opts?.initialData,
  })
}

// ─── Blog Queries ───

export function useBlogPosts(opts?: { initialData?: BlogPost[] }) {
  return useQuery({
    queryKey: cmsKeys.blogPosts(),
    queryFn: async () => {
      const response = await cmsService.getBlogPosts()
      return response.data
    },
    initialData: opts?.initialData,
  })
}

export function useBlogPost(slug: string, opts?: { initialData?: BlogPost }) {
  return useQuery({
    queryKey: cmsKeys.blogPost(slug),
    queryFn: async () => {
      const response = await cmsService.getBlogPost(slug)
      return response.data
    },
    enabled: Boolean(slug),
    initialData: opts?.initialData,
  })
}

// ─── Team Queries ───

export function useTeam(opts?: { initialData?: TeamMember[] }) {
  return useQuery({
    queryKey: cmsKeys.team(),
    queryFn: async () => {
      const response = await cmsService.getTeam()
      return response.data
    },
    initialData: opts?.initialData,
  })
}

export function useTeamMember(id: string, opts?: { initialData?: TeamMember }) {
  return useQuery({
    queryKey: cmsKeys.teamMember(id),
    queryFn: async () => {
      const response = await cmsService.getTeamMember(id)
      return response.data
    },
    enabled: Boolean(id),
    initialData: opts?.initialData,
  })
}

// ─── Testimonial Queries ───

export function useTestimonials(opts?: { initialData?: Testimonial[] }) {
  return useQuery({
    queryKey: cmsKeys.testimonials(),
    queryFn: async () => {
      const response = await cmsService.getTestimonials()
      return response.data
    },
    initialData: opts?.initialData,
  })
}

// ─── FAQ Queries ───

export function useFaqs(opts?: { initialData?: Faq[] }) {
  return useQuery({
    queryKey: cmsKeys.faqs(),
    queryFn: async () => {
      const response = await cmsService.getFaqs()
      return response.data
    },
    initialData: opts?.initialData,
  })
}

// ─── Stats Queries ───

export function useStats(opts?: { initialData?: Stats }) {
  return useQuery({
    queryKey: cmsKeys.stats(),
    queryFn: async () => {
      const response = await cmsService.getStats()
      return response.data
    },
    initialData: opts?.initialData,
  })
}

// ─── SEO Queries ───

export function useSeoSettings(route: string, opts?: { initialData?: SeoSettings }) {
  return useQuery({
    queryKey: cmsKeys.seo(route),
    queryFn: async () => {
      const response = await cmsService.getSeoSettings(route)
      return response.data
    },
    enabled: Boolean(route),
    initialData: opts?.initialData,
  })
}

// ─── Navigation Queries ───

export function useNavigation(opts?: { initialData?: NavigationMenu }) {
  return useQuery({
    queryKey: cmsKeys.navigation(),
    queryFn: async () => {
      const response = await cmsService.getNavigation()
      return response.data
    },
    initialData: opts?.initialData,
  })
}

// ─── Mutations ───

export function useSubmitContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await cmsService.submitContact(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.all })
    },
  })
}
