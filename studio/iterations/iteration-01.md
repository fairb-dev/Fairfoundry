# Iteration 1: Project Scaffold + Database + Seed Data

## Scope
Bootstrap the Next.js 16 app with Prisma, PostgreSQL, Tailwind v4, and seed data from the virtual world.

## Acceptance Test
- `npm install` succeeds
- `npm run db:setup` creates tables and seeds 3 demo contracts
- `npm run dev` serves a page at localhost:3000
- Database contains: 6 companies, 3 contracts, 3 log formats with columns, 3 ERS with criteria, pre-linked

## Design Decisions
- No auth for MVP (demo mode)
- File storage on disk (uploads/)
- IBM Plex Sans font (consistent with fairb.com)
- Dark sidebar + light content area (Stripe/Linear pattern)
- Seed data from virtual world CSVs and ERS JSONs

## Files to Create
- package.json, tsconfig.json, next.config.ts, postcss.config.mjs
- prisma/schema.prisma (full data model)
- prisma/seed.cjs (loads 3 CSV+ERS pairs)
- app/layout.tsx, app/globals.css, app/page.tsx
- lib/prisma.ts, lib/google-ai.ts
