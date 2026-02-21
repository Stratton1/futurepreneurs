# Areas for Improvement

> This document outlines key technical improvements recommended for the Futurepreneurs codebase.
> Generated: 2026-02-21

---

## 1. Automated Tests

The project currently has **zero automated tests**. The following test suites are needed for launch readiness:

### Unit Tests (Critical Business Logic)

| Test Area | What to Cover | Why |
|-----------|---------------|-----|
| **Fee calculations** | Platform fee (2.5%) applied correctly; rounding edge cases | Incorrect fees = financial loss or overcharging |
| **Funding status logic** | All-or-nothing: goal-met transitions, status: pending→held→collected→refunded | Payment lifecycle bugs are costly and hard to debug |
| **Milestone validation** | Milestone totals must equal goal amount; individual amounts must be positive | Invalid milestones could block drawdowns |
| **Quiz scoring** | Correct/incorrect counts, percentage calculation, edge case: no answers | Affects learning progress tracking and badge awards |
| **School domain validation** | Valid domains accepted, invalid rejected, case-insensitive matching | Student sign-up gate — broken validation blocks all registrations |
| **Input sanitization** | HTML stripping, length limits, XSS prevention in feedback/text fields | Security boundary for user-generated content |
| **Rate limiter** | Requests within limit pass; requests over limit blocked; window expiry | Broken rate limiter = either DoS vulnerability or locked-out users |

### Integration Tests

| Test Area | What to Cover | Why |
|-----------|---------------|-----|
| **Stripe checkout flow** | Session creation, metadata passing, redirect URLs | Broken checkout = zero revenue |
| **Webhook processing** | Idempotency (duplicate delivery), atomic increment, status transitions | Webhook bugs cause silent data corruption |
| **Drawdown approval chain** | Student requests → teacher approves → funds released | Multi-step approval is the trust anchor |
| **Consent flow** | Teacher approves → parent consent → project goes live | Broken flow means projects never go live |
| **Auth middleware** | Unauthenticated users redirected; role-based access enforced | Security boundary — must work correctly |

### End-to-End Tests

| Test Scenario | Steps | Why |
|---------------|-------|-----|
| **Full project lifecycle** | Student creates project → teacher verifies → parent consents → backer funds → goal met → student draws down | Validates the entire platform works together |
| **Guest checkout** | Anonymous backer finds project → backs it → payment succeeds | Guest checkout is a key conversion path |
| **Admin moderation** | Admin views reports → removes project → student notified | Platform safety for minors |

### Auth Tests

| Test Area | What to Cover | Why |
|-----------|---------------|-----|
| **Role-based access** | Students can't access teacher pages, teachers can't access admin | RBAC is critical for platform trust |
| **Middleware redirects** | /dashboard and /admin redirect to /login when unauthenticated | Prevents data leaks |
| **School email gate** | Student sign-up only with registered school domain | Core safety feature |

### Recommended Testing Stack
- **Framework:** Vitest (fast, TypeScript-native, works with Next.js)
- **Integration:** Vitest + Supabase test helpers (seeded test database)
- **E2E:** Playwright (browser-based, built into the project tooling)

---

## 2. Monolithic Server Action Files — Splitting Recommendations

### `src/app/dashboard/projects/actions.ts` (~640 lines, 8 exported functions)

**Problem:** This single file handles project CRUD, teacher verification, parent consent, and parent linking — four distinct concerns.

**Recommended split:**

| New File | Functions to Move | Responsibility |
|----------|-------------------|----------------|
| `project-crud.ts` | `createProject`, `updateProject` | Creating and editing draft projects |
| `verification-actions.ts` | `submitForVerification`, `approveProject`, `requestChanges`, `rejectProject` | Teacher review workflow |
| `consent-actions.ts` | `giveConsent`, `declineConsent` | Parent consent workflow |
| `parent-link-actions.ts` | `linkParentToProject` | Parent-student linking |

**Why:** Each file becomes testable in isolation. Code review is easier when changes are scoped to one concern. Import paths stay clean.

### `src/app/api/admin/seed/route.ts` (~620 lines)

**Problem:** Seed data (schools, users, projects, milestones, backings) is all inline in one route handler.

**Recommended split:**

| New File | Content |
|----------|---------|
| `seed-data/schools.ts` | School seed data array |
| `seed-data/users.ts` | User seed data (teachers, parents, students, investors) |
| `seed-data/projects.ts` | Project + milestone seed data |
| `route.ts` | Orchestration logic only — imports data, runs inserts |

**Why:** Easier to add/modify seed data. Route handler stays focused on orchestration.

### `src/app/dashboard/drawdowns/actions.ts` (~230 lines, 3 functions)

**Status:** Acceptable size. No split needed yet, but watch as drawdown logic grows.

---

## 3. Inconsistent Error Handling

### Current Patterns Found

| Pattern | Files Using It | Issue |
|---------|---------------|-------|
| `return { error: string }` | 12 server action files (168 instances) | Consistent — this is the standard |
| `console.error()` without returning error | `seed/route.ts` (3 cases) | Errors silently swallowed; execution continues |
| Try-catch with silent failure | `learning/actions.ts` L159, `email/resend.ts` L22, `badges.ts` L38-74 | No logging, no error surfaced to caller |
| Error logged but execution continues | `webhooks/stripe/route.ts` (2 cases), `seed/route.ts` (4 cases) | Partial failures cause inconsistent state |

### Specific Files with Issues

**`src/lib/email/resend.ts`** — `sendEmail()` catches all errors silently:
- Should log the error with `console.error` at minimum
- Email delivery failures should not crash the calling function, but should be logged for debugging

**`src/lib/badges.ts`** — All 4 badge functions ignore non-duplicate errors:
- Code `23505` (unique violation) is correctly ignored (badge already awarded)
- Other errors are silently swallowed — should be logged

**`src/app/dashboard/learning/actions.ts` L159** — `getTaskCompletionForLesson`:
- Empty catch block returns empty Set
- Comment says "Table may not exist yet" — should be removed once migration is applied

### Recommended Standard

All server actions and API routes should follow this pattern:
```typescript
// Success
return { success: true, data?: ... }

// Error
return { error: 'User-friendly message' }
// + console.error('Technical detail:', error) for debugging
```

Never: silently swallow errors, continue after critical failures, or return different shapes from the same function.

---

## 4. Hardcoded Strings

### Scope of the Problem

There are **200+ hardcoded user-facing strings** spread across 23 files. Categories:

| Category | Count | Example |
|----------|-------|---------|
| Error messages | ~170 | `'Only students can create projects'` |
| Notification titles/messages | ~25 | `'Your project is live!'` |
| UI labels | ~10 | `'Mark as Complete'`, `'Saving...'` |

### Already Centralised (Good)

- Project categories → `src/lib/constants.ts` (`PROJECT_CATEGORIES`)
- Role labels → `src/lib/constants.ts` (`USER_ROLE_LABELS`)
- Currency/fees → `src/lib/constants.ts`

### Recommended Approach

**Phase 1 (now):** Create `src/lib/error-messages.ts` for server-side error strings:
```typescript
export const ERRORS = {
  AUTH_REQUIRED: 'Not logged in',
  STUDENTS_ONLY: 'Only students can create projects',
  TEACHERS_ONLY: 'Only teachers can verify projects',
  PARENTS_ONLY: 'Only parents can give consent',
  PROJECT_NOT_FOUND: 'Project not found',
  // ... etc
} as const;
```

**Phase 2 (later):** If multi-language support is needed, migrate to an i18n library (e.g., `next-intl`).

**Why:** Centralised strings are easier to review, update, and keep consistent. Also enables future translation without touching business logic.

---

## 5. Loading & Error Boundaries

### Where They Are Needed

| Route | `loading.tsx` | `error.tsx` | Status |
|-------|:---:|:---:|--------|
| `/dashboard` | Added | Added | Done |
| `/dashboard/projects` | Needed | Needed | **To do** |
| `/dashboard/projects/[id]` | Needed | Needed | **To do** |
| `/dashboard/learning` | Needed | Needed | **To do** |
| `/dashboard/drawdowns` | Needed | Needed | **To do** |
| `/dashboard/notifications` | Needed | Needed | **To do** |
| `/dashboard/verify` | Needed | Needed | **To do** |
| `/dashboard/consent` | Needed | Needed | **To do** |
| `/dashboard/profile` | Needed | Needed | **To do** |
| `/admin` | Added | Added | Done |
| `/admin/users` | Inherited | Inherited | OK |
| `/admin/projects` | Inherited | Inherited | OK |
| `/admin/reports` | Inherited | Inherited | OK |
| `/projects` (public) | Needed | Needed | **To do** |
| `/projects/[id]` (public) | Needed | Needed | **To do** |

### What They Should Contain

**`loading.tsx`:**
- A spinner or skeleton UI matching the page layout
- Should be fast — no data fetching, pure static JSX
- Shared skeleton components could live in `src/components/ui/skeleton.tsx`

**`error.tsx`:**
- Must be a client component (`'use client'`)
- Shows user-friendly error message
- Provides a "Try again" button that calls `reset()`
- Optionally logs the error to a monitoring service

### Why This Matters

- Without `loading.tsx`: users see a blank white screen while server components render
- Without `error.tsx`: an unhandled error in any component crashes the entire page (or shows the default Next.js error page)
- Both are critical for perceived performance and reliability

### Implementation Pattern

```typescript
// loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="h-4 w-full bg-gray-200 rounded" />
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
    </div>
  );
}

// error.tsx
'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="text-center p-8">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## 6. Additional Improvements

### Database
- **Add indexes** on frequently queried columns: `backings.project_id`, `backings.backer_id`, `notifications.user_id`
- **Add `updated_at` triggers** on `projects` and `backings` tables for audit trail

### Monitoring
- **Add error logging service** (e.g., Sentry) for production error tracking
- **Add Stripe webhook logging** to a dedicated table for debugging payment issues

### Performance
- **Add `revalidateTag`** instead of `revalidatePath` for more granular cache invalidation
- **Optimistic updates** in client components (especially for task completion, notifications)

### Security
- **Add Content Security Policy** headers in `next.config.ts`
- **Add Stripe webhook IP allowlist** if deploying behind a CDN

---

*This document should be reviewed and updated as improvements are implemented.*
