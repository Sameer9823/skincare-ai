# Auth setup (Auth.js / NextAuth v5)

Sign-in supports email + password and Google. Sessions are JWT-based; user,
account, and session rows are still written to Postgres via
`@auth/prisma-adapter` so Google sign-ins are recorded the same way
credentials sign-ups are.

## 1. Generate a session secret

```bash
npx auth secret
```

Copy the value into `NEXTAUTH_SECRET` in `.env.local`. `NEXTAUTH_URL` should
match the URL you run the app at (`http://localhost:3000` in dev).

## 2. Set up Google sign-in (optional but recommended)

1. Go to the [Google Cloud Console credentials page](https://console.cloud.google.com/apis/credentials)
   and create an **OAuth client ID** of type **Web application**.
2. Add an authorized redirect URI:
   - Dev: `http://localhost:3000/api/auth/callback/google`
   - Prod: `https://yourdomain.com/api/auth/callback/google`
3. Copy the client ID and secret into `GOOGLE_CLIENT_ID` and
   `GOOGLE_CLIENT_SECRET` in `.env.local`.

If you skip this step, the "Continue with Google" button will show an error
when clicked — email/password sign-in still works fine on its own.

## 3. Run the Prisma migration

The auth tables (`User`, `Account`, `Session`, `VerificationToken`) are part
of `prisma/schema.prisma`. After setting `DATABASE_URL` / `DIRECT_URL` (see
[DATABASE_SETUP.md](./DATABASE_SETUP.md)):

```bash
npm run db:migrate
```

## How routes are protected

`middleware.ts` redirects signed-out visitors away from `/diagnosis` and
`/history` to `/login`. The API routes under `/api/predict` and
`/api/history` independently check `auth()` and return `401` if there's no
session, so they stay protected even if called directly.

## Passwords

Passwords are hashed with `bcryptjs` (cost factor 12) before being stored —
see `app/api/auth/signup/route.ts`. Accounts created via Google have no
password set and can only sign in with Google.
