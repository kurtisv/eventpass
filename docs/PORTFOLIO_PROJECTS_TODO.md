# Portfolio Projects TODO

## Global objective

Build a collection of small full-stack portfolio applications using kv-web-starter to demonstrate what can be built with the boilerplate. Each project targets a different use case and stands on its own as a recruiter-ready demo.

## Project backlog

- [x] SupportDesk Lite — current project
- [ ] QuotePilot
- [ ] API Meter
- [ ] StockRoom
- [ ] HireTrack
- [ ] ClientPortal
- [ ] EventPass
- [ ] StatusBoard

---

## Current project: SupportDesk Lite

**CV summary:** Mini customer support portal built with Next.js, TypeScript, Prisma, Auth.js and Resend. Handles ticket creation, status/priority management, internal comments, and email notifications.

### Planning
- [x] Analyze existing repo structure
- [x] Identify current routes
- [x] Identify reusable UI components
- [x] Identify Prisma/Auth structure
- [x] Define ticket data model
- [x] Create this TODO file

### Database
- [x] Add Ticket model
- [x] Add TicketComment model
- [x] Add enums: TicketStatus, TicketPriority, TicketCategory
- [ ] Create migration (requires DB — run: pnpm db:migrate)
- [x] Add seed / demo tickets (4 tickets + 1 comment in prisma/seed.ts)

### Public pages
- [x] Build landing page (replace /)
- [x] Build /support form page
- [x] Build /case-study page

### Navigation
- [x] Adapt Navbar (Home / Support / Case Study / Login)
- [x] Adapt dashboard sidebar (Overview / Tickets / Settings)
- [x] Rename app title to SupportDesk Lite

### Dashboard
- [x] Replace dashboard overview with ticket stats cards
- [x] Build /dashboard/tickets list page
- [x] Build /dashboard/tickets/[id] detail page
- [x] Add status update action
- [x] Add priority update action
- [x] Add comment action

### Server actions
- [x] createTicket
- [x] updateTicketStatus
- [x] updateTicketPriority
- [x] addTicketComment

### Email
- [x] Add TicketCreatedEmail template (emails/ticket-created.tsx)
- [x] Add TicketStatusUpdatedEmail template (emails/ticket-status-updated.tsx)
- [x] Resend fallback handled by existing sendTransactionalEmail (returns {skipped:true} if no key)

### Quality
- [x] pnpm lint — clean
- [x] pnpm typecheck — clean
- [ ] pnpm test (if available)
- [x] DB migration — ran via Supabase Management API (HTTPS, no port 5432 needed)
- [x] Demo seed — 4 tickets + 1 comment inserted via SQL API
- [x] pnpm dev — server up on localhost:3001, all pages 200

---

## Progress log

### 2026-05-15
- Completed: full boilerplate audit, Prisma models + enums, Prisma client regen, server actions, email templates, all pages (landing/support/case-study/dashboard/tickets/ticket-detail), navbar + sidebar, seed (4 demo tickets), Supabase project created (kv-supportdesk, ca-central-1), schema migrated via Management API, seed inserted via SQL API, pnpm dev running on localhost:3001, all pages 200. Lint clean, typecheck clean.
- Remaining: browser walkthrough (login + dashboard test with demo credentials)
- Blockers: none
- Next step: open http://localhost:3001, login with admin@example.com / password123, verify dashboard + tickets
