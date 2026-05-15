# cofixer

> Cofixer — AI Agency & Technology full-stack platform. NestJS backend + React 19 frontend with SSR.

---

## Stack

| Layer | Technology |
|-------|------------|
| Backend | NestJS v11 |
| Frontend | React 19 + React Router 7 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Styling | Tailwind CSS 4 |

---

## Quick Start

```bash
# 1. Start infrastructure
docker-compose up -d

# 2. Start backend
cd backend && npm install && npm run start:dev

# 3. Start frontend (new terminal)
cd frontend && npm install && npm run dev
```

- API: http://localhost:3000
- App: http://localhost:5173
- API Docs: http://localhost:3000/api/docs

---

## Structure

```
cofixer/
├── backend/        # NestJS API
├── frontend/       # React 19 unified app (public + dashboard)
├── .project/       # Project docs
└── docker-compose.yml
```

---

## Development

| Service | Command | URL |
|---------|---------|-----|
| Backend | `cd backend && npm run start:dev` | http://localhost:3000 |
| Frontend | `cd frontend && npm run dev` | http://localhost:5173 |

---

## Docs

- [PROJECT_KNOWLEDGE.md](.project/docs/PROJECT_KNOWLEDGE.md) — Architecture & features
- [PROJECT_API.md](.project/docs/PROJECT_API.md) — API reference
- [PROJECT_DATABASE.md](.project/docs/PROJECT_DATABASE.md) — Database schema
- [AGENTS.md](AGENTS.md) — Agent development context

---

## License

Proprietary — CoFixer
