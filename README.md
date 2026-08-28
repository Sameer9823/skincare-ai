# SkinCare AI 

An AI-assisted skin analysis app. Upload a photo (or use your webcam), get a
non-clinical AI assessment powered by OpenAI's vision models, track your
history over time, find nearby hospitals/clinics, and keep prescriptions in
one place.

> ⚠️ **Not a medical device.** All analysis is AI-generated and explicitly
> non-clinical. It is not a substitute for professional medical advice,
> diagnosis, or treatment.

## Features

- 🔍 **AI skin analysis** — upload an image or capture one via webcam and get
  a detected condition, confidence score, severity, explanation, possible
  contributing factors, self-care tips, and when to see a doctor.
- 🧾 **Downloadable results** — export an annotated image and a PDF report of
  any analysis.
- 🕘 **History** — every analysis is saved to your account and viewable later,
  synced across devices.
- 💊 **Prescriptions** — upload, view, and manage prescription documents.
- 🏥 **Hospital finder** — search by city or use your location to find nearby
  hospitals/clinics on an interactive map, with directions and call links.
- 🔐 **Authentication** — email/password and Google sign-in via Auth.js, with
  protected routes for personal data.

## Tech stack

| Layer | Tech |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router), React 19, TypeScript |
| Styling / UI | Tailwind CSS, shadcn/ui (Radix primitives), lucide-react icons |
| Auth | [Auth.js (NextAuth v5)](https://authjs.dev) — Credentials + Google, JWT sessions |
| Database | PostgreSQL ([Neon](https://neon.tech)) via [Prisma](https://prisma.io) |
| AI | OpenAI `gpt-4o-mini` (vision) for skin image analysis |
| Maps | Google Maps JavaScript API (hospital finder) |
| Geocoding / POI data | OpenStreetMap Nominatim + Overpass API |
| PDF / image export | `jsPDF`, HTML5 Canvas |

## Getting started

### 1. Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) Postgres database (or any Postgres instance)
- An [OpenAI API key](https://platform.openai.com/api-keys) with vision access
- A [Google Maps JavaScript API](https://console.cloud.google.com/google/maps-apis/credentials) key
- (Optional) A [Google OAuth client](https://console.cloud.google.com/apis/credentials) for "Continue with Google"

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

`postinstall` automatically runs `prisma generate`.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in the values in `.env.local`:

| Variable | Used for |
|---|---|
| `OPENAI_API_KEY` | AI image analysis (`/api/predict`) |
| `DATABASE_URL` / `DIRECT_URL` | Postgres connection (pooled / direct) for Prisma |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | Auth.js session signing — generate a secret with `npx auth secret` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | "Continue with Google" sign-in |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Hospital finder map rendering |

See [`DATABASE_SETUP.md`](./DATABASE_SETUP.md) and
[`AUTH_SETUP.md`](./AUTH_SETUP.md) for detailed, step-by-step instructions on
provisioning the database and configuring sign-in.

### 4. Run database migrations

```bash
npm run db:migrate
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server (after `build`) |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:migrate` | Run/create Prisma migrations |
| `npm run db:studio` | Open Prisma Studio to browse the database |

## Project structure

```
app/
├── about/, contact/, privacy/, terms/   # Static content pages
├── login/, signup/                      # Auth pages
├── diagnosis/                           # Upload/webcam capture + AI analysis results
├── history/                             # Saved past analyses
├── prescription/                        # Prescription document management
├── hospitals/                           # Hospital/clinic finder + map
└── api/
    ├── auth/                            # NextAuth handlers + signup
    ├── predict/                         # OpenAI image analysis
    ├── history/                         # CRUD for saved diagnoses
    ├── prescriptions/                   # CRUD for prescription documents
    └── hospitals/                       # Geocoding + nearby facility search

components/
├── home/                                # Landing page sections
├── hospitals/                           # Map panel + Google Maps integration
└── ui/                                  # shadcn/ui primitives

lib/                                     # Prisma client, auth config, utils
prisma/                                  # Schema + migrations
```

## Security note

This repo's `.env.example` lists every variable the app needs, but **never
commit a real `.env` / `.env.local`** — it's already excluded via
`.gitignore`. If any real credentials (database URL, API keys, auth secret)
were ever shared or exposed, rotate them immediately:

1. Reset the Neon database password
2. Revoke and reissue the OpenAI API key
3. Regenerate `NEXTAUTH_SECRET` (`npx auth secret`)
4. Regenerate the Google OAuth client secret

## License

Private / unlicensed unless you add a `LICENSE` file.
