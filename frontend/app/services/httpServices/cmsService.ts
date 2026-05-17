import { get } from '../httpMethods/get'
import { post } from '../httpMethods/post'
import { put } from '../httpMethods/put'
import { patch } from '../httpMethods/patch'
import { del } from '../httpMethods/delete'
import type { ApiResponse, PaginatedApiResponse } from '~/types/api'
import type {
  Service,
  Project,
  BlogPost,
  TeamMember,
  Testimonial,
  Faq,
  ContactMessage,
  SeoSettings,
  SiteSettings,
  NavigationMenu,
  Stats,
  ContactFormData,
} from '~/types/cms'

const API_PREFIX = ''

// Public CMS APIs
export const cmsService = {
  // Services
  getServices: () => get<PaginatedApiResponse<Service>>(`${API_PREFIX}/services`),
  getService: (slug: string) => get<ApiResponse<Service>>(`${API_PREFIX}/services/${slug}`),
  getFeaturedServices: () => get<ApiResponse<Service[]>>(`${API_PREFIX}/services/featured`),

  // Projects
  getProjects: () => get<PaginatedApiResponse<Project>>(`${API_PREFIX}/projects`),
  getProject: (slug: string) => get<ApiResponse<Project>>(`${API_PREFIX}/projects/${slug}`),
  getFeaturedProjects: () => get<ApiResponse<Project[]>>(`${API_PREFIX}/projects/featured`),

  // Blog
  getBlogPosts: () => get<PaginatedApiResponse<BlogPost>>(`${API_PREFIX}/blog`),
  getBlogPost: (slug: string) => get<ApiResponse<BlogPost>>(`${API_PREFIX}/blog/${slug}`),

  // Team
  getTeam: () => get<PaginatedApiResponse<TeamMember>>(`${API_PREFIX}/team`),
  getTeamMember: (id: string) => get<ApiResponse<TeamMember>>(`${API_PREFIX}/team/${id}`),

  // Testimonials
  getTestimonials: () => get<PaginatedApiResponse<Testimonial>>(`${API_PREFIX}/testimonials`),

  // FAQs
  getFaqs: () => get<PaginatedApiResponse<Faq>>(`${API_PREFIX}/faqs`),

  // Contact
  submitContact: (data: ContactFormData) =>
    post<ApiResponse<ContactMessage>>(`${API_PREFIX}/contact`, data),

  // Stats
  getStats: () => get<ApiResponse<Stats>>(`${API_PREFIX}/stats`),

  // SEO
  getSeoSettings: (route: string) => get<ApiResponse<SeoSettings>>(`${API_PREFIX}/seo/page/${route}`),

  // Navigation
  getNavigation: () => get<ApiResponse<NavigationMenu>>(`${API_PREFIX}/navigation`),

  // Sitemap
  getSitemap: () => get<string>(`${API_PREFIX}/sitemap`, { responseType: 'text' }),

  // Robots.txt
  getRobotsTxt: () => get<string>(`${API_PREFIX}/robots-txt`, { responseType: 'text' }),
}

// Admin CMS APIs
export const cmsAdminService = {
  // Services
  getAllServices: () => get<PaginatedApiResponse<Service>>(`${API_PREFIX}/admin/services`),
  createService: (data: Partial<Service>) => post<ApiResponse<Service>>(`${API_PREFIX}/admin/services`, data),
  updateService: (id: string, data: Partial<Service>) => patch<ApiResponse<Service>>(`${API_PREFIX}/admin/services/${id}`, data),
  deleteService: (id: string) => del<ApiResponse<void>>(`${API_PREFIX}/admin/services/${id}`),
  toggleServiceFeatured: (id: string) => patch<ApiResponse<Service>>(`${API_PREFIX}/admin/services/${id}/feature`, {}),
  reorderServices: (ids: string[]) => post<ApiResponse<{ message: string }>>(`${API_PREFIX}/admin/services/reorder`, { ids }),

  // Projects
  getAllProjects: () => get<PaginatedApiResponse<Project>>(`${API_PREFIX}/admin/projects`),
  createProject: (data: Partial<Project>) => post<ApiResponse<Project>>(`${API_PREFIX}/admin/projects`, data),
  updateProject: (id: string, data: Partial<Project>) => patch<ApiResponse<Project>>(`${API_PREFIX}/admin/projects/${id}`, data),
  deleteProject: (id: string) => del<ApiResponse<void>>(`${API_PREFIX}/admin/projects/${id}`),
  toggleProjectFeatured: (id: string) => patch<ApiResponse<Project>>(`${API_PREFIX}/admin/projects/${id}/feature`, {}),

  // Blog
  getAllBlogPosts: () => get<PaginatedApiResponse<BlogPost>>(`${API_PREFIX}/admin/blog`),
  createBlogPost: (data: Partial<BlogPost>) => post<ApiResponse<BlogPost>>(`${API_PREFIX}/admin/blog`, data),
  updateBlogPost: (id: string, data: Partial<BlogPost>) => patch<ApiResponse<BlogPost>>(`${API_PREFIX}/admin/blog/${id}`, data),
  deleteBlogPost: (id: string) => del<ApiResponse<void>>(`${API_PREFIX}/admin/blog/${id}`),
  toggleBlogPublish: (id: string) => patch<ApiResponse<BlogPost>>(`${API_PREFIX}/admin/blog/${id}/publish`, {}),

  // Team
  getAllTeamMembers: () => get<PaginatedApiResponse<TeamMember>>(`${API_PREFIX}/admin/team`),
  createTeamMember: (data: Partial<TeamMember>) => post<ApiResponse<TeamMember>>(`${API_PREFIX}/admin/team`, data),
  updateTeamMember: (id: string, data: Partial<TeamMember>) => patch<ApiResponse<TeamMember>>(`${API_PREFIX}/admin/team/${id}`, data),
  deleteTeamMember: (id: string) => del<ApiResponse<void>>(`${API_PREFIX}/admin/team/${id}`),

  // Testimonials
  getAllTestimonials: () => get<PaginatedApiResponse<Testimonial>>(`${API_PREFIX}/admin/testimonials`),
  createTestimonial: (data: Partial<Testimonial>) => post<ApiResponse<Testimonial>>(`${API_PREFIX}/admin/testimonials`, data),
  updateTestimonial: (id: string, data: Partial<Testimonial>) => patch<ApiResponse<Testimonial>>(`${API_PREFIX}/admin/testimonials/${id}`, data),
  deleteTestimonial: (id: string) => del<ApiResponse<void>>(`${API_PREFIX}/admin/testimonials/${id}`),
  toggleTestimonialFeatured: (id: string) => patch<ApiResponse<Testimonial>>(`${API_PREFIX}/admin/testimonials/${id}/feature`, {}),

  // FAQs
  getAllFaqs: () => get<PaginatedApiResponse<Faq>>(`${API_PREFIX}/admin/faqs`),
  createFaq: (data: Partial<Faq>) => post<ApiResponse<Faq>>(`${API_PREFIX}/admin/faqs`, data),
  updateFaq: (id: string, data: Partial<Faq>) => patch<ApiResponse<Faq>>(`${API_PREFIX}/admin/faqs/${id}`, data),
  deleteFaq: (id: string) => del<ApiResponse<void>>(`${API_PREFIX}/admin/faqs/${id}`),

  // Contacts
  getAllContacts: () => get<PaginatedApiResponse<ContactMessage>>(`${API_PREFIX}/admin/contacts`),
  updateContactStatus: (id: string, data: Partial<ContactMessage>) => put<ApiResponse<ContactMessage>>(`${API_PREFIX}/admin/contacts/${id}/read`, data),
  deleteContact: (id: string) => del<ApiResponse<void>>(`${API_PREFIX}/admin/contacts/${id}`),

  // Media
  uploadMedia: (formData: FormData) => post<ApiResponse<{ id: string; url: string }>>(`${API_PREFIX}/admin/media/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteMedia: (id: string) => del<ApiResponse<void>>(`${API_PREFIX}/admin/media/${id}`),

  // SEO
  getAllSeoSettings: () => get<ApiResponse<SeoSettings[]>>(`${API_PREFIX}/admin/seo/settings`),
  getSeoSettingsByRoute: (route: string) => get<ApiResponse<SeoSettings>>(`${API_PREFIX}/admin/seo/page/${route}`),
  updateSeoSettings: (route: string, data: Partial<SeoSettings>) => put<ApiResponse<SeoSettings>>(`${API_PREFIX}/admin/seo/page/${route}`, data),

  // Navigation
  getAllNavigationMenus: () => get<ApiResponse<NavigationMenu[]>>(`${API_PREFIX}/admin/navigation`),
  updateNavigationMenu: (data: Partial<NavigationMenu>) => put<ApiResponse<NavigationMenu>>(`${API_PREFIX}/admin/navigation`, data),

  // Settings
  getSiteSettings: () => get<ApiResponse<SiteSettings>>(`${API_PREFIX}/admin/settings/general`),
  updateSiteSettings: (data: Partial<SiteSettings>) => put<ApiResponse<SiteSettings>>(`${API_PREFIX}/admin/settings/general`, data),
}
