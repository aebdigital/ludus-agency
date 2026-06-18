# Ludus — Theater School Student Database

A polished SaaS demo for managing a theater school's student records: physical/casting
attributes, parent documents, photos & videos, productions and more. **All data is
hardcoded** for now (see [`lib/data.ts`](lib/data.ts)) — no backend required.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and a small
hand-rolled **shadcn-style** component kit.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm run start   # production build
```

## Pages

The UI is in **Slovak**.

| Route | What's there |
|-------|--------------|
| `/` | Redirects to `/students` |
| `/students` | Student directory with **grid/table views** and rich filtering: search, program, status, eye color, hair color, gender, age range, height range, casting-ready and pending-documents toggles, plus sorting |
| `/students/[id]` | Student profile — casting attributes (height, weight, eyes, hair, shoe, clothing, voice), personal details, guardian & emergency contacts, skills/languages, bio, and tabs for **Documents** and **Media** (photos & videos) — each student's files live on their own profile |
| `/productions` | Productions board with casting progress |
| `/settings` | Studio profile, configurable record fields, team access |

## Structure

```
app/                 routes (App Router)
components/ui/        shadcn-style primitives (button, card, badge, tabs, table, …)
components/shared/    badges, student card, media tile, page header
components/layout/    sidebar + topbar app shell
lib/data.ts          ← hardcoded student / document / media data
lib/utils.ts         cn(), gradient + date helpers
```

To wire up a real backend later, replace the exports in `lib/data.ts` with API/database
calls — the component layer stays the same.
