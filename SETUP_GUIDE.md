# Local Setup Guide

This guide gets the project running on your computer.

## 1. Requirements

Install these first:

- Node.js 20 or newer
- npm
- Git
- A PostgreSQL database

Recommended database options:

- Neon PostgreSQL for both local and production testing
- Local PostgreSQL if you already have it installed

## 2. Clone The Repo

```bash
git clone https://github.com/SIDDHANTDEV42/mock-test-app.git
cd mock-test-app
```

If you already have the folder locally, just open it.

## 3. Backend Setup

Go to the backend folder:

```bash
cd server
npm install
```

Create `server/.env` from `server/.env.example`.

Example local backend `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
JWT_SECRET="local-development-secret-must-be-at-least-32-characters"
PORT=5000
NODE_ENV=development
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
CORS_ORIGIN=http://localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Important:

- Do not commit `server/.env`.
- `JWT_SECRET` must be at least 32 characters.
- `DATABASE_URL` must point to PostgreSQL, not SQLite.

Run Prisma:

```bash
npx prisma generate
npx prisma migrate deploy
```

Seed demo data:

```bash
npm run seed
```

Start backend:

```bash
npm run dev
```

Backend should run at:

```txt
http://localhost:5000
```

Health check:

```txt
http://localhost:5000/health
```

## 4. Frontend Setup

Open a second terminal.

```bash
cd client
npm install
```

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Start frontend:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## 5. Demo Accounts

After seeding:

```txt
Student
Email: demo.student@siddhant.dev
Password: DemoPass123!

Admin
Email: demo.admin@siddhant.dev
Password: DemoPass123!
```

## 6. Useful Commands

Backend:

```bash
cd server
npm run dev
npm run render-build
npm run seed
npx prisma migrate deploy
npx prisma generate
```

Frontend:

```bash
cd client
npm run dev
npm run build
npm run lint
```

## 7. Local Test Checklist

Student:

- Open login page
- Click Fill Student
- Login
- Open dashboard
- Open mock tests
- Open PYQ archive
- Open leaderboard
- Logout

Admin:

- Click Fill Admin
- Login
- Open admin dashboard
- Open questions page
- Open tests page
- Open users page
- Logout

Security checks:

- Student should not access admin pages
- Wrong password should fail
- Logout should clear session
- Backend `/health` should stay working

## 8. Troubleshooting

### Backend says missing DATABASE_URL

Create `server/.env` and add a valid PostgreSQL connection string.

### Backend says JWT_SECRET is too short

Use a longer value:

```env
JWT_SECRET="this-is-a-long-local-secret-with-more-than-32-characters"
```

### Login says Network Error locally

Check `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Check that the backend is running:

```txt
http://localhost:5000/health
```

### CORS or Forbidden origin locally

Check `server/.env`:

```env
CORS_ORIGIN=http://localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Restart the backend after changing env values.

### Database pages are empty

Run:

```bash
cd server
npm run seed
```

### Prisma client errors

Run:

```bash
cd server
npx prisma generate
```

## 9. Notes For Portfolio Demo

- The forgot-password page is transparent that no real email is sent unless an email provider is added.
- Demo credentials are intentionally visible on the login page.
- Do not put real user data into the public demo database.
- Do not commit secrets.
