# Rexy Anggala Putra Portfolio

Modern portfolio website for Rexy Anggala Putra, built with Next.js, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and Three.js. The site highlights Rexy's profile, featured projects, services, testimonials, contact channels, and analytics-driven public experience in a premium dark futuristic style.

## Highlights

- Premium dark portfolio UI with glassmorphism, neon glow, and animated section reveals
- Interactive hero section with a lazy-loaded Three.js futuristic robot scene
- Database-backed portfolio content for profile, skills, experiences, projects, FAQ, impressions, messages, and visit analytics
- Featured Projects updated with real demo links and optional GitHub links
- Feedback page at `/feedback` for collecting visitor impressions
- Testimonials sourced from positive impressions stored in PostgreSQL
- Contact form with server validation and rate limiting
- Visitor session timer plus anonymous active-duration tracking
- Responsive layout for desktop, tablet, and mobile

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Zod
- Three.js
- lucide-react

## Project Structure

```txt
src/
  app/
    api/                         Public API routes
    feedback/page.tsx           Impression submission page
    globals.css                 Global theme, animation, and hero styles
    layout.tsx                  Root layout and metadata
    page.tsx                    Server-rendered portfolio page
  components/
    hero/
      FuturisticRobotScene.tsx  Interactive Three.js robot scene
      HeroBackground.tsx        Layered hero background effects
      HeroSection.tsx           Main hero content and layout
    impression-form.tsx         Feedback form UI
    public-portfolio.tsx        Main public portfolio experience
    hero-nebula-background.tsx  Animated hero background helper
    ui.tsx                      Shared UI primitives
  lib/
    server/                     Prisma access, request helpers, validation
    types.ts                    Shared frontend data types
    utils.ts                    UI helpers and formatters
prisma/
  schema.prisma                 Database schema
  seed.js                       Seed data for portfolio content
public/assets/                  Local project illustration assets
```

## Environment Variables

Create `.env` and fill in the required values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
RATE_LIMIT_SALT="replace-with-a-long-random-secret"
```

Do not commit `.env`.

## Getting Started

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

Apply database migrations:

```bash
npm run prisma:migrate
```

Seed portfolio data:

```bash
npm run prisma:seed
```

Start the dev server:

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

## Database Models

- `Profile`
- `Experience`
- `Project`
- `Skill`
- `Faq`
- `Message`
- `ClientImpression`
- `VisitSession`
- `RateLimitEvent`

## Public Routes

- `/`
- `/feedback`

## Public APIs

- `GET /api/profile`
- `GET /api/skills`
- `GET /api/projects?cursor=&limit=`
- `GET /api/experiences?cursor=&limit=`
- `GET /api/faqs`
- `GET /api/impressions`
- `POST /api/impressions`
- `POST /api/messages`
- `POST /api/analytics/visit`
- `POST /api/analytics/duration`
- `GET /api/cv`

## Current Content Notes

- CV download points to the profile CV link stored in PostgreSQL
- Featured projects now support separate demo and GitHub links
- Testimonials are selected from positive impressions only
- The site currently has no admin dashboard or CMS UI

## Validation

Recommended checks before deployment:

```bash
npm run lint
npm run build
```

## Repository

Primary repository: [rexyanggalaputra/portofolio-web](https://github.com/rexyanggalaputra/portofolio-web)
