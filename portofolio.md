# Portfolio Product Notes

> Status: Implemented baseline, updated June 28, 2026
> Project type: Personal portfolio web app
> Owner: Rexy Anggala Putra
> Stack: Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL, Three.js

## 1. Product Summary

This project is Rexy's public portfolio website for showcasing profile, featured work, skills, services, experience, FAQ, testimonials, and contact channels in one modern landing-page style experience.

The current implementation focuses on:

- a premium dark futuristic portfolio UI
- interactive hero presentation with a 3D AI assistant scene
- database-backed content for profile, projects, skills, experience, FAQ, impressions, messages, and visitor analytics
- smooth public browsing without requiring an admin dashboard

The site is designed for recruiters, clients, collaborators, and learners who want to understand Rexy's background in data, BI, analytics, dashboards, and technical problem solving.

## 2. Current Goals

- Present Rexy's profile in a more premium and memorable way
- Make featured projects easy to explore through direct demo and GitHub links
- Provide fast contact paths through WhatsApp, email, LinkedIn, and contact form
- Collect positive visitor impressions that can later appear as testimonials
- Track lightweight visitor engagement with anonymous analytics and session duration

## 3. Current Scope

### Public-facing sections

- Sticky navigation with active-section highlight
- Hero section with:
  - `Profile & Portfolio` badge
  - animated headline
  - CTA buttons
  - social links
  - interactive 3D futuristic robotic assistant on the right
- About section
- Skills section with view-more behavior
- Featured Projects section
- Services section
- Testimonials / impressions section
- Experience section
- FAQ section
- Contact section
- Visitor session timer
- Responsive mobile navigation drawer with compact right-side panel overlay

### Standalone public page

- `/feedback`
  - visitor can submit:
    - display name
    - role or division
    - impression

### API routes

- `GET /api/profile`
- `GET /api/skills`
- `GET /api/projects`
- `GET /api/experiences`
- `GET /api/faqs`
- `GET /api/impressions`
- `POST /api/impressions`
- `POST /api/messages`
- `POST /api/analytics/visit`
- `POST /api/analytics/duration`
- `GET /api/cv`

## 4. Visual Direction

The visual direction is now intentionally more futuristic than the original baseline.

### Core style

- dark navy to black foundation
- blue, cyan, and violet glow accents
- glassmorphism cards
- soft neon borders and shadows
- subtle galaxy and holographic atmosphere

### Hero concept

The hero now uses a layered "AI data universe" approach:

- animated nebula and starfield background
- interactive Three.js robot scene
- floating data cards
- soft glow masks to preserve text readability
- clean two-column layout so the copy remains dominant

### Motion style

- elegant reveal animations on load
- scroll-based section reveals
- card lift and premium hover response
- restrained motion on smaller screens
- reduced-motion fallback respected

## 5. Data Model Summary

Current PostgreSQL tables managed by Prisma:

- `Profile`
- `Experience`
- `Project`
- `Skill`
- `Faq`
- `Message`
- `ClientImpression`
- `VisitSession`
- `RateLimitEvent`

### Important stored content

- profile and CV link
- project demo links and GitHub links
- skills and experience records
- FAQ entries
- contact form messages
- visitor impressions
- analytics visit sessions

## 6. Featured Project Rules

The featured project area has been updated to reflect real project links provided by Rexy.

### Current expectations

- featured cards use `View Demo` instead of `View Project`
- cards may also show `View Github` when a repository link exists
- categories should follow actual supplied work only
- unused categories should not be filled with placeholder projects
- machine learning category is removed from the featured grouping

### Current real project examples

- Covid-19 Dashboard
- Nobel Prize Analysis Dashboard
- Simple Sales Performance Dashboard
- Diabetes Classification
- Mathematics World Web

## 7. Testimonial / Impression Flow

The testimonial area now supports real feedback collection.

### Submission flow

1. Visitor opens `/feedback`
2. Visitor submits name or alias, role/division, and impression
3. Submission is validated and rate-limited
4. The original visitor text is stored in PostgreSQL as `originalImpression`
5. The message is summarized and normalized into concise English for public display storage
6. Positive impressions become candidates for testimonial display

### Display rules

- the public testimonial area only shows positive impressions
- the public site shows only 10 positive visible entries at a time
- the displayed set is shuffled deterministically per day
- the public-facing testimonial copy is the concise English version, not the raw visitor text

## 8. Functional Requirements Implemented

- Database-backed portfolio content rendering
- Download CV button connected to stored CV link
- Project demo links and optional GitHub links
- Feedback page and testimonial ingestion
- Raw impression text stored in PostgreSQL alongside summarized English testimonial text
- Anonymous visitor analytics with active duration tracking
- FAQ search and expand/collapse interaction
- Responsive design for desktop, tablet, and mobile
- Compact mobile menu drawer with solid background panel to avoid overlap with hero content
- Mobile experience cards show period directly below company and location
- Modern premium hero with interactive Three.js visual

## 9. Known Non-Scope Items

These items are not implemented in the current codebase:

- admin CMS dashboard
- authentication for content management
- direct upload workflow for assets from an admin panel
- multi-user roles
- blog or article CMS

## 10. Technical Notes

- Three.js is used directly for the hero robot scene instead of React Three Fiber
- the 3D hero is client-side only and lazy loaded
- a fallback loader is shown while the scene initializes
- reduced-motion users receive a lighter animation experience
- the app is intended to remain performant on mobile by reducing interactive intensity

## 11. Suggested Next Iterations

- add a true admin CMS for updating portfolio content without touching the database manually
- add upload handling for CV and project assets
- add project detail pages
- add richer analytics dashboard for the owner
- add moderation tools for impressions and testimonial curation

## 12. Acceptance Snapshot

The project should currently be considered successful when:

- the homepage renders without TypeScript or build errors
- the hero feels premium and interactive
- projects display the intended links
- CV download works from the stored profile link
- impressions can be submitted and stored
- testimonials can be served from positive stored impressions
- all core public sections remain responsive and readable
