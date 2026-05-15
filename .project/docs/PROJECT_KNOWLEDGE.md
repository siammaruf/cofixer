# cofixer — Project Knowledge

> Last updated: 2026-05-15

---

## Overview

Cofixer is a modern AI Agency & Technology full-stack web application with a unified React 19 frontend (public website + admin dashboard CMS), a NestJS REST API backend, and PostgreSQL + Redis data layer.

---

### Goals

1. Build a fully dynamic public website with SSR for SEO
2. Provide a complete CMS dashboard for content management
3. Implement secure AES-256-GCM encrypted JWT authentication

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | NestJS v11 |
| Frontend | React 19 + React Router 7 (SSR + SPA) |
| Database | PostgreSQL 16 |
| ORM | TypeORM 0.3.x |
| Cache | Redis 7 |
| Auth | AES-256-GCM JWT in httpOnly cookies + CSRF |
| API Docs | Swagger / OpenAPI 3.0 |

---

## Architecture

### Backend — NestJS

```
backend/
├── src/
│   ├── modules/           # Feature modules
│   ├── common/            # Shared utilities, guards, interceptors
│   ├── config/            # Configuration files
│   └── main.ts            # Application entry
├── test/                  # E2E tests
└── package.json
```

### Frontend — React 19 (Unified)

```
frontend/
├── app/
│   ├── pages/             # Route-level pages (public + dashboard)
│   ├── components/        # Reusable UI components
│   ├── services/          # API integration
│   └── routes.ts          # React Router routes
├── public/
└── package.json
```

---

## User Types

| Role | Permissions |
|------|-------------|
| Visitor | Browse public pages |
| Admin | Full CMS access, content CRUD |

---

## Key Features

- Dynamic public pages with SSR (services, projects, blog, team, testimonials, FAQs)
- Admin dashboard CMS for all content management
- Dynamic SEO per page (meta tags, JSON-LD, sitemap, robots.txt)
- Secure cookie-based authentication with CSRF protection
- Contact form with Google Maps integration
