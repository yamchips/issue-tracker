# [Issue Tracker](https://issue-tracker-gamma-puce.vercel.app/)

## Overview

A full-stack issue tracking application built with Next.js, Prisma, and Radix UI—refactored, optimized, and extended beyond Mosh Hamedani’s original tutorial.

## Key Difference with Mosh's 2023 Course

- Params and searchParams in Props are Promise type now
- PlantScale no longer offers free Hobby tier, use Aiven as production database
- Add registration page and credentials provider, users can register and log in to enable edit function
- Add status selector on issue detail page to update status

## Tech Stack

- Frontend: Next.js 15 (App Router), React 19, Radix UI, Tailwind CSS
- Backend: Prisma ORM (MySQL), REST API routes
- State Management: TanStack Query
- Auth: NextAuth v4 with Google OAuth
- Deployment: Vercel, Aiven MySQL
- Dev Tools: TypeScript, ESLint, Prettier, Sentry

## Features

- Create, view, update, and delete issues
- Assign users to issues with live assignee selector
- Dashboard with issue summary and bar chart visualization
- Google OAuth authentication via NextAuth
- Dynamic rendering with server and client components
- Role-based route protection and session handling

## Data Fetching & Caching

- Server-side Prisma queries in React Server Components
- `force-dynamic` rendering for up-to-date dashboard
- TanStack Query for client-side dynamic elements

## Authentication & Authorization

- Google login via NextAuth v4 + Prisma Adapter
- Session access with `getServerSession()`
- Middleware-protected routes for authenticated users
- Secure access to API routes

## Theming & UI

- Custom Radix UI Theme configuration
- Responsive grid and flex layouts using Radix and Tailwind

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/yamchips/issue-tracker.git
cd issue-tracker
npm install
```

### 2. Environment Variables

In .env.example file, necessary variables are given. Set the environment variables before continue.

### 3. Migrate and Run

```
npx prisma generate
npx prisma migrate deploy
npm run dev
```
