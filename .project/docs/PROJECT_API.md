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
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login | No |
| POST | `/api/v1/auth/refresh` | Refresh access token | No |
| POST | `/api/v1/auth/logout` | Logout | Yes |
| POST | `/api/v1/auth/forgot-password` | Request password reset | No |
| POST | `/api/v1/auth/reset-password` | Reset password | No |
| GET | `/api/v1/auth/me` | Get current user | Yes |

---

## CMS Content Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/services` | List services | No |
| GET | `/api/v1/services/:slug` | Get service by slug | No |
| GET | `/api/v1/projects` | List projects | No |
| GET | `/api/v1/projects/:slug` | Get project by slug | No |
| GET | `/api/v1/blog` | List blog posts | No |
| GET | `/api/v1/blog/:slug` | Get blog post by slug | No |
| GET | `/api/v1/team` | List team members | No |
| GET | `/api/v1/testimonials` | List testimonials | No |
| GET | `/api/v1/faqs` | List FAQs | No |
| GET | `/api/v1/gallery` | List gallery images | No |

---

## SEO Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/seo/settings` | Get SEO settings | No |
| GET | `/api/v1/sitemap` | Get sitemap data | No |
| GET | `/api/v1/robots-txt` | Get robots.txt content | No |

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
