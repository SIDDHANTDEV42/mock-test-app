# Free Deployment Guide

This guide is written for a first deployment. Follow it slowly, one box at a time.

## What Goes Where

- Frontend: Vercel
- Backend API: Render
- Database: Neon Postgres

Your local computer is only for building/testing. The published app needs a cloud database, so this repo now uses Prisma with PostgreSQL.

## Demo Accounts

After you seed the deployed database, the login page can use:

- Admin: `demo.admin@siddhant.dev`
- Student: `demo.student@siddhant.dev`
- Password: `DemoPass123!`

## Step 1: Push The Code To GitHub

1. Make a GitHub account if you do not have one.
2. Create a new repository on GitHub.
3. Keep it private while testing.
4. Push this whole project folder to that repository.

Do not upload `.env`, `.env.local`, database files, or secrets. They are already ignored by `.gitignore`.

## Step 2: Create The Free Database On Neon

1. Go to `https://neon.tech`.
2. Sign up with GitHub.
3. Create a new project.
4. Choose the free plan.
5. Copy the connection string.
6. It should look like:

```env
postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require
```

Keep this safe. This is your `DATABASE_URL`.

## Step 3: Deploy The Backend On Render

1. Go to `https://render.com`.
2. Sign up with GitHub.
3. Click `New`.
4. Choose `Web Service`.
5. Connect your GitHub repo.
6. If Render asks for a root directory, use:

```txt
server
```

7. Use these settings:

```txt
Name: examprep-showcase-api
Runtime: Node
Build Command: npm install && npm run render-build
Start Command: npm run deploy:start
Plan: Free
```

8. Add these environment variables in Render:

```env
DATABASE_URL=your_neon_connection_string
JWT_SECRET=make-this-at-least-32-characters-long-and-random
CORS_ORIGIN=https://your-vercel-url.vercel.app
NODE_ENV=production
COOKIE_SECURE=true
COOKIE_SAMESITE=none
```

At this moment you do not know the Vercel URL yet. Put a temporary value like:

```env
CORS_ORIGIN=https://example.vercel.app
```

You will replace it after Vercel deploys.

9. Click deploy.
10. When Render finishes, open:

```txt
https://your-render-service.onrender.com/health
```

If it says `status: ok`, the backend is alive.

## Step 4: Seed The Backend Database

Render creates your tables automatically through:

```txt
npm run deploy:start
```

But the demo users/questions/tests are added by the seed script.

In Render:

1. Open your backend service.
2. Open the `Shell` tab.
3. Run:

```bash
npm run seed
```

If the shell is not available on your free plan, use Render's manual job/shell option if available. If that is unavailable, run the seed from your computer after setting `server/.env` to the Neon `DATABASE_URL`.

## Step 5: Deploy The Frontend On Vercel

1. Go to `https://vercel.com`.
2. Sign up with GitHub.
3. Click `Add New Project`.
4. Import this GitHub repo.
5. Set the root directory to:

```txt
client
```

6. Add this environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com/api
```

7. Click deploy.

When it finishes, Vercel gives you a URL like:

```txt
https://your-project.vercel.app
```

## Step 6: Connect Frontend And Backend

Go back to Render.

Change:

```env
CORS_ORIGIN=https://example.vercel.app
```

to your real Vercel URL:

```env
CORS_ORIGIN=https://your-project.vercel.app
```

Then redeploy the Render backend.

## Step 7: Test It Like A Visitor

1. Open your Vercel URL.
2. Click demo login.
3. Click `Fill Student`.
4. Sign in.
5. Open dashboard, tests, PYQ archive, and results.
6. Log out.
7. Click `Fill Admin`.
8. Sign in and check admin pages.

## Common Problems

### Login says network error

Check Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com/api
```

Check Render:

```env
CORS_ORIGIN=https://your-project.vercel.app
```

### Login works locally but not online

Make sure Render has:

```env
COOKIE_SECURE=true
COOKIE_SAMESITE=none
```

### Database is empty

Run this in the Render shell:

```bash
npm run seed
```

### Render backend sleeps

Free Render services may sleep when nobody uses them. The first request can be slow. This is normal on the free plan.

## Final Launch Checklist

- GitHub repo has no `.env` files.
- Neon database is created.
- Render backend `/health` returns `status: ok`.
- Vercel frontend opens.
- Vercel `NEXT_PUBLIC_API_URL` points to Render.
- Render `CORS_ORIGIN` points to Vercel.
- Demo student login works.
- Demo admin login works.
- No page is empty.
