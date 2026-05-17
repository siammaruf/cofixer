import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cmsAdminService } from '~/services'
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
  Stats,
  NavigationMenu,
  CmsState,
} from '~/types/cms'
import type { ApiError } from '~/types/api'

const initialState: CmsState = {
  services: [],
  projects: [],
  blogPosts: [],
  teamMembers: [],
  testimonials: [],
  faqs: [],
  contacts: [],
  seoSettings: [],
  siteSettings: null,
  stats: null,
  navigation: null,
  loading: false,
  error: null,
}

// ─── Stats ───

export const fetchStats = createAsyncThunk(
  'cms/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const { cmsService } = await import('~/services/httpServices/cmsService')
      const statsRes = await cmsService.getStats()
      return statsRes.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

// ─── Services ───

export const fetchServices = createAsyncThunk(
  'cms/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.getAllServices()
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const deleteService = createAsyncThunk(
  'cms/deleteService',
  async (id: string, { rejectWithValue }) => {
    try {
      await cmsAdminService.deleteService(id)
      return id
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const toggleServiceFeatured = createAsyncThunk(
  'cms/toggleServiceFeatured',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.toggleServiceFeatured(id)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

// ─── Projects ───

export const fetchProjects = createAsyncThunk(
  'cms/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.getAllProjects()
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const deleteProject = createAsyncThunk(
  'cms/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      await cmsAdminService.deleteProject(id)
      return id
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const toggleProjectFeatured = createAsyncThunk(
  'cms/toggleProjectFeatured',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.toggleProjectFeatured(id)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

// ─── Blog Posts ───

export const fetchBlogPosts = createAsyncThunk(
  'cms/fetchBlogPosts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.getAllBlogPosts()
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const deleteBlogPost = createAsyncThunk(
  'cms/deleteBlogPost',
  async (id: string, { rejectWithValue }) => {
    try {
      await cmsAdminService.deleteBlogPost(id)
      return id
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const toggleBlogPublish = createAsyncThunk(
  'cms/toggleBlogPublish',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.toggleBlogPublish(id)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

// ─── Team Members ───

export const fetchTeamMembers = createAsyncThunk(
  'cms/fetchTeamMembers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.getAllTeamMembers()
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const deleteTeamMember = createAsyncThunk(
  'cms/deleteTeamMember',
  async (id: string, { rejectWithValue }) => {
    try {
      await cmsAdminService.deleteTeamMember(id)
      return id
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

// ─── Testimonials ───

export const fetchTestimonials = createAsyncThunk(
  'cms/fetchTestimonials',
  async (_, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.getAllTestimonials()
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const deleteTestimonial = createAsyncThunk(
  'cms/deleteTestimonial',
  async (id: string, { rejectWithValue }) => {
    try {
      await cmsAdminService.deleteTestimonial(id)
      return id
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const toggleTestimonialFeatured = createAsyncThunk(
  'cms/toggleTestimonialFeatured',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.toggleTestimonialFeatured(id)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

// ─── FAQs ───

export const fetchFaqs = createAsyncThunk(
  'cms/fetchFaqs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.getAllFaqs()
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const deleteFaq = createAsyncThunk(
  'cms/deleteFaq',
  async (id: string, { rejectWithValue }) => {
    try {
      await cmsAdminService.deleteFaq(id)
      return id
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

// ─── Contacts ───

export const fetchContacts = createAsyncThunk(
  'cms/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.getAllContacts()
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const updateContactStatus = createAsyncThunk(
  'cms/updateContactStatus',
  async ({ id, data }: { id: string; data: Partial<ContactMessage> }, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.updateContactStatus(id, data)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const deleteContact = createAsyncThunk(
  'cms/deleteContact',
  async (id: string, { rejectWithValue }) => {
    try {
      await cmsAdminService.deleteContact(id)
      return id
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

// ─── SEO ───

export const fetchSeoSettings = createAsyncThunk(
  'cms/fetchSeoSettings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.getAllSeoSettings()
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const updateSeoSettings = createAsyncThunk(
  'cms/updateSeoSettings',
  async ({ route, data }: { route: string; data: Partial<SeoSettings> }, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.updateSeoSettings(route, data)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

// ─── Site Settings ───

export const fetchSiteSettings = createAsyncThunk(
  'cms/fetchSiteSettings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.getSiteSettings()
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const updateSiteSettings = createAsyncThunk(
  'cms/updateSiteSettings',
  async (data: Partial<SiteSettings>, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.updateSiteSettings(data)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

// ─── Navigation ───

export const fetchNavigation = createAsyncThunk(
  'cms/fetchNavigation',
  async (_, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.getAllNavigationMenus()
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

export const updateNavigation = createAsyncThunk(
  'cms/updateNavigation',
  async (data: Partial<NavigationMenu>, { rejectWithValue }) => {
    try {
      const res = await cmsAdminService.updateNavigationMenu(data)
      return res.data
    } catch (error) {
      const apiError = error as ApiError
      return rejectWithValue(apiError.message)
    }
  }
)

// ─── Slice ───

const cmsSlice = createSlice({
  name: 'cms',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false
        state.services = action.payload
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter((s) => s.id !== action.payload)
      })
      .addCase(toggleServiceFeatured.fulfilled, (state, action) => {
        const index = state.services.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) {
          state.services[index] = action.payload
        }
      })

      // Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false
        state.projects = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload)
      })
      .addCase(toggleProjectFeatured.fulfilled, (state, action) => {
        const index = state.projects.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) {
          state.projects[index] = action.payload
        }
      })

      // Blog Posts
      .addCase(fetchBlogPosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.loading = false
        state.blogPosts = action.payload
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.blogPosts = state.blogPosts.filter((p) => p.id !== action.payload)
      })
      .addCase(toggleBlogPublish.fulfilled, (state, action) => {
        const index = state.blogPosts.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) {
          state.blogPosts[index] = action.payload
        }
      })

      // Team Members
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false
        state.teamMembers = action.payload
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteTeamMember.fulfilled, (state, action) => {
        state.teamMembers = state.teamMembers.filter((m) => m.id !== action.payload)
      })

      // Testimonials
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false
        state.testimonials = action.payload
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.testimonials = state.testimonials.filter((t) => t.id !== action.payload)
      })
      .addCase(toggleTestimonialFeatured.fulfilled, (state, action) => {
        const index = state.testimonials.findIndex((t) => t.id === action.payload.id)
        if (index !== -1) {
          state.testimonials[index] = action.payload
        }
      })

      // FAQs
      .addCase(fetchFaqs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.loading = false
        state.faqs = action.payload
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteFaq.fulfilled, (state, action) => {
        state.faqs = state.faqs.filter((f) => f.id !== action.payload)
      })

      // Contacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false
        state.contacts = action.payload
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        const index = state.contacts.findIndex((c) => c.id === action.payload.id)
        if (index !== -1) {
          state.contacts[index] = action.payload
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter((c) => c.id !== action.payload)
      })

      // SEO
      .addCase(fetchSeoSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSeoSettings.fulfilled, (state, action) => {
        state.loading = false
        state.seoSettings = action.payload
      })
      .addCase(fetchSeoSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateSeoSettings.fulfilled, (state, action) => {
        const index = state.seoSettings.findIndex((s) => s.route === action.payload.route)
        if (index !== -1) {
          state.seoSettings[index] = action.payload
        } else {
          state.seoSettings.push(action.payload)
        }
      })

      // Site Settings
      .addCase(fetchSiteSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSiteSettings.fulfilled, (state, action) => {
        state.loading = false
        state.siteSettings = action.payload
      })
      .addCase(fetchSiteSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateSiteSettings.fulfilled, (state, action) => {
        state.siteSettings = action.payload
      })

      // Navigation
      .addCase(fetchNavigation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNavigation.fulfilled, (state, action) => {
        state.loading = false
        // Backend returns NavigationMenu[]; we take the first active one
        state.navigation = action.payload.find((n) => n.isActive) || action.payload[0] || null
      })
      .addCase(fetchNavigation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateNavigation.fulfilled, (state, action) => {
        state.navigation = action.payload
      })
  },
})

export const { clearError } = cmsSlice.actions
export default cmsSlice.reducer
