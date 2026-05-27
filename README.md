# 📝 ExamPrep — Full-Stack Mock Test & Exam Preparation Platform

> A production-grade, full-stack web application for competitive exam preparation (JEE, MHT-CET, NEET). Students can take timed mock tests, generate custom practice tests, track detailed performance analytics, view previous year questions (PYQs), and compete on a leaderboard. Admins manage questions, tests, users, announcements, and view platform-wide analytics.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Database Schema (Prisma + SQLite)](#database-schema-prisma--sqlite)
- [Features — Detailed Breakdown](#features--detailed-breakdown)
  - [Authentication & Authorization](#1-authentication--authorization)
  - [Student Dashboard](#2-student-dashboard)
  - [Mock Tests & Test Engine](#3-mock-tests--test-engine)
  - [Custom Test Generator](#4-custom-test-generator)
  - [Previous Year Questions (PYQ)](#5-previous-year-questions-pyq)
  - [Results & Analytics](#6-results--analytics)
  - [Leaderboard](#7-leaderboard)
  - [Admin Panel](#8-admin-panel)
  - [Announcements](#9-announcements)
  - [Reviews & Ratings](#10-reviews--ratings)
- [API Endpoints (Complete Reference)](#api-endpoints-complete-reference)
- [Environment Variables](#environment-variables)
- [Security Features](#security-features)
- [Getting Started (Setup)](#getting-started-setup)
- [Running the App](#running-the-app)
- [Database Seeding](#database-seeding)
- [Deployment Notes](#deployment-notes)

---

## Overview

**ExamPrep** (internally called "Mock Test App") is a monorepo-style application with two primary components:

| Component | Technology | Port | Description |
|-----------|-----------|------|-------------|
| **Client** | Next.js 14 (React 18, TypeScript) | `3000` | Frontend SPA with SSR — landing page, auth forms, dashboard, test-taking UI, admin panel |
| **Server** | Express 5 (TypeScript) | `5000` | REST API backend — auth, CRUD, analytics, file uploads |

The client communicates with the server via Axios HTTP calls to `http://localhost:5000/api/*`, with authentication handled via **HttpOnly JWT cookies**.

---

## Tech Stack

### Frontend (Client)
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 14.1.0 | React framework with App Router, SSR, file-based routing |
| **React** | 18.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 3.3.x | Utility-first CSS styling |
| **Radix UI** | 1.0.2 | Accessible headless UI primitives (used via `@radix-ui/react-slot`) |
| **Recharts** | 3.8.0 | Charting library for analytics (bar charts, line charts, etc.) |
| **Lucide React** | 0.344.0 | Icon library |
| **Axios** | 1.6.7 | HTTP client for API calls |
| **@react-oauth/google** | 0.13.5 | Google OAuth integration |
| **class-variance-authority** | 0.7.0 | Component variant management (for the design system) |
| **clsx** + **tailwind-merge** | latest | Conditional class merging utilities |
| **tailwindcss-animate** | 1.0.7 | Animation utilities for Tailwind |

### Backend (Server)
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Express** | 5.2.1 | HTTP server framework |
| **TypeScript** | 5.9.3 | Type safety |
| **Prisma ORM** | 5.11.0 | Database ORM with auto-generated client |
| **SQLite** | — | File-based relational database (via Prisma) |
| **bcryptjs** | 3.0.3 | Password hashing (bcrypt algorithm) |
| **jsonwebtoken** | 9.0.3 | JWT token generation and verification |
| **Zod** | 4.3.6 | Schema validation for request bodies |
| **Helmet** | 8.1.0 | Security HTTP headers |
| **CORS** | 2.8.6 | Cross-Origin Resource Sharing configuration |
| **cookie-parser** | 1.4.7 | Parse cookies from requests |
| **google-auth-library** | 10.6.2 | Server-side Google OAuth token verification |
| **dotenv** | 17.3.1 | Environment variable management |
| **tsx** | 4.21.0 | TypeScript execution and hot-reload for development |

---

## Architecture

```
┌─────────────────────────┐         ┌─────────────────────────┐
│                         │  HTTP   │                         │
│   Next.js Frontend      │◄───────►│   Express API Server    │
│   (Port 3000)           │  REST   │   (Port 5000)           │
│                         │         │                         │
│  • App Router (SSR)     │         │  • Controllers          │
│  • AuthContext (React)  │  Cookies│  • Routes               │
│  • Tailwind CSS         │◄───────►│  • Middleware            │
│  • Recharts             │  (JWT)  │  • Zod Schemas          │
│  • Google OAuth         │         │  • Prisma ORM           │
│                         │         │                         │
└─────────────────────────┘         └────────────┬────────────┘
                                                 │
                                                 │ Prisma Client
                                                 ▼
                                    ┌─────────────────────────┐
                                    │                         │
                                    │   SQLite Database       │
                                    │   (File-based .db)      │
                                    │                         │
                                    │  • Users                │
                                    │  • Questions            │
                                    │  • Tests                │
                                    │  • Results              │
                                    │  • Reviews              │
                                    │  • Announcements        │
                                    │                         │
                                    └─────────────────────────┘
```

### Data Flow for a Typical Test Attempt:
1. Student logs in → JWT cookie is set via `HttpOnly` cookie
2. Student navigates to `/dashboard/mocks` → Frontend fetches `GET /api/tests`
3. Student starts a test → Frontend fetches `GET /api/tests/:id` (questions included)
4. Student answers questions, timer counts down on the client
5. On submission → Frontend sends `POST /api/tests/:id/results` with score, time spent, subject-wise stats, per-question timing
6. Backend stores the result in the `Result` table
7. Dashboard analytics recalculate on next load via `GET /api/questions/stats`

---

## Folder Structure

```
mock app/
├── README.md                         ← This file
├── SETUP_INSTRUCTIONS.md             ← Manual setup steps (env vars, OAuth, etc.)
├── run.bat                           ← One-click startup script (Windows)
│
├── client/                           ← Next.js Frontend Application
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── components.json               ← shadcn/ui configuration
│   ├── next-env.d.ts
│   ├── .env.local.example            ← Example client environment variables
│   │
│   └── src/
│       ├── app/                      ← Next.js App Router (pages)
│       │   ├── layout.tsx            ← Root layout (GoogleOAuthProvider + AuthProvider wrapping)
│       │   ├── page.tsx              ← Landing page (hero, features, stats, footer)
│       │   ├── globals.css           ← Global styles & Tailwind imports
│       │   ├── providers.tsx         ← Client-side providers wrapper
│       │   │
│       │   ├── auth/                 ← Authentication pages
│       │   │   ├── login/            ← Login page (email/password + Google OAuth)
│       │   │   ├── register/         ← Registration page (with stream selection)
│       │   │   ├── forgot-password/  ← Forgot password form
│       │   │   └── reset-password/   ← Reset password (via token)
│       │   │
│       │   ├── dashboard/            ← Student-facing dashboard
│       │   │   ├── page.tsx          ← Main dashboard (stats, charts, recent results)
│       │   │   ├── mocks/            ← List of available mock tests
│       │   │   ├── tests/            ← Test-taking interface (timer, questions, submission)
│       │   │   ├── results/          ← Detailed result analysis
│       │   │   ├── pyq/              ← Previous Year Questions browser
│       │   │   ├── pyqs/             ← PYQ alternate view
│       │   │   └── leaderboard/      ← Ranking leaderboard
│       │   │
│       │   └── admin/                ← Admin panel
│       │       ├── layout.tsx        ← Admin layout (sidebar navigation)
│       │       ├── page.tsx          ← Admin dashboard (overview stats)
│       │       ├── questions/        ← Question management (CRUD, bulk upload)
│       │       ├── tests/            ← Test management (create, schedule, lock/unlock)
│       │       ├── users/            ← User management (view, delete, view stats)
│       │       ├── results/          ← All student results (admin view)
│       │       ├── reviews/          ← Student reviews/feedback
│       │       └── announcements/    ← Create/delete announcements
│       │
│       ├── components/
│       │   └── ui/                   ← Reusable UI components (Button, Card, Input, etc.)
│       │
│       ├── context/
│       │   └── AuthContext.tsx       ← Global auth state (login, register, googleLogin, logout)
│       │
│       ├── lib/
│       │   ├── api.ts               ← Axios instance (baseURL, withCredentials)
│       │   └── utils.ts             ← Utility functions (cn for classnames)
│       │
│       └── types/
│           └── auth.ts              ← TypeScript interfaces (User, AuthState)
│
└── server/                           ← Express API Backend
    ├── package.json
    ├── tsconfig.json
    ├── start.js                      ← Production entry point
    ├── run_server.ps1                ← PowerShell start script
    ├── .env                          ← Active environment variables (GITIGNORED)
    ├── .env.example                  ← Template for environment variables
    │
    ├── prisma/
    │   ├── schema.prisma             ← Database schema definition (6 models)
    │   ├── seed.js                   ← Seed script (sample questions + test)
    │   └── make_admin.js             ← Script to promote a user to ADMIN role
    │
    ├── src/
    │   ├── index.ts                  ← Server entry point (Express app setup, middleware, routes)
    │   │
    │   ├── controllers/              ← Business logic handlers
    │   │   ├── auth.controller.ts    ← Register, Login, Logout, Google Login, Forgot/Reset Password
    │   │   ├── question.controller.ts← CRUD questions, bulk upload, dashboard stats, PYQ, admin stats
    │   │   ├── test.controller.ts    ← CRUD tests, custom test generator, submit results, scheduling
    │   │   ├── user.controller.ts    ← User listing, stats, deletion, leaderboard
    │   │   ├── review.controller.ts  ← Create and fetch reviews
    │   │   └── announcement.controller.ts ← Create, fetch, delete announcements
    │   │
    │   ├── routes/                   ← Express route definitions
    │   │   ├── auth.routes.ts        ← /api/auth/*
    │   │   ├── question.routes.ts    ← /api/questions/*
    │   │   ├── test.routes.ts        ← /api/tests/*
    │   │   ├── user.routes.ts        ← /api/users/*
    │   │   ├── review.routes.ts      ← /api/reviews/*
    │   │   └── announcement.routes.ts← /api/announcements/*
    │   │
    │   ├── middleware/
    │   │   ├── auth.middleware.ts     ← JWT authentication + role-based authorization (ADMIN check)
    │   │   ├── error.middleware.ts    ← Global error handler (AppError class) + 404 handler
    │   │   └── rateLimit.middleware.ts← In-memory IP-based rate limiter
    │   │
    │   ├── schemas/                  ← Zod validation schemas
    │   │   ├── auth.schema.ts        ← Login & Register validation
    │   │   ├── question.schema.ts    ← Question & Bulk upload validation
    │   │   └── test.schema.ts        ← Test creation, custom test, result submission validation
    │   │
    │   ├── lib/
    │   │   ├── prisma.ts             ← Prisma client singleton (prevents hot-reload connection leaks)
    │   │   └── logger.ts             ← Custom logger utility (info, warn, error with timestamps)
    │   │
    │   └── utils/
    │       └── jwt.ts                ← JWT sign & verify helper functions
    │
    ├── dist/                         ← Compiled JavaScript output (from tsc)
    │
    ├── direct_seed.js                ← Alternative direct seeding script
    ├── setup_admin.js                ← Admin setup utility
    ├── promote.js                    ← User role promotion script
    ├── sanitize_db.js                ← Database cleanup utility
    ├── check_count.js                ← Check record counts in DB
    ├── verify_api.js                 ← API endpoint verification script
    ├── verify_stats.js               ← Stats verification script
    ├── debug_delete.js               ← Debug deletion operations
    ├── debug_tests.js                ← Debug test data
    ├── inspect_tests.js              ← Inspect test records
    ├── inspect_tests_v2.js           ← Updated test inspection
    ├── delete_trail1.js              ← Data cleanup script
    └── test_api_logic.js             ← API logic test script
```

---

## Database Schema (Prisma + SQLite)

The database uses **SQLite** (file-based) managed through **Prisma ORM**. The schema is defined in `server/prisma/schema.prisma`.

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    User       │       │    Test       │       │   Question   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │───┐   │ id (PK)      │───┐   │ id (PK)      │
│ email (UQ)   │   │   │ title        │   │   │ text         │
│ password     │   │   │ description  │   │   │ options (JSON)│
│ name         │   │   │ duration     │   │   │ correctAnswer│
│ role         │   │   │ type         │   │   │ subject      │
│ isGlobalAdmin│   │   │ isCustom     │   │   │ chapter      │
│ stream       │   │   │ userId       │   │   │ level        │
│ resetToken   │   │   │ correctPoints│   │   │ imageUrl     │
│ resetTokenExp│   │   │ negativePoints│  │   │ year         │
│ createdAt    │   │   │ subjectMarks │   │   │ isPYQ        │
│ updatedAt    │   │   │ startTime    │   │   │ createdAt    │
└──────────────┘   │   │ endTime      │   │   │ updatedAt    │
                   │   │ isLocked     │   │   └──────┬───────┘
                   │   │ isAlwaysAvail│   │          │
                   │   │ createdAt    │   │   M:N (implicit
                   │   │ updatedAt    │   │   join table
                   │   └──────┬───────┘   │   _TestQuestions)
                   │          │           │          │
                   │          └───────────┼──────────┘
                   │                      │
                   │   ┌──────────────┐   │
                   ├──►│   Result      │◄──┘
                   │   ├──────────────┤
                   │   │ id (PK)      │
                   │   │ userId (FK)  │
                   │   │ testId (FK)  │
                   │   │ score        │
                   │   │ spentTime    │
                   │   │ wrongQuestions│ (JSON)
                   │   │ subjectStats │ (JSON)
                   │   │ timePerQ     │ (JSON)
                   │   │ completedAt  │
                   │   └──────────────┘
                   │
                   │   ┌──────────────┐
                   ├──►│   Review      │
                   │   ├──────────────┤
                   │   │ id (PK)      │
                   │   │ content      │
                   │   │ rating       │
                   │   │ userId (FK)  │
                   │   │ testId (FK)  │
                   │   │ createdAt    │
                   │   └──────────────┘
                   │
                   │   ┌──────────────────┐
                   │   │  Announcement     │
                   │   ├──────────────────┤
                   │   │ id (PK)          │
                   │   │ title            │
                   │   │ content          │
                   │   │ createdAt        │
                   │   └──────────────────┘
```

### Model Details

#### `User`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` (cuid) | Primary key |
| `email` | `String` (unique) | User's email address |
| `password` | `String` | Bcrypt-hashed password (empty string for Google OAuth users) |
| `name` | `String` | Display name |
| `role` | `String` | `"STUDENT"` (default) or `"ADMIN"` |
| `isGlobalAdmin` | `Boolean` | Super-admin flag |
| `stream` | `String?` | Academic stream: PCM, PCB, PCMB, etc. |
| `resetToken` | `String?` | Password reset token (crypto random hex) |
| `resetTokenExpiry` | `DateTime?` | Reset token expiry (1 hour from generation) |
| `results` | `Result[]` | One-to-many: user's test results |
| `reviews` | `Review[]` | One-to-many: user's test reviews |

#### `Question`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` (cuid) | Primary key |
| `text` | `String` | The question text |
| `options` | `String` | JSON-stringified array of option strings, e.g. `'["A","B","C","D"]'` |
| `correctAnswer` | `Int` | Zero-based index of the correct option |
| `subject` | `String` | Subject name (Physics, Chemistry, Mathematics, Biology, etc.) |
| `chapter` | `String?` | Chapter name within the subject |
| `level` | `String?` | Difficulty/exam level (JEE, CET, NEET, etc.) |
| `imageUrl` | `String?` | Optional image URL for the question |
| `year` | `Int?` | Year of the question (for PYQs) |
| `isPYQ` | `Boolean` | Whether this is a Previous Year Question |
| `tests` | `Test[]` | Many-to-many: which tests include this question |

#### `Test`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` (cuid) | Primary key |
| `title` | `String` | Test title |
| `description` | `String` | Test description |
| `duration` | `Int` | Duration in minutes |
| `type` | `String` | Test type: `"MOCK"` (default), or custom types |
| `isCustom` | `Boolean` | `true` if generated by a student via custom test generator |
| `userId` | `String?` | Creator user ID (for custom tests) |
| `correctPoints` | `Int` | Points awarded per correct answer (default: 4) |
| `negativePoints` | `Int` | Points deducted per wrong answer (default: 1) |
| `subjectMarks` | `String?` | JSON string for subject-wise mark distribution |
| `startTime` | `DateTime?` | Scheduled start time (for locked/scheduled tests) |
| `endTime` | `DateTime?` | Scheduled end time |
| `isLocked` | `Boolean` | If `true`, test is locked until `startTime` |
| `isAlwaysAvailable` | `Boolean` | If `true`, test has no time restrictions |
| `questions` | `Question[]` | Many-to-many: questions in this test |
| `results` | `Result[]` | One-to-many: submissions for this test |

#### `Result`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` (cuid) | Primary key |
| `userId` | `String` (FK) | References `User.id` |
| `testId` | `String` (FK) | References `Test.id` |
| `score` | `Int` | Final calculated score |
| `spentTime` | `Int` | Time spent in seconds |
| `wrongQuestions` | `String?` | JSON array of wrong question IDs |
| `subjectStats` | `String?` | JSON object: `{ "Physics": { "correct": 5, "total": 10 }, ... }` |
| `timePerQuestion` | `String?` | JSON object mapping question index → seconds spent |
| `completedAt` | `DateTime` | Timestamp of submission |

#### `Review`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` (cuid) | Primary key |
| `content` | `String` | Review text |
| `rating` | `Int?` | Numerical rating |
| `userId` | `String` (FK) | References `User.id` |
| `testId` | `String` (FK) | References `Test.id` |

#### `Announcement`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` (cuid) | Primary key |
| `title` | `String` | Announcement title |
| `content` | `String` | Announcement body text |
| `createdAt` | `DateTime` | Creation timestamp |

---

## Features — Detailed Breakdown

### 1. Authentication & Authorization

| Feature | Description |
|---------|-------------|
| **Email/Password Registration** | Users register with email, password, name, and optional academic stream (PCM/PCB/PCMB). Password is hashed with bcrypt (10 rounds). |
| **Email/Password Login** | Validates credentials, returns JWT in HttpOnly cookie (7-day expiry). |
| **Google OAuth Login** | One-click Google sign-in using `@react-oauth/google` on frontend and `google-auth-library` on backend. Auto-creates account if email doesn't exist. |
| **JWT Cookie Authentication** | All authenticated requests use an HttpOnly, SameSite=strict cookie. No tokens exposed to JavaScript. |
| **Session Persistence** | On page load, `AuthContext` calls `GET /api/auth/me` to restore session from cookie. |
| **Forgot Password** | Generates a crypto-random reset token (valid 1 hour), creates a reset link. Currently logs the link to server console (email integration is optional). |
| **Reset Password** | Validates token and expiry, hashes new password, clears reset token. |
| **Role-Based Access Control** | Two roles: `STUDENT` (default) and `ADMIN`. Middleware checks: `authenticate` (any logged-in user), `isAdmin`/`authorizeAdmin` (admin only). |
| **Rate Limiting** | Auth endpoints are rate-limited: 100 requests per 15 minutes per IP (in-memory store). |
| **Logout** | Clears the JWT cookie and redirects to login page. |

### 2. Student Dashboard

| Feature | Description |
|---------|-------------|
| **Overview Stats** | Displays: total available tests, total questions in bank, tests completed, average score, average time per question. |
| **Subject Performance Chart** | Bar/radar chart showing percentage accuracy per subject (aggregated across all attempts). Built with Recharts. |
| **Recent Results** | List of the 5 most recent test attempts with scores and timestamps. |
| **Quick Navigation** | Cards/buttons to jump to: Mock Tests, Custom Tests, PYQs, Leaderboard, Results History. |

### 3. Mock Tests & Test Engine

| Feature | Description |
|---------|-------------|
| **Test Listing** | Shows all non-custom tests with title, description, duration, question count, type. |
| **Test Scheduling** | Admin can set `startTime`, `endTime`, and `isLocked` to control test availability windows. Students see "Test not yet available" if locked. |
| **Test-Taking Interface** | Full-screen test UI with: question navigation, option selection, timer countdown, question flagging/review. |
| **Timer** | Client-side countdown timer based on test duration. Auto-submits when time expires. |
| **Question Display** | Parses JSON-stringified options from the database and displays as radio buttons. Supports optional question images via `imageUrl`. |
| **Marking Scheme** | Configurable per test: `correctPoints` (default 4) and `negativePoints` (default 1). Supports custom subject-wise marking via `subjectMarks`. |
| **Result Submission** | On submit, sends: `score`, `spentTime`, `wrongQuestions[]`, `subjectStats{}`, `timePerQuestion{}`. Stored as JSON strings in the Result model. |
| **Admin Controls** | Admins can: force-start a test, force-end a test, unlock a locked test, delete tests (cascade-deletes results, reviews, and question links). |

### 4. Custom Test Generator

| Feature | Description |
|---------|-------------|
| **Subject Filtering** | Select one or more subjects (Physics, Chemistry, Mathematics, Biology, etc.) |
| **Chapter Filtering** | Filter by specific chapters within selected subjects |
| **Question Count** | Specify how many questions to include |
| **Difficulty Level** | Filter by level (JEE, CET, NEET, etc.) |
| **PYQ-Only Mode** | Toggle to only include Previous Year Questions |
| **Question Priority** | Choose ordering: `RANDOM` (shuffled), `NEWEST` (most recent year first), `OLDEST` (oldest year first) |
| **Custom Duration** | Set your own timer duration in minutes |
| **Custom Title** | Name your practice test |
| **On-The-Fly Generation** | Questions are fetched from the database, filtered, shuffled/sorted, and a new `Test` record is created with `isCustom: true` |

### 5. Previous Year Questions (PYQ)

| Feature | Description |
|---------|-------------|
| **Hierarchical Browser** | PYQs are organized in a 3-level hierarchy: **Subject → Chapter → Year** |
| **Filtering** | Questions with `isPYQ: true` are fetched and grouped automatically |
| **Year Sorting** | Sorted by year descending (newest first) |
| **Practice Mode** | Students can browse and practice PYQs with answer reveals |

### 6. Results & Analytics

| Feature | Description |
|---------|-------------|
| **Results History** | Chronological list of all test attempts by the logged-in student |
| **Detailed Result View** | For each result: score, time spent, subject-wise breakdown, wrong questions highlighted, time-per-question analysis |
| **Subject-Wise Stats** | Aggregated accuracy per subject: `(correct / total) * 100` across all attempts |
| **Weak Area Detection** | Identifies the 3 weakest subjects by lowest accuracy percentage |
| **Average Time per Question** | Calculates average seconds spent per question across all attempts |
| **Score Trend** | Track score progression over time via recent results |

### 7. Leaderboard

| Feature | Description |
|---------|-------------|
| **Ranking System** | Students ranked by total cumulative score across all test attempts |
| **Stats per Student** | Displays: name, total score, tests taken, average score |
| **Top 50** | Shows the top 50 students who have taken at least 1 test |
| **Students Only** | Filters out ADMIN users from the leaderboard |

### 8. Admin Panel

The admin panel is a full CRUD management interface accessible only to users with `role: "ADMIN"`.

| Feature | Description |
|---------|-------------|
| **Admin Dashboard** | Overview stats: total questions, tests, users, results |
| **Question Management** | Create single questions, bulk upload via CSV/pipe-delimited format, delete questions |
| **Test Management** | Create tests by selecting questions, set marking scheme, schedule tests, lock/unlock, force start/end, delete tests |
| **User Management** | View all users (name, email, role, stream, join date), delete users (cascades to results, reviews, custom tests), view individual user stats |
| **Results Viewer** | View all student results across all tests with user/test info |
| **Review Management** | View all student reviews and ratings |
| **Announcement Management** | Create and delete platform-wide announcements |

#### Bulk Question Upload (CSV Format)
Questions can be bulk-uploaded using a pipe-delimited format:
```
Question Text|Option A, Option B, Option C, Option D|CorrectIndex|Subject|Chapter|Level|Year|isPYQ
```
- Minimum: `Question Text|Options` (2 fields)
- Defaults: correctAnswer=0, subject="General", chapter="Miscellaneous", level="JEE"
- Supports global overrides: `globalIsPYQ`, `globalYear`, `globalLevel`

### 9. Announcements

| Feature | Description |
|---------|-------------|
| **Create** | Admin creates announcements with title and content |
| **Display** | Announcements shown to all users, ordered by newest first |
| **Delete** | Admin can delete individual announcements |

### 10. Reviews & Ratings

| Feature | Description |
|---------|-------------|
| **Submit Review** | Students can review a test with text content and optional numerical rating |
| **View Reviews** | Reviews displayed with student name, test title, content, and timestamp |
| **Admin View** | Admins see all reviews in the admin panel |

---

## API Endpoints (Complete Reference)

### Authentication — `/api/auth`
| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| `POST` | `/register` | ❌ | ❌ | Register new user (rate limited) |
| `POST` | `/login` | ❌ | ❌ | Login with email/password (rate limited) |
| `POST` | `/logout` | ❌ | ❌ | Clear JWT cookie |
| `GET` | `/me` | ✅ | ❌ | Get current authenticated user info |
| `POST` | `/google` | ❌ | ❌ | Google OAuth login (rate limited) |
| `POST` | `/forgot-password` | ❌ | ❌ | Generate password reset token (rate limited) |
| `POST` | `/reset-password` | ❌ | ❌ | Reset password with token (rate limited) |

### Questions — `/api/questions`
| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| `POST` | `/` | ✅ | ❌ | Create a single question |
| `GET` | `/` | ✅ | ❌ | Get all questions (with parsed options) |
| `POST` | `/bulk` | ✅ | ❌ | Bulk upload questions (JSON array or CSV format) |
| `GET` | `/stats` | ✅ | ❌ | Get student dashboard stats (personalized) |
| `GET` | `/chapters` | ✅ | ✅ | Get distinct chapters (optionally filtered by subject) |
| `GET` | `/pyq` | ✅ | ❌ | Get all PYQs organized by Subject→Chapter→Year |
| `GET` | `/admin-results` | ✅ | ✅ | Get all results with user/test info (admin) |
| `DELETE` | `/` | ✅ | ✅ | Delete questions by IDs |
| `GET` | `/admin-stats` | ✅ | ✅ | Get admin overview stats (counts) |

### Tests — `/api/tests`
| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| `POST` | `/` | ✅ | ❌ | Create a new test |
| `GET` | `/` | ✅ | ❌ | Get all non-custom tests (with questions) |
| `GET` | `/results/me` | ✅ | ❌ | Get current user's results |
| `GET` | `/results/:id` | ✅ | ❌ | Get a specific result with test and questions |
| `GET` | `/:id` | ✅ | ❌ | Get a single test by ID (with schedule check) |
| `POST` | `/custom` | ✅ | ❌ | Generate a custom test |
| `POST` | `/:id/results` | ✅ | ❌ | Submit test result |
| `PATCH` | `/:id/unlock` | ✅ | ✅ | Unlock a locked test |
| `PATCH` | `/:id/start` | ✅ | ✅ | Force-start a test |
| `PATCH` | `/:id/end` | ✅ | ✅ | Force-end a test |
| `DELETE` | `/` | ✅ | ✅ | Delete tests by IDs (transactional cascade) |

### Users — `/api/users`
| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| `GET` | `/` | ✅ | ❌ | Get all users (id, email, name, role, stream, createdAt) |
| `GET` | `/leaderboard` | ✅ | ❌ | Get top 50 students by total score |
| `GET` | `/:id/stats` | ✅ | ❌ | Get specific user's stats (results, weak areas, avg time) |
| `DELETE` | `/` | ✅ | ❌ | Delete users by IDs (cascade to results, reviews, custom tests) |

### Reviews — `/api/reviews`
| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| `POST` | `/` | ✅ | ❌ | Submit a review for a test |
| `GET` | `/` | ✅ | ❌ | Get all reviews with user and test info |

### Announcements — `/api/announcements`
| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| `POST` | `/` | ✅ | ❌ | Create an announcement |
| `GET` | `/` | ❌ | ❌ | Get all announcements (newest first) |
| `DELETE` | `/:id` | ✅ | ❌ | Delete an announcement |

### Health Check
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | ❌ | Returns `{ status: 'ok', timestamp: '...' }` |

---

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | — | SQLite file path, e.g. `file:./dev.db` or `file:C:/path/to/db.db` |
| `JWT_SECRET` | ✅ | — | Secret key for JWT signing (use a long random string!) |
| `CORS_ORIGIN` | ✅ | `http://localhost:3000` | Allowed CORS origin (frontend URL) |
| `PORT` | ❌ | `5000` | Server port |
| `NODE_ENV` | ❌ | `development` | `development` or `production` |
| `GOOGLE_CLIENT_ID` | ❌ | — | Google OAuth Client ID (for Google login) |
| `GOOGLE_CLIENT_SECRET` | ❌ | — | Google OAuth Client Secret |

### Client (`client/.env.local`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ | `http://localhost:5000/api` | Backend API base URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | ❌ | — | Google OAuth Client ID (must match server) |

---

## Security Features

| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | bcrypt with 10 salt rounds |
| **JWT HttpOnly Cookies** | Tokens stored in HttpOnly, SameSite=strict cookies (inaccessible to JavaScript) |
| **Helmet** | Sets security HTTP headers (XSS protection, content type sniffing prevention, etc.) |
| **CORS** | Configured to only allow requests from `CORS_ORIGIN` |
| **Rate Limiting** | In-memory IP-based rate limiter on auth endpoints (100 req / 15 min) |
| **Input Validation** | All request bodies validated with Zod schemas before processing |
| **SQL Injection Protection** | Prisma ORM uses parameterized queries |
| **Error Sanitization** | Stack traces only exposed in development mode |
| **Role-Based Access** | `isAdmin` middleware guards admin-only endpoints |
| **Secure Cookie Settings** | `secure: true` in production, `sameSite: 'strict'` always |
| **Password Reset Tokens** | Crypto-random 32-byte hex strings with 1-hour expiry |
| **Prisma Singleton** | Prevents connection pool exhaustion during hot-reload in development |

---

## Getting Started (Setup)

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **Git** (optional)

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

```bash
# Server
cd server
cp .env.example .env
# Edit .env with your actual values (especially JWT_SECRET and DATABASE_URL)

# Client
cd ../client
cp .env.local.example .env.local
# Edit .env.local if needed
```

### 3. Initialize the Database

```bash
cd server

# Generate Prisma client
npx prisma generate

# Push schema to database (creates the .db file)
npx prisma db push

# (Optional) Seed sample data
node prisma/seed.js
```

### 4. (Optional) Create an Admin User

```bash
# First register a user through the app, then promote them:
cd server
node prisma/make_admin.js
# Or use: node setup_admin.js
```

---

## Running the App

### Option A: One-Click (Windows)
Double-click `run.bat` or run it from terminal:
```bash
.\run.bat
```
This opens two terminal windows — one for the server, one for the client.

### Option B: Manual (Two Terminals)

**Terminal 1 — Server:**
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Client:**
```bash
cd client
npm run dev
# Client starts on http://localhost:3000
```

### Access Points
| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Frontend application |
| `http://localhost:5000/health` | Server health check |
| `http://localhost:3000/auth/login` | Login page |
| `http://localhost:3000/auth/register` | Registration page |
| `http://localhost:3000/dashboard` | Student dashboard |
| `http://localhost:3000/admin` | Admin panel |

---

## Database Seeding

The seed script (`server/prisma/seed.js`) creates:
- 3 sample questions (Physics, Chemistry, Mathematics)
- 1 sample mock test ("MHT CET Full Mock 1") with 2 questions

Run it:
```bash
cd server
node prisma/seed.js
```

For more data, use the direct seed script:
```bash
node direct_seed.js
```

---

## Deployment Notes

### Production Build

```bash
# Build the client
cd client
npm run build
npm start

# Build the server
cd server
npm run build
npm start
```

### Production Checklist
- [ ] Set `NODE_ENV=production` in server `.env`
- [ ] Use a strong, random `JWT_SECRET` (32+ characters)
- [ ] Move the SQLite database to a secure, non-public directory
- [ ] Configure `CORS_ORIGIN` to your production frontend URL
- [ ] Set up Google OAuth with production redirect URIs
- [ ] Consider migrating from SQLite to PostgreSQL for multi-user concurrency
- [ ] Set up a reverse proxy (Nginx/Caddy) in front of Express
- [ ] Enable HTTPS
- [ ] Configure email service for password reset emails
- [ ] Set up database backups

---

## Scripts Reference

| Script | Location | Description |
|--------|----------|-------------|
| `npm run dev` | client/ | Start Next.js dev server with hot reload |
| `npm run build` | client/ | Build Next.js production bundle |
| `npm run dev` | server/ | Start Express dev server with tsx watch mode |
| `npm run build` | server/ | Compile TypeScript to JavaScript |
| `npm start` | server/ | Run compiled production server |
| `run.bat` | root | Launch both client and server (Windows) |
| `npx prisma generate` | server/ | Regenerate Prisma client |
| `npx prisma db push` | server/ | Push schema changes to database |
| `npx prisma studio` | server/ | Open Prisma Studio (visual DB editor) |
| `node prisma/seed.js` | server/ | Seed the database with sample data |
| `node prisma/make_admin.js` | server/ | Promote a user to admin |

---

## Key Design Decisions

1. **SQLite over PostgreSQL**: Chosen for zero-config local development. Easily swappable via Prisma's provider config.
2. **HttpOnly Cookies over LocalStorage**: Prevents XSS attacks from accessing JWT tokens.
3. **Zod for Validation**: Runtime type checking on all API inputs, with descriptive error messages.
4. **JSON-in-String Pattern**: Question options, subject stats, and time-per-question data are stored as JSON strings in SQLite (since SQLite doesn't support native JSON columns).
5. **Prisma Singleton**: A global Prisma instance prevents connection pool exhaustion during Next.js/tsx hot-reload.
6. **Custom Rate Limiter**: In-memory IP-based implementation (no Redis dependency for simplicity).
7. **Monorepo Structure**: Client and server live side-by-side but have independent `package.json` and `node_modules`.

---

## License

ISC

---

*Built with ❤️ for competitive exam aspirants preparing for JEE, MHT-CET, and NEET.*
