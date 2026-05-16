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
| `/` | Home loader | GET /api/seo/settings?route=home | ⬜ |
| `/about` | About loader | GET /api/seo/settings?route=about | ⬜ |
| `/services` | Services loader | GET /api/services, GET /api/seo/settings | ⬜ |
| `/services/:slug` | Service detail loader | GET /api/services/:slug | ⬜ |
| `/projects` | Projects loader | GET /api/projects, GET /api/seo/settings | ⬜ |
| `/projects/:slug` | Project detail loader | GET /api/projects/:slug | ⬜ |
| `/blog` | Blog loader | GET /api/blog, GET /api/seo/settings | ⬜ |
| `/blog/:slug` | Blog detail loader | GET /api/blog/:slug | ⬜ |
| `/team` | Team loader | GET /api/team | ⬜ |
| `/testimonials` | Testimonials loader | GET /api/testimonials | ⬜ |
| `/faqs` | FAQs loader | GET /api/faqs | ⬜ |
| `/contact` | Contact loader | GET /api/seo/settings | ⬜ |
| `/gallery` | Gallery loader | GET /api/gallery | ⬜ |

### Dashboard Pages

| Route | API Endpoints | Role Access | Status |
|-------|---------------|-------------|--------|
| `/dashboard` | GET /api/auth/me | admin | ⬜ |
| `/dashboard/services` | CRUD /api/services | admin | ⬜ |
| `/dashboard/projects` | CRUD /api/projects | admin | ⬜ |
| `/dashboard/blog` | CRUD /api/blog | admin | ⬜ |
| `/dashboard/team` | CRUD /api/team | admin | ⬜ |
| `/dashboard/testimonials` | CRUD /api/testimonials | admin | ⬜ |
| `/dashboard/faqs` | CRUD /api/faqs | admin | ⬜ |
| `/dashboard/seo` | CRUD /api/seo/settings | admin | ⬜ |

### Auth Pages

| Route | API Endpoints | Status |
|-------|---------------|--------|
| `/login` | POST /api/auth/login | ⬜ |

---

## Integration Checklist

- [ ] All screens mapped to API endpoints
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Auth guards in place
- [ ] Role-based access enforced
- [ ] SSR loaders fetch data before render
- [ ] Dynamic meta tags rendered server-side
