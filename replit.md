# LaunchKit — SaaS Boilerplate

## Overview

Full-stack white-label SaaS boilerplate built with React + Vite frontend, Express backend, Drizzle ORM, and PostgreSQL. Dark navy + indigo theme.

## Stack

- **Monorepo**: pnpm workspaces
- **Frontend**: React 19 + Vite, Tailwind CSS v4, shadcn/ui, Recharts, Wouter, React Hook Form, Zod
- **Backend**: Express 5, Drizzle ORM, PostgreSQL
- **Auth**: JWT (access + refresh tokens), bcrypt, 2FA (TOTP/speakeasy)
- **API**: OpenAPI spec → Orval codegen → React Query hooks + Zod schemas
- **Node.js**: 24 / TypeScript 5.9

## Packages

| Package | Description |
|---------|-------------|
| `artifacts/saas-boilerplate` | React+Vite frontend (port 21434, path `/`) |
| `artifacts/api-server` | Express API server (port 8080, path `/api`) |
| `lib/db` | Drizzle ORM schema + DB client |
| `lib/api-spec` | OpenAPI 3.1 spec + codegen script |
| `lib/api-client-react` | Generated React Query hooks + Zod schemas |
| `lib/api-zod` | Generated Zod schemas barrel export |

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema to database

## Features

### Authentication
- Register / Login / Logout
- JWT access tokens (15min) + refresh tokens (7 days)
- Password reset flow
- Email verification
- 2FA (TOTP via Google Authenticator)
- Session management

### Dashboard
- KPI cards: total users, MRR, DAU, API calls, churn rate, ARPU
- Revenue line chart (30 days)
- Plan distribution pie chart (Free/Pro/Enterprise)
- New signups bar chart (7 days)
- API latency metrics (P50/P95/P99)
- Live activity feed

### Admin Panel
- User management table with search, plan/role filters, pagination
- Ban/unban users
- Change user roles

### Billing
- Plan comparison cards (Free/Pro/Enterprise)
- Stripe checkout session (requires STRIPE_SECRET_KEY)
- Customer portal link
- Invoice history

### Profile
- Edit display name
- Change password
- 2FA setup/disable
- Active sessions list

### Settings
- API key display
- Notification preferences
- Danger zone (account deletion)

### Algorithm Visualizer
- **Sorting**: Bubble, Selection, Insertion, Merge, Quick, Heap, Radix, Tim Sort
- **Binary Search**: Step-by-step with pointer visualization
- **Dijkstra**: Interactive shortest path on weighted graphs
- **Binary Search Tree**: Insert, search, traversals (in/pre/post-order)
- **A\* Pathfinding**: Grid-based with wall drawing
- **BFS/DFS**: Side-by-side graph traversal comparison
- **Dynamic Programming**: 0/1 Knapsack + LCS with DP table visualization

## Demo Credentials

- **Admin**: `admin@launchkit.dev` / `Admin1234!` (SUPER_ADMIN, ENTERPRISE)
- **Pro user**: `pro@launchkit.dev` / `User1234!` (USER, PRO)
- **Free user**: `user@launchkit.dev` / `User1234!` (USER, FREE)

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (provided by Replit)
- `SESSION_SECRET` — JWT signing secret (set in Replit secrets)
- `STRIPE_SECRET_KEY` — Stripe secret key (optional, for billing)
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook secret (optional)

## DB Schema Tables

- `users` — user accounts with role/plan/2FA
- `sessions` — refresh token sessions
- `subscriptions` — Stripe subscription records
- `payment_events` — Stripe webhook events
- `audit_logs` — security audit trail
- `api_usage` — per-request API metrics
