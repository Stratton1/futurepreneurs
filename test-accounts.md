# Futurepreneurs — Test Accounts

**Password for ALL accounts:** `TestPass123!`

**School:** Greenfield Academy (email domain: greenfield.sch.uk, Manchester)

---

## Students (3)

| # | Full Name | Email | School |
|---|-----------|-------|--------|
| 1 | Emma Watson | emma.watson@greenfield.sch.uk | Greenfield Academy |
| 2 | James Patel | james.patel@greenfield.sch.uk | Greenfield Academy |
| 3 | Sophie Brown | sophie.brown@greenfield.sch.uk | Greenfield Academy |

**Parent links:**
- Emma Watson → Rachel Watson (parent)
- James Patel → Priya Patel (parent)

---

## Teachers (3)

| # | Full Name | Email | School |
|---|-----------|-------|--------|
| 1 | Mr David Clarke | d.clarke@greenfield.sch.uk | Greenfield Academy |
| 2 | Ms Sarah Thompson | s.thompson@greenfield.sch.uk | Greenfield Academy |
| 3 | Dr Robert Hughes | r.hughes@greenfield.sch.uk | Greenfield Academy |

---

## Parents (3)

| # | Full Name | Email | Linked Student |
|---|-----------|-------|----------------|
| 1 | Rachel Watson | rachel.watson@gmail.com | Emma Watson |
| 2 | Priya Patel | priya.patel@gmail.com | James Patel |
| 3 | Mark Brown | mark.brown@gmail.com | — |

---

## Investors / Backers (3)

| # | Full Name | Email |
|---|-----------|-------|
| 1 | Tom Bridges | tom.bridges@outlook.com |
| 2 | Aisha Khan | aisha.khan@yahoo.com |
| 3 | Lisa Chen | lisa.chen@outlook.com |

---

## Admins (3)

| # | Full Name | Email |
|---|-----------|-------|
| 1 | Admin One | admin@futurepreneurs.co.uk |
| 2 | Admin Two | admin2@futurepreneurs.co.uk |
| 3 | Admin Three | admin3@futurepreneurs.co.uk |

---

## Quick Reference — Testing Pairs

| Flow | Account 1 | Account 2 | Account 3 |
|------|-----------|-----------|-----------|
| Student creates → Teacher verifies | Emma Watson (student) | Mr David Clarke (teacher) | — |
| Full flow: create → verify → consent | Emma Watson | Mr David Clarke | Rachel Watson (parent) |
| Second student flow | James Patel (student) | Ms Sarah Thompson (teacher) | Priya Patel (parent) |
| Third student flow | Sophie Brown (student) | Dr Robert Hughes (teacher) | Mark Brown (parent) |
| Investor browses | Tom Bridges (investor) | — | — |

---

## How to Recreate

If you need to reset all accounts:

```bash
# Step 1: Seed the first 10 accounts
npm run seed

# Step 2: Seed the extra 5 accounts (3rd of each role)
npx tsx scripts/seed-extra-accounts.ts
```
