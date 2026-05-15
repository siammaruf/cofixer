# cofixer — Database Schema

> Last updated: 2026-05-15

---

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │  services   │       │  projects   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ PK id       │       │ PK id       │       │ PK id       │
│ email       │       │ title       │       │ title       │
│ role        │       │ slug        │       │ slug        │
│ created_at  │       │ description │       │ summary     │
└─────────────┘       │ created_at  │       │ created_at  │
                      └─────────────┘       └─────────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  blog_posts │       │ team_members│       │testimonials │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ PK id       │       │ PK id       │       │ PK id       │
│ title       │       │ name        │       │ name        │
│ slug        │       │ role        │       │ role        │
│ content     │       │ bio         │       │ content     │
│ created_at  │       │ created_at  │       │ rating      │
└─────────────┘       └─────────────┘       │ created_at  │
                                            └─────────────┘
┌─────────────┐       ┌─────────────┐
│    faqs     │       │ seo_settings│
├─────────────┤       ├─────────────┤
│ PK id       │       │ PK id       │
│ question    │       │ page_route  │
│ answer      │       │ title       │
│ category    │       │ meta_desc   │
│ created_at  │       │ created_at  │
└─────────────┘       └─────────────┘
```

---

## Tables

### users

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| email | varchar(255) | No | - | Unique email |
| password | varchar(255) | No | - | Hashed password |
| role | enum | No | 'user' | user, admin |
| is_active | boolean | No | true | Account status |
| created_at | timestamp | No | now() | Creation time |
| updated_at | timestamp | No | now() | Last update |

**Constraints:**
- UNIQUE (email)

### services

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| title | varchar(255) | No | - | Service title |
| slug | varchar(255) | No | - | Unique URL slug |
| description | text | Yes | - | Service description |
| icon | varchar(255) | Yes | - | Icon identifier |
| image | varchar(500) | Yes | - | Cover image URL |
| order | integer | No | 0 | Display order |
| is_active | boolean | No | true | Published status |
| created_at | timestamp | No | now() | Creation time |
| updated_at | timestamp | No | now() | Last update |

### projects

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| title | varchar(255) | No | - | Project title |
| slug | varchar(255) | No | - | Unique URL slug |
| summary | text | Yes | - | Short summary |
| description | text | Yes | - | Full description |
| images | jsonb | Yes | [] | Gallery images |
| category | varchar(100) | Yes | - | Project category |
| client_name | varchar(255) | Yes | - | Client name |
| is_active | boolean | No | true | Published status |
| created_at | timestamp | No | now() | Creation time |
| updated_at | timestamp | No | now() | Last update |

### blog_posts

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| title | varchar(255) | No | - | Post title |
| slug | varchar(255) | No | - | Unique URL slug |
| excerpt | text | Yes | - | Short excerpt |
| content | text | Yes | - | Full content |
| cover_image | varchar(500) | Yes | - | Cover image URL |
| category | varchar(100) | Yes | - | Post category |
| tags | jsonb | Yes | [] | Tags array |
| author | varchar(255) | Yes | - | Author name |
| published_at | timestamp | Yes | - | Publish date |
| is_active | boolean | No | true | Published status |
| created_at | timestamp | No | now() | Creation time |
| updated_at | timestamp | No | now() | Last update |

---

## Indexes

| Table | Columns | Type | Purpose |
|-------|---------|------|---------|
| users | email | UNIQUE | Fast lookup |
| services | slug | UNIQUE | URL routing |
| projects | slug | UNIQUE | URL routing |
| blog_posts | slug | UNIQUE | URL routing |
