# cofixer — Frontend-to-API Integration Map

> Last updated: 2026-05-15

---

## Routing Strategy

- Public pages: SSR via React Router 7 loaders (`/`, `/about`, `/services`, `/projects`, `/blog`, `/team`, `/testimonials`, `/faqs`, `/contact`, `/gallery`)
- Dashboard: Client-side SPA routes (`/dashboard/*`)
- Auth pages: Client-side (`/login`)

---

## Screen-to-API Mapping

### Public Pages

| Route | Loader / Hook | API Endpoints | Status |
|-------|---------------|---------------|--------|
| `/` | Home loader | GET /api/v1/seo/settings?route=home | ⬜ |
| `/about` | About loader | GET /api/v1/seo/settings?route=about | ⬜ |
| `/services` | Services loader | GET /api/v1/services, GET /api/v1/seo/settings | ⬜ |
| `/services/:slug` | Service detail loader | GET /api/v1/services/:slug | ⬜ |
| `/projects` | Projects loader | GET /api/v1/projects, GET /api/v1/seo/settings | ⬜ |
| `/projects/:slug` | Project detail loader | GET /api/v1/projects/:slug | ⬜ |
| `/blog` | Blog loader | GET /api/v1/blog, GET /api/v1/seo/settings | ⬜ |
| `/blog/:slug` | Blog detail loader | GET /api/v1/blog/:slug | ⬜ |
| `/team` | Team loader | GET /api/v1/team | ⬜ |
| `/testimonials` | Testimonials loader | GET /api/v1/testimonials | ⬜ |
| `/faqs` | FAQs loader | GET /api/v1/faqs | ⬜ |
| `/contact` | Contact loader | GET /api/v1/seo/settings | ⬜ |
| `/gallery` | Gallery loader | GET /api/v1/gallery | ⬜ |

### Dashboard Pages

| Route | API Endpoints | Role Access | Status |
|-------|---------------|-------------|--------|
| `/dashboard` | GET /api/v1/auth/me | admin | ⬜ |
| `/dashboard/services` | CRUD /api/v1/services | admin | ⬜ |
| `/dashboard/projects` | CRUD /api/v1/projects | admin | ⬜ |
| `/dashboard/blog` | CRUD /api/v1/blog | admin | ⬜ |
| `/dashboard/team` | CRUD /api/v1/team | admin | ⬜ |
| `/dashboard/testimonials` | CRUD /api/v1/testimonials | admin | ⬜ |
| `/dashboard/faqs` | CRUD /api/v1/faqs | admin | ⬜ |
| `/dashboard/seo` | CRUD /api/v1/seo/settings | admin | ⬜ |

### Auth Pages

| Route | API Endpoints | Status |
|-------|---------------|--------|
| `/login` | POST /api/v1/auth/login | ⬜ |

---

## Integration Checklist

- [ ] All screens mapped to API endpoints
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Auth guards in place
- [ ] Role-based access enforced
- [ ] SSR loaders fetch data before render
- [ ] Dynamic meta tags rendered server-side
