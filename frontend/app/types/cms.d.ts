export interface Service {
  id: string
  title: string
  slug: string
  description?: string
  shortDescription?: string
  icon?: string
  image?: string
  order: number
  featured: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  title: string
  slug: string
  summary?: string
  description?: string
  clientName?: string
  category?: string
  images: string[]
  featuredImage?: string
  imageUrl?: string
  liveUrl?: string
  githubUrl?: string
  techStack: string[]
  featured: boolean
  isActive: boolean
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  ogImage?: string
  canonicalUrl?: string
  robotsMeta?: string
  createdAt: string
  updatedAt: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  seoTitle?: string
  seoDescription?: string
  postCount?: number
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  coverImage?: string
  category?: string
  categories?: BlogCategory[]
  categoryIds?: string[]
  tags: string[]
  authorName?: string
  publishedAt?: string
  isPublished: boolean
  metaTitle?: string
  metaDescription?: string
  ogImage?: string
  canonicalUrl?: string
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string
  image?: string
  socialLinks?: { twitter?: string; linkedin?: string; github?: string }
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Testimonial {
  id: string
  clientName: string
  clientRole?: string
  company?: string
  content: string
  rating: number
  image?: string
  featured: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Faq {
  id: string
  question: string
  answer: string
  category?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  read: boolean
  status: 'new' | 'in_progress' | 'resolved' | 'spam'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface SeoSettings {
  id: string
  route: string
  pageType: string
  title?: string
  metaDescription?: string
  metaKeywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterImage?: string
  canonicalUrl?: string
  robotsMeta: string
  jsonLdSchema?: object
  customHeadScripts?: string
}

export interface SiteSettings {
  id: string
  siteName: string
  logo?: string
  favicon?: string
  copyrightText?: string
  socialLinks?: { twitter?: string; linkedin?: string; github?: string }
  themeColors?: { primary?: string; accent?: string }
  googleAnalyticsId?: string
  googleTagManagerId?: string
  customScripts?: string
}

export interface NavigationMenu {
  id: string
  name: string
  items: NavigationItem[]
  isActive: boolean
}

export interface NavigationItem {
  id: string
  label: string
  url: string
  icon?: string
  children?: NavigationItem[]
  isExternal?: boolean
  order: number
}

export interface Stats {
  services: number
  projects: number
  blogPosts: number
  teamMembers: number
  testimonials: number
  contacts: number
}

export interface MediaItem {
  id: string
  url: string
  thumbUrl?: string
  largeUrl?: string
  fullUrl?: string
  filename: string
  originalName?: string
  mimeType: string
  size: number
  createdAt: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface CmsState {
  services: Service[]
  projects: Project[]
  blogPosts: BlogPost[]
  teamMembers: TeamMember[]
  testimonials: Testimonial[]
  faqs: Faq[]
  contacts: ContactMessage[]
  seoSettings: SeoSettings[]
  siteSettings: SiteSettings | null
  stats: Stats | null
  navigation: NavigationMenu | null
  media: MediaItem[]
  categories: BlogCategory[]
  loading: boolean
  error: string | null
}
