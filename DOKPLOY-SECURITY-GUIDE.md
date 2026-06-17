# Cofixer Dokploy Security Deployment Guide

> This guide ensures secure deployment of Cofixer on Dokploy with all hardening measures applied.
> **Deployment method:** Dokploy builds directly from `backend/Dockerfile` and `frontend/Dockerfile` (not Docker Compose).

---

## 1. Environment Variables (Dokploy UI)

Set these in **Dokploy > Your Service > Environment Variables**. NEVER commit secrets to git.

### Backend (API Service)

```env
# Server
PORT=3000
MODE=PROD
ALLOW_ORIGINS=https://cofixer.com,https://www.cofixer.com
FRONTEND_URL=https://cofixer.com

# Database (Dokploy managed PostgreSQL — internal hostname only)
POSTGRES_HOST=<dokploy-managed-postgres-internal-host>
POSTGRES_PORT=5432
POSTGRES_USER=cofixer_prod_user
POSTGRES_DATABASE=cofixer
POSTGRES_PASSWORD=<GENERATE_32+_CHAR_RANDOM>

# JWT (generate with: openssl rand -base64 48)
AUTH_JWT_SECRET=<MIN_32_CHARS_STRONG_SECRET>
AUTH_TOKEN_COOKIE_NAME=CoFixerToken
AUTH_TOKEN_EXPIRE_TIME=24h
AUTH_TOKEN_EXPIRED_TIME_REMEMBER_ME=30d
AUTH_REFRESH_TOKEN_COOKIE_NAME=CoFixerRefreshToken
AUTH_REFRESH_TOKEN_EXPIRE_TIME=7d

# Redis (Dokploy managed Redis — internal hostname only)
REDIS_HOST=<dokploy-managed-redis-internal-host>
REDIS_PORT=6379
REDIS_PASSWORD=<GENERATE_32+_CHAR_RANDOM>
REDIS_DB=0
REDIS_CACHE_TTL=3600
REDIS_PREFIX=cofixer

# Mail (use app password, never your Gmail password)
MAIL_PORT=587
MAIL_HOST=smtp.gmail.com
MAIL_FROM=noreply@cofixer.com
MAIL_USER=your-email@gmail.com
MAIL_PASS=<GMAIL_APP_PASSWORD>

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=cofixer

# Admin Seed (change after first deployment!)
ADMIN_SEED_EMAIL=admin@cofixer.com
ADMIN_SEED_PASSWORD=<STRONG_UNIQUE_PASSWORD>
```

### Frontend (Web Service)

```env
VITE_API_URL=https://api.cofixer.com/api/v1
```

---

## 2. Dokploy Service Configuration

### Backend Service

| Setting | Value |
|---------|-------|
| Build Type | Dockerfile |
| Dockerfile Path | `backend/Dockerfile` |
| Port | `3000` |
| Domain | `api.cofixer.com` |
| HTTPS | Enabled (Let's Encrypt) |

**Traefik Labels (add in Dokploy > Advanced > Labels):**

```yaml
# Force HTTPS redirect
traefik.http.routers.backend.middlewares: backend-https-redirect
traefik.http.middlewares.backend-https-redirect.redirectscheme.scheme: https
traefik.http.middlewares.backend-https-redirect.redirectscheme.permanent: true

# Security headers via Traefik (backup to Helmet)
traefik.http.middlewares.backend-security.headers.contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self'; frame-ancestors 'none';"
traefik.http.middlewares.backend-security.headers.customFrameOptionsValue: "DENY"
traefik.http.middlewares.backend-security.headers.contentTypeNosniff: true

# Apply security middleware
traefik.http.routers.backend.middlewares: backend-security
```

### Frontend Service

| Setting | Value |
|---------|-------|
| Build Type | Dockerfile |
| Dockerfile Path | `frontend/Dockerfile` |
| Port | `3000` |
| Domain | `cofixer.com`, `www.cofixer.com` |
| HTTPS | Enabled (Let's Encrypt) |

**Traefik Labels:**

```yaml
# Force HTTPS redirect
traefik.http.routers.frontend.middlewares: frontend-https-redirect
traefik.http.middlewares.frontend-https-redirect.redirectscheme.scheme: https
traefik.http.middlewares.frontend-https-redirect.redirectscheme.permanent: true

# Security headers
traefik.http.middlewares.frontend-security.headers.contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self'; frame-ancestors 'none';"
traefik.http.middlewares.frontend-security.headers.customFrameOptionsValue: "DENY"
traefik.http.middlewares.frontend-security.headers.contentTypeNosniff: true

# Apply security middleware
traefik.http.routers.frontend.middlewares: frontend-security
```

---

## 3. Database & Cache Security

### Dokploy Managed Database (Recommended)

1. Go to **Dokploy > Your Project > Databases > Create**
2. Create **PostgreSQL** and **Redis** services
3. Set strong passwords for both
4. Dokploy automatically keeps them on the internal Docker network — **no external port exposure**
5. Copy the internal hostnames (e.g., `postgres-xyz`, `redis-xyz`) into your backend environment variables
6. **Never** enable "Expose Port to Internet" for databases

---

## 4. Swagger / API Docs

Swagger is **automatically disabled** when `MODE=PROD`.

To verify:
```bash
curl -I https://api.cofixer.com/docs
# Should return 404 Not Found
```

If you need docs in staging, use a separate Dokploy service with `MODE=STAGING` and IP whitelist.

---

## 5. Cloudflare Integration (Recommended)

Even with Dokploy security, add Cloudflare as your DNS proxy:

1. Point your domain's nameservers to Cloudflare
2. In Cloudflare DNS, add A/AAAA records pointing to your Dokploy server IP
3. Enable **Proxy (Orange Cloud)**
4. Go to **SSL/TLS > Overview** → Set to **Full (strict)**
5. Enable:
   - **Always Use HTTPS**
   - **Auto Minify** (JS, CSS, HTML)
   - **Brotli Compression**
   - **Security Level: High**
   - **Bot Fight Mode: ON**

6. Create WAF Rate Limiting Rules:
   - Rule 1: `/api/v1/auth/login` → 5 requests / 10 minutes per IP
   - Rule 2: `/api/v1/auth/forgot-password` → 3 requests / 10 minutes per IP
   - Rule 3: `/api/v1/*` → 100 requests / 1 minute per IP

---

## 6. Post-Deployment Security Checklist

Run these checks after each deploy:

```bash
# 1. Verify security headers
curl -I https://api.cofixer.com/api/v1/health
# Look for: X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Strict-Transport-Security

# 2. Verify Swagger is disabled
curl -I https://api.cofixer.com/docs
# Expected: 404

# 3. Verify CORS blocks unknown origins
curl -H "Origin: https://evil.com" -I https://api.cofixer.com/api/v1/auth/login
# Expected: CORS error or blocked

# 4. Verify rate limiting
curl -X POST https://api.cofixer.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}'
# Run 6+ times quickly — expect 429 Too Many Requests

# 5. Verify body parser limits (should reject huge payloads)
curl -X POST https://api.cofixer.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "$(python3 -c 'print("{\"a\":\"" + "A"*200000 + "\"}")')"
# Expected: 413 Payload Too Large

# 6. Verify databases are not exposed externally
nmap -p 5432,6379 YOUR_SERVER_IP
# Expected: closed/filtered for both ports
```

---

## 7. Security Incident Response

If Cloudflare reports threats again:

1. **Check logs immediately:**
   ```bash
   # Dokploy container logs
   docker logs <dokploy-backend-container-id> --tail 500
   ```

2. **Review Dokploy > Monitoring > Events**

3. **Check for unusual traffic patterns:**
   - High login attempt rates
   - Unusual origin countries
   - Large payload requests
   - Scanning behavior on `/docs`, `/test`, `/admin`

4. **Enable Dokploy Fail2ban** (if available) or add Cloudflare IP Access Rules

5. **Rotate secrets** if any breach is suspected:
   - `AUTH_JWT_SECRET`
   - `POSTGRES_PASSWORD`
   - `REDIS_PASSWORD`
   - `MAIL_PASS`
   - Cloudinary API Secret

---

## 8. What Was Fixed

All fixes are in the application code and will be included automatically when Dokploy rebuilds your images.

| # | Fix | File |
|---|-----|------|
| 1 | Added Helmet with CSP, HSTS, X-Frame-Options, Referrer-Policy | `backend/src/main.ts` |
| 2 | Added body parser limits (100kb) to prevent DoS | `backend/src/main.ts` |
| 3 | Added `trust proxy` for Dokploy/Traefik | `backend/src/main.ts` |
| 4 | Hardened CORS — removed wildcard dev fallback | `backend/src/main.ts` |
| 5 | Removed exposed `/test` static directory | `backend/src/app.module.ts` |
| 6 | Added `ThrottlerGuard` globally | `backend/src/app.module.ts` |
| 7 | Stricter rate limits on auth endpoints (3-5/min) | `backend/src/modules/auth/auth.controller.ts` |
| 8 | Added HTML sanitization service for Quill content | `backend/src/core/utils/sanitization.service.ts` |
| 9 | Added security meta tags to frontend | `frontend/app/root.tsx` |
| 10 | Added `.env` protection to frontend `.dockerignore` | `frontend/.dockerignore` |
| 11 | Swagger already disabled in production (`MODE=PROD`) | `backend/src/main.ts` |

---

> **Next Steps:**
> 1. Review and set all environment variables in Dokploy UI for both backend and frontend services
> 2. Ensure Dokploy-managed PostgreSQL and Redis are created (internal network only)
> 3. Redeploy both backend and frontend services in Dokploy
> 4. Run the post-deployment security checklist above
> 5. Monitor Cloudflare Security Events for 48 hours
