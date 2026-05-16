# cofixer — API Documentation

> Last updated: 2026-05-15

---

## Base URL

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:3000` |
| Staging | TBD |
| Production | TBD |

---

## Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout | Yes |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password | No |
| GET | `/api/auth/me` | Get current user | Yes |

---

## CMS Content Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/services` | List services | No |
| GET | `/api/services/:slug` | Get service by slug | No |
| GET | `/api/projects` | List projects | No |
| GET | `/api/projects/:slug` | Get project by slug | No |
| GET | `/api/blog` | List blog posts | No |
| GET | `/api/blog/:slug` | Get blog post by slug | No |
| GET | `/api/team` | List team members | No |
| GET | `/api/testimonials` | List testimonials | No |
| GET | `/api/faqs` | List FAQs | No |
| GET | `/api/gallery` | List gallery images | No |

---

## SEO Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/seo/settings` | Get SEO settings | No |
| GET | `/api/sitemap` | Get sitemap data | No |
| GET | `/api/robots-txt` | Get robots.txt content | No |

---

## Common Response Formats

### Success

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

---

## Pagination

All list endpoints support:

| Query Param | Default | Description |
|-------------|---------|-------------|
| `page` | 1 | Page number |
| `limit` | 10 | Items per page |
| `sort` | created_at | Sort field |
| `order` | desc | asc / desc |
