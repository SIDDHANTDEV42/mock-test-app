# Deployment Guide

This guide explains how to deploy the project for free or low cost using:

- Vercel for the frontend
- Render for the backend
- Neon for PostgreSQL

The project is a full-stack app, so it must be deployed in three connected parts.

## 1. Deployment Map

```txt
Visitor Browser
  -> Vercel Frontend
  -> Render Backend API
  -> Neon PostgreSQL Database
```

Production URLs should look like this:

```txt
Frontend:
https://your-project.vercel.app

Backend:
https://your-render-service.onrender.com

Backend API:
https://your-render-service.onrender.com/api
```

## 2. Before You Deploy

Make sure these files are not committed:

```txt
.env
.env.local
server/.env
client/.env.local
```

Make sure the repo contains:

```txt
server/prisma/schema.prisma
server/prisma/migrations/
server/package.json
client/package.json
render.yaml
```

## 3. Create Neon Database

1. Open Neon.
2. Create a PostgreSQL project.
3. Copy the pooled connection string.
4. Keep it private.

It should look similar to:

```env
postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require
```

This value is your production `DATABASE_URL`.

## 4. Deploy Backend On Render

Create a new Render Web Service.

Use these settings:

```txt
Root Directory: server
Runtime: Node
Build Command: npm install && npm run render-build
Start Command: npm run deploy:start
```

Add these Render environment variables:

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=make-this-long-random-and-at-least-32-characters
CORS_ORIGIN=https://your-vercel-domain.vercel.app
CORS_ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app
NODE_ENV=production
COOKIE_SECURE=true
COOKIE_SAMESITE=none
```

If you do not have the Vercel URL yet, temporarily set:

```env
CORS_ORIGIN=https://example.vercel.app
CORS_ALLOWED_ORIGINS=https://example.vercel.app
```

After Vercel deploys, replace those with the real frontend URL and redeploy Render.

## 5. Verify Backend

Open:

```txt
https://your-render-service.onrender.com/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "..."
}
```

If this fails, check Render logs for:

- missing `DATABASE_URL`
- missing or too-short `JWT_SECRET`
- Prisma migration errors
- TypeScript build errors

## 6. Seed Production Database

The start command runs migrations:

```bash
npm run deploy:start
```

That does not seed demo content. To add demo accounts, questions, tests, PYQs, and announcements, run this from Render Shell:

```bash
npm run seed
```

If Render Shell is unavailable, run it locally against Neon:

```bash
cd server
npm install
```

Temporarily put the Neon `DATABASE_URL` in `server/.env`, then run:

```bash
npm run seed
```

Do not commit `server/.env`.

## 7. Deploy Frontend On Vercel

Create a new Vercel project from the GitHub repo.

Use these settings:

```txt
Root Directory: client
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
```

Add these Vercel environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com/api
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

Deploy the frontend.

## 8. Disable Vercel Deployment Protection

For a public portfolio demo, visitors must be able to open the Vercel URL without logging into Vercel.

In Vercel:

1. Open the project.
2. Go to Settings.
3. Find Deployment Protection.
4. Disable protection for the public production deployment.
5. Redeploy or open the production URL again.

If the app redirects to `vercel.com/login`, deployment protection is still enabled.

## 9. Connect Frontend And Backend

After Vercel gives you the final URL, update Render:

```env
CORS_ORIGIN=https://your-vercel-domain.vercel.app
CORS_ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app
```

Then redeploy Render.

The value must match the browser origin exactly. Do not include a trailing slash.

Correct:

```txt
https://your-project.vercel.app
```

Wrong:

```txt
https://your-project.vercel.app/
```

## 10. Demo Login Test

Open the Vercel URL and test:

```txt
Student: demo.student@siddhant.dev / DemoPass123!
Admin:   demo.admin@siddhant.dev / DemoPass123!
```

Expected:

- Student logs in and reaches `/dashboard`
- Student can open tests, PYQs, results, and leaderboard
- Student cannot open admin pages
- Admin can open `/admin`
- Logout returns to login

## 11. Common Errors

### Login shows "Network Error"

Check Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com/api
```

Then redeploy Vercel. Public `NEXT_PUBLIC_*` values are baked into the frontend build.

### Login returns CORS error

Check Render:

```env
CORS_ORIGIN=https://your-vercel-domain.vercel.app
CORS_ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app
```

Redeploy Render.

### Login works in API test but not browser

Check Render cookie settings:

```env
COOKIE_SECURE=true
COOKIE_SAMESITE=none
NODE_ENV=production
```

### Frontend redirects to Vercel login

Disable Vercel Deployment Protection for the public deployment.

### Backend build fails on TypeScript types

Make sure `typescript` and required `@types/*` packages are available in `server/package.json` dependencies for Render builds.

### Backend build fails on moduleResolution node10

`server/tsconfig.json` should use:

```json
{
  "compilerOptions": {
    "module": "Node16",
    "moduleResolution": "node16"
  }
}
```

### Database is empty

Run:

```bash
npm run seed
```

### Render is slow after inactivity

This is normal on the free plan. The first request can be slow because the service wakes up.

## 12. Final Launch Checklist

- Backend `/health` returns `status: ok`
- Vercel page opens without Vercel login
- Vercel `NEXT_PUBLIC_API_URL` points to Render `/api`
- Render `CORS_ORIGIN` points to the exact Vercel origin
- Render has secure cookie settings
- Neon database has seed data
- Demo student login works
- Demo admin login works
- Student is blocked from admin API/pages
- No page is empty
- README links work
- Privacy, Cookies, and Terms pages are visible
- No secrets are committed
