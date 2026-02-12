# Product Dashboard / Thirtee6 (Next.js 14 + Prisma + PostgreSQL)

Modern admin dashboard with **simple admin login** and **Products CRUD** (create, edit, delete, list).

## Tech

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL (Supabase‑compatible)

## Features

- Admin login (no OAuth)
- Admin dashboard
- Products CRUD:
  - Add product (name, price, description, image URL)
  - Edit product
  - Delete product
  - List products in a table
- Clean modern UI
- Prisma schema + seed script

---

## 1) Prerequisites

Install **Node.js 18+** (recommended Node 20 LTS).

Then verify:

```bash
node -v
npm -v
```

## 2) Setup

From the project root:

```bash
npm install
```

Create your `.env` file:

```bash
copy .env.example .env
```

Update `.env` (set `DATABASE_URL`, `JWT_SECRET`, etc. – see below).

## 3) Database (PostgreSQL / Supabase)

Create the database (e.g. locally with Postgres, or in Supabase), then run migrations:

```bash
npx prisma migrate dev --name init
```

Seed admin + sample Thirtee6 products:

```bash
npx prisma db seed
```

Optional (browse DB):

```bash
npx prisma studio
```

## 4) Run

```bash
npm run dev
```

Open:

- Home: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`
- Admin login: `http://localhost:3000/admin/login`

### Default admin credentials (seed)

- Email: `admin@example.com`
- Password: `admin12345`

You can override these via `.env`:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

---

## Folder structure

```
src/
  app/
    admin/
      actions.ts
      login/
      products/
  components/
    admin/
    ui/
  lib/
    auth.ts
    prisma.ts
prisma/
  schema.prisma
  seed.ts
```

---

## Deployment (Vercel)
@@

## Environment variables

Set these locally in `.env` and in Vercel / Supabase dashboards:

- `DATABASE_URL` – Postgres connection string (e.g. from Supabase)
- `JWT_SECRET` – long random string for signing admin JWT cookies
- `ADMIN_EMAIL` – seeded admin email (optional override)
- `ADMIN_PASSWORD` – seeded admin password (optional override)
 - `SUPABASE_URL` – Supabase project URL (e.g. `https://xyz.supabase.co`)
 - `SUPABASE_ANON_KEY` – Supabase anon key (for any future public usage)
 - `SUPABASE_SERVICE_ROLE_KEY` – Supabase service role key (**server-only**, never exposed to the browser)

For Supabase, `DATABASE_URL` will look like:

```bash
DATABASE_URL="postgresql://postgres:<password>@db.<hash>.supabase.co:5432/postgres"
```

If you’re migrating from the old SQLite setup, you will need to **re-seed** your database; Prisma does not automatically migrate existing SQLite data into Postgres.

---

## Supabase setup

1. Create a new Supabase project.
2. Copy the SQL connection string from the **Database** section into `DATABASE_URL`.
3. In your local `.env`, set the same `DATABASE_URL` so migrations/seed run against Supabase.
4. In Supabase, create a **Storage** bucket named `products` and mark it as **public**.
5. Run:

```bash
npx prisma migrate deploy
npx prisma db seed
```

This will create the `AdminUser` and `Product` tables (with Thirtee6‑specific fields like `fit`, `gsm`, `fabric`, `status`).

Images uploaded from the admin will be stored in the `products` bucket and the public URL saved on each product. Uploads are handled server-side using the `SUPABASE_SERVICE_ROLE_KEY`; the key is never sent to the browser.

---

## Deployment (Vercel)

1. Push this repo to GitHub/GitLab.
2. Create a new Vercel project and select this repository.
3. In Vercel **Environment Variables**, set:
   - `DATABASE_URL` – same value as used for migrations (Supabase or other Postgres)
   - `JWT_SECRET` – long random string
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` (optional overrides)
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
4. Trigger a deployment; Vercel will run `next build`.
5. After first deploy, run migrations against production DB (for example from your local machine):

```bash
npx prisma migrate deploy
npx prisma db seed
```

Notes:

- The app uses **JWT cookies** with `httpOnly` and `secure` (in production) flags.
- `/admin/*` routes are protected by Next.js middleware and **disallowed in `robots.txt`**.
- No filesystem‑based persistence is used; all state is in Postgres, and images are stored in Supabase Storage, both safe for serverless.

