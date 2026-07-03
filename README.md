# ExamPrep Showcase

A full-stack mock test and exam preparation platform built as a portfolio showcase by Siddhant Gupta.

ExamPrep Showcase lets students sign in, explore mock tests, review previous year questions, track results, view leaderboards, and use a seeded demo account. Admin users can manage the question bank, tests, announcements, users, reviews, and results from a protected admin area.

This project is designed to demonstrate full-stack product thinking, authentication, role-based access, database-backed content, server-side scoring, deployment readiness, and security-aware engineering.

## Live Stack

- Frontend: Next.js on Vercel
- Backend: Express API on Render
- Database: Neon PostgreSQL
- ORM: Prisma
- Auth: JWT stored in HttpOnly cookies

## Demo Credentials

Use these accounts after the database has been seeded:

```txt
Student
Email: demo.student@siddhant.dev
Password: DemoPass123!

Admin
Email: demo.admin@siddhant.dev
Password: DemoPass123!
```

## Features

### Student Experience

- Secure email/password login
- Portfolio demo credentials shown on the login page
- Student dashboard with progress summary
- Mock test listing
- Timed test-taking flow
- Server-side result scoring
- Results history
- Leaderboard
- PYQ archive grouped by subject and chapter
- Reviews and announcements

### Admin Experience

- Role-protected admin dashboard
- Question management
- Test management
- User listing
- Review management
- Announcement management
- Results overview

### Security and Production Readiness

- JWT stored in HttpOnly cookies
- Secure cookie mode for production
- SameSite cookie configuration for cross-site frontend/backend deployment
- CORS restricted to configured frontend origin
- CSRF origin/referer checks for unsafe requests
- Password hashing with bcrypt
- Server-side scoring to reduce score tampering
- Student access blocked from admin-only API routes
- Correct answers hidden from normal student question-bank responses
- Environment variables kept out of source control

## Tech Stack

### Frontend

- Next.js 16
- React 18
- TypeScript
- Tailwind CSS
- Axios
- Recharts
- Lucide React
- Radix Slot

### Backend

- Node.js
- Express 5
- TypeScript
- Prisma
- PostgreSQL
- bcryptjs
- jsonwebtoken
- Zod
- Helmet
- CORS
- cookie-parser

### Database

- Neon PostgreSQL in production
- PostgreSQL-compatible local development database
- Prisma migrations
- Seed script for demo users, questions, tests, announcements, results, and PYQs

## Folder Structure

```txt
mock-test-app/
  client/                 Next.js frontend
    src/app/              App Router pages
    src/components/       Shared UI components
    src/context/          Auth context
    src/lib/              API client and helpers
  server/                 Express backend
    src/controllers/      Route handlers
    src/middleware/       Auth, CSRF, errors, rate limit
    src/routes/           API routes
    src/schemas/          Zod validation
    src/utils/            JWT and helper utilities
    prisma/               Prisma schema, migrations, seed script
  DEPLOYMENT.md           Production deployment guide
  SETUP_GUIDE.md          Local setup guide
  render.yaml             Render service blueprint
```

## API Overview

Backend base URL:

```txt
http://localhost:5000/api
```

Production backend base URL:

```txt
https://examprep-showcase-api.onrender.com/api
```

Main route groups:

```txt
/api/auth
/api/questions
/api/tests
/api/users
/api/reviews
/api/announcements
```

Health check:

```txt
GET /health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "..."
}
```

## Local Development

Read the full local setup guide:

[SETUP_GUIDE.md](./SETUP_GUIDE.md)

Quick start:

```bash
cd server
npm install
npx prisma migrate deploy
npm run seed
npm run dev
```

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Then open:

```txt
http://localhost:3000
```

## Environment Variables

Backend variables live in `server/.env`.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
JWT_SECRET="use-a-long-random-secret-at-least-32-characters"
PORT=5000
NODE_ENV=development
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
CORS_ORIGIN=http://localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Frontend variables live in `client/.env.local`.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production, set:

```env
NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com/api
```

Never commit `.env`, `.env.local`, database URLs, JWT secrets, or API keys.

## Deployment

Read the full deployment guide:

[DEPLOYMENT.md](./DEPLOYMENT.md)

Recommended production setup:

- Neon for PostgreSQL
- Render for backend API
- Vercel for frontend

Important production values:

Render:

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_long_random_secret
CORS_ORIGIN=https://your-vercel-domain.vercel.app
CORS_ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app
NODE_ENV=production
COOKIE_SECURE=true
COOKIE_SAMESITE=none
```

Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com/api
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

## Production Checklist

- Backend `/health` returns `status: ok`
- Render build command is `npm install && npm run render-build`
- Render start command is `npm run deploy:start`
- Vercel root directory is `client`
- Render root directory is `server`
- Vercel deployment protection is disabled for public demo access
- Vercel `NEXT_PUBLIC_API_URL` points to Render `/api`
- Render `CORS_ORIGIN` exactly matches the public Vercel URL
- Render cookies use `COOKIE_SECURE=true` and `COOKIE_SAMESITE=none`
- Database migrations have run
- Seed data exists
- Demo student login works
- Demo admin login works
- Student cannot open admin API routes
- No secrets are committed

## Known Notes

- The forgot-password flow is a portfolio demo flow. It does not send real email unless an email provider is added later.
- Google OAuth server code exists, but the demo is primarily email/password based unless Google credentials are configured.
- Render free services may sleep after inactivity. The first request after sleep can be slow.
- This project is a portfolio showcase, not an official exam provider.

## Author

Built by Siddhant Gupta.

Links used in the project:

- GitHub: https://github.com/SIDDHANTDEV42
- Siddhant.dev Instagram: https://www.instagram.com/siddhant.dev42/?hl=en
- SN.dev Instagram: https://www.instagram.com/sn.dev2425/
- Portfolio: placeholder until final URL is added
- LinkedIn: placeholder until final URL is added

## License

Copyright (c) 2026 Siddhant Gupta. All rights reserved unless a separate license is added.
