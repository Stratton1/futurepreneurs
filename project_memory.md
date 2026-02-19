# Project Memory — Futurepreneurs

**Purpose:** Quick-reference file for key decisions, patterns, and context that should persist across sessions.

**Last Updated:** 2026-02-19

---

## Key Facts

- **Owner:** Joseph (non-technical, prefers plain English)
- **Platform:** Crowdfunding for under-18s to fund business ideas
- **Currency:** GBP (£) only, UK-focused
- **Max funding:** £10,000 per project
- **Funding model:** All-or-nothing, no time limit
- **Platform fee:** 2.5% on successfully funded projects
- **Drawdowns:** Milestone-based, teacher-approved

## User Roles

| Role | Key Capabilities |
|------|-----------------|
| Student | Creates projects, sets milestones, requests drawdowns. Must use school email. |
| Teacher/Mentor | Verifies students, approves projects and drawdowns. Trust anchor. |
| Parent | Gives consent, observes activity. Cannot approve/reject. |
| Investor/Backer | Browses and funds projects. Can use guest checkout. |
| Admin | Manages platform, moderates content, views all data. |

## Tech Stack

- Next.js 14+ (App Router) + Tailwind CSS
- Supabase (PostgreSQL, Auth, Storage)
- Stripe (Payments, Connect for disbursements)
- Resend (Transactional email)
- Vercel (Hosting)
- TypeScript strict mode

## Important Patterns & Conventions

- File names: `kebab-case`
- Components: `PascalCase`
- DB tables: `snake_case`
- Env vars: `UPPER_SNAKE_CASE`
- Commit style: `type: short description`

## School Email Validation

- Students MUST sign up with a school-issued email (e.g., `.sch.uk`, `.ac.uk`, or domain matched to a registered school)
- The `schools` table stores approved school email domains
- Validation happens at sign-up time

## Safety Non-Negotiables

1. School email validation for all students
2. Teacher must verify every project before it goes live
3. Parent must consent before project goes live
4. Milestone-based drawdowns only (no lump sums)
5. Teacher approves every drawdown request
6. Full audit trail on all financial actions
7. Content moderation tools for admin
8. GDPR-aware — extra care with minors' data

## Current Phase

- **Phase 1: Foundation & Auth** — IN PROGRESS
- Status: Starting scaffolding and auth setup

## Blockers / Open Questions

- None currently
