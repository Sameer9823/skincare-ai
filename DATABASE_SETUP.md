# Database setup (Neon + Prisma + Auth.js)

History is stored in Postgres via Prisma, scoped to the signed-in user's
account (see [AUTH_SETUP.md](./AUTH_SETUP.md) for configuring sign-in).

## 1. Create a Neon project

1. Go to https://neon.tech and create a free project/database.
2. In the Neon dashboard, open **Connection Details** and copy:
   - The **pooled** connection string → use for `DATABASE_URL`
   - The **direct** connection string → use for `DIRECT_URL`
   (Prisma needs a direct, non-pooled connection to run migrations.)

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `DATABASE_URL`, `DIRECT_URL`, and `OPENAI_API_KEY` in `.env.local`.

## 3. Install dependencies and generate the Prisma client

```bash
npm install --legacy-peer-deps
```

`npm install` automatically runs `prisma generate` via the `postinstall`
script. If you ever change `prisma/schema.prisma`, re-run it manually:

```bash
npm run db:generate
```

## 4. Run the migration to create the table in Neon

```bash
npm run db:migrate
```

This creates the `DiagnosisRecord` table in your Neon database and creates a
migration file under `prisma/migrations/`.

## 5. (Optional) Browse your data

```bash
npm run db:studio
```

Opens Prisma Studio, a GUI for viewing/editing rows in your Neon database.

## How history is scoped

Every `DiagnosisRecord` belongs to a `User` (via `userId`). The
`/api/history` routes read the signed-in session (`auth()` from
`lib/auth.ts`) and filter by `session.user.id`, so history follows the
account across devices and browsers rather than being tied to one machine.
See [AUTH_SETUP.md](./AUTH_SETUP.md) to configure sign-in.
