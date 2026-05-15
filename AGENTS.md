# cofixer — Agent Context

> Stack: NestJS + React 19 | Updated: 2026-05-15

---

## Quick Reference

| Layer | Tech | Port |
|-------|------|------|
| Backend | NestJS | 3000 |
| Frontend | React 19 + Router 7 | 5173 |
| Database | PostgreSQL | 5432 |
| Cache | Redis | 6379 |

---

## Structure

```
cofixer/
├── backend/          # NestJS API
├── frontend/         # React 19 (public + dashboard unified)
├── .kimi/            # Kimi CLI config
├── .project/         # Docs & status
└── docker-compose.yml
```

---

## Commands

```bash
# Start infra
docker-compose up -d postgres redis

# Start backend
cd backend && npm run start:dev

# Start frontend
cd frontend && npm run dev
```

---

## Patterns

- **Backend**: Modular architecture, DTO validation, JWT auth guards, Swagger docs, Repository pattern
- **Frontend**: React Router 7 loaders (SSR), TanStack Query (client cache), Zustand (state), Tailwind + shadcn/ui
- **Auth**: AES-256-GCM encrypted JWT in httpOnly cookies + CSRF Double-Submit Cookie

---

## Conventions

- Commits: `feat:`, `fix:`, `docs:`, `refactor:`
- Branches: `main`, `dev`, `feature/*`, `fix/*`
- API responses: `{ success, data, message }` or `{ success, error }`
