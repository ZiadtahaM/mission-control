# LaunchKit — Architecture & Developer Guide

> 3-developer team. Maintenance-first. Ship fast without breaking things.

---

## Stack at a Glance

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + Vite + Wouter | Fast HMR, small bundle, simple routing |
| Styling | Tailwind CSS v4 + shadcn/ui | Consistent tokens, no custom CSS drift |
| State | TanStack Query v5 | Server state, caching, background refetch |
| Forms | React Hook Form + Zod | Type-safe validation, no re-render storms |
| Backend | Express + Drizzle ORM | Familiar, composable, SQL-native |
| Database | PostgreSQL | ACID, reliable, Drizzle migrations |
| Auth | JWT (access 15m + refresh 7d) | Stateless, rotate on compromise |
| Payments | Stripe (webhooks + portal) | Industry standard, avoid custom billing logic |
| Testing | Vitest + Testing Library (FE) | Fast, browser-like, no Jest overhead |
| API Contract | OpenAPI → codegen | Single source of truth, auto-typed hooks |

---

## Project Structure

```
artifacts/
  saas-boilerplate/     # React frontend
    src/
      components/
        ErrorBoundary.tsx      # Catches React render errors
        CommandPalette.tsx     # ⌘K global navigation
        StatusBar.tsx          # Bottom system health bar
        OnboardingChecklist.tsx # First-run experience
        UsageAlert.tsx         # API limit warnings
        layout/
          AppLayout.tsx        # Wraps all authenticated pages
          Sidebar.tsx          # Navigation sidebar
      pages/                   # One file per route
      hooks/                   # Custom React hooks
      contexts/                # Auth context
      lib/                     # API client, utils
      __tests__/               # Vitest component tests

  api-server/           # Express backend
    src/
      routes/           # One file per feature area
      middleware/       # Auth, rate limit, validation
      db/               # Drizzle schema + migrations
      __tests__/        # Vitest integration tests

lib/
  api-spec/             # OpenAPI contract (source of truth)
  api-client-react/     # Auto-generated React Query hooks
```

---

## Key Architectural Decisions (ADRs)

### ADR-001: Contract-First API Design
**Decision:** OpenAPI spec in `lib/api-spec` drives all code generation.  
**Why:** 3 devs cannot afford frontend/backend drift. One schema → auto-typed hooks.  
**How:** `pnpm --filter @workspace/api-spec run codegen` regenerates clients.  
**Rule:** Never hand-write API calls. Always use generated hooks from `@workspace/api-client-react`.

### ADR-002: Error Boundaries at Route Level
**Decision:** Every authenticated page wrapped in `<ErrorBoundary>` via AppLayout.  
**Why:** A crash in one widget should not kill the whole dashboard.  
**Rule:** Wrap risky `<Card>` sections in their own `<ErrorBoundary name="widget-name">`.

### ADR-003: No Global State (except Auth)
**Decision:** TanStack Query owns all server state. No Redux, no Zustand.  
**Why:** Simpler mental model. 3 devs means 3x the chance of state bugs.  
**Rule:** If data comes from the API, it lives in Query. If it's local UI state, `useState`.

### ADR-004: Test After Every New Component
**Decision:** Every new component gets a test file in `__tests__/`.  
**Why:** 3 devs, no QA team. Tests are our safety net.  
**Minimum test bar:** renders without crash, error state shows correct UI, key interactions work.

### ADR-005: One Page = One File
**Decision:** `pages/` contains full page components. No sub-directories unless visualizer complexity demands it.  
**Why:** Easy to find. A new dev can read `ls pages/` and understand the whole product.

---

## Testing Strategy

### Frontend Tests (Vitest + Testing Library)
```bash
cd artifacts/saas-boilerplate
pnpm run test          # run all tests
pnpm run test:watch    # watch mode for development
```

**What to test:**
- Every component: renders without crash ✓
- Error states: shows correct fallback UI ✓
- Key user interactions: button clicks, form submits ✓
- Do NOT test: implementation details, internal state, Recharts rendering

**Pattern:**
```tsx
// Arrange
render(<ComponentName propA="value" />);
// Act
fireEvent.click(screen.getByRole("button", { name: /submit/i }));
// Assert
expect(screen.getByText("Success")).toBeInTheDocument();
```

### Backend Tests (Vitest)
```bash
cd artifacts/api-server
pnpm run test
```
57 tests covering auth, admin routes, webhooks. Add one test file per new route.

---

## Error Handling Patterns

### Frontend
```tsx
// 1. Component error → ErrorBoundary catches it
<ErrorBoundary name="chart-section">
  <RevenueChart />
</ErrorBoundary>

// 2. API error → show in toast
mut.mutate(data, {
  onError: (err) => toast({ title: err.message, variant: "destructive" }),
});

// 3. Query error → show empty state, not spinner forever
const { data, isError } = useGetDashboardKpis(...);
if (isError) return <EmptyState message="Could not load metrics" />;
```

### Backend
- All routes use `req.log` (pino), never `console.log`
- Zod validates inputs, returns field-level errors
- Rate limiting on all auth endpoints
- Soft deletes — never hard-delete user data

---

## Visual Identity System

Based on competitive research (Retool, Supabase, Appsmith, Firebase, Convex, Railway):

**Dark mode (default):** Navy `hsl(222,47%,7%)` + Indigo `hsl(245,75%,62%)`  
**Reasoning:** Developer trust (dark bg), premium positioning (indigo vs commodity green)

**Typography:**
- `Inter` — body, labels, UI
- `JetBrains Mono` — code, API keys, numbers

**Spacing:** 4px base, 4/8/12/16/20/24px scale — never odd values

**Color rules:**
- Primary (indigo) → actions, links, focus rings
- Emerald → success, active, uptime
- Amber → warnings, approaching limits  
- Destructive (red) → errors, ban, delete
- No brand gradients on interactive elements (buttons) — reserved for backgrounds

---

## Maintenance Guide (3-dev team)

### Adding a new page
1. Create `src/pages/yourpage.tsx`
2. Add route in `App.tsx`
3. Add nav item in `Sidebar.tsx` NAV array
4. Write test in `src/__tests__/yourpage.test.tsx`
5. Add OpenAPI route in `lib/api-spec` if backend needed → run codegen

### Adding a new API endpoint
1. Define in `lib/api-spec/openapi.yaml`
2. Run `pnpm --filter @workspace/api-spec run codegen`
3. Implement route in `artifacts/api-server/src/routes/`
4. Add Drizzle migration if schema changes
5. Add vitest test in `artifacts/api-server/src/__tests__/`

### Releasing / deploying
1. All vitest tests pass (`pnpm run test` in both packages)
2. TypeCheck passes (`pnpm run typecheck` at root)
3. Deploy via Replit Deploy button
4. Verify `/api/healthz` returns 200 in production

### Debug checklist (before asking teammates)
- Is the workflow running? (check Replit sidebar)
- Is PORT set? (common cause of vite crashes)
- Did you run codegen after changing OpenAPI spec?
- Is the ErrorBoundary showing? (means a component crashed, check browser console)

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | Replit Secret | PostgreSQL connection string |
| `SESSION_SECRET` | Replit Secret | JWT signing key |
| `PORT` | Workflow env | Vite/Express port (auto-set) |
| `BASE_PATH` | Workflow env | URL prefix (auto-set) |
| `STRIPE_SECRET_KEY` | Replit Secret | Stripe API (add when enabling payments) |
| `STRIPE_WEBHOOK_SECRET` | Replit Secret | Stripe webhook signature validation |

**Rule:** Never hardcode secrets. Never commit `.env`. Use Replit Secrets.
