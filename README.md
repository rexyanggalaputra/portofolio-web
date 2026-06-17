# Rexy Anggala Putra Portfolio

A modern personal portfolio website for Rexy Anggala Putra, built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. The public site presents Rexy's profile, business intelligence experience, skills, projects, services, FAQ, contact form, visitor timer, and lightweight analytics.

## Highlights

- Dark responsive portfolio UI with a blue/violet accent style.
- Profile section powered by database content and local profile photo asset.
- Skills grid with contextual icons for Python, SQL, BI tools, spreadsheets, databases, dashboards, reporting, and pipelines.
- Experience timeline seeded from Rexy's professional profile.
- Featured Projects section with category segments and view more/show less behavior.
- Services and testimonials carousel with smooth directional navigation.
- FAQ search and show more/show less controls.
- Contact form with client-side validation and backend message storage.
- Visitor session timer with hide/show behavior and backend duration tracking.
- Public backend APIs for profile, skills, projects, experiences, FAQ, messages, analytics, and CV redirect.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL, currently configured for Neon through local environment variables
- Zod validation
- lucide-react icons

## Project Structure

```txt
src/
  app/
    api/                 Public API routes
    globals.css          Global styles and animations
    layout.tsx           Root metadata/layout
    page.tsx             Server-rendered portfolio page
  components/
    public-portfolio.tsx Main public portfolio UI
    ui.tsx               Shared UI primitives
  lib/
    server/              Prisma, request helpers, validation schemas
    types.ts             Frontend data types
    utils.ts             Formatting helpers
prisma/
  schema.prisma          Database models
  seed.js                Seed content for profile, skills, experience, projects, FAQ
public/assets/           Local visual assets
```

## Environment Variables

Create `.env` from `.env.example` and fill in your database values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
RATE_LIMIT_SALT="replace-with-a-long-random-secret"
```

Never commit `.env`; it is intentionally ignored by Git.

## Getting Started

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

Run migrations:

```bash
npm run prisma:migrate
```

Seed portfolio content:

```bash
npm run prisma:seed
```

Start development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Public APIs

- `GET /api/profile`
- `GET /api/skills`
- `GET /api/projects?cursor=&limit=`
- `GET /api/experiences?cursor=&limit=`
- `GET /api/faqs`
- `POST /api/messages`
- `POST /api/analytics/visit`
- `POST /api/analytics/duration`
- `GET /api/cv`

## Notes

- There is no admin dashboard, auth, upload flow, or CMS CRUD in the current version.
- Portfolio content is seeded into PostgreSQL and can be edited manually in the database.
- Featured Project data is still placeholder/sample content and is intended to be updated later with Rexy's real project links.
