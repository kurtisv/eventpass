# EventPass TODO

## Portfolio objective

EventPass is project 8 in the kv-portfolio series. It demonstrates that kv-web-starter can become an event registration and check-in product, not only a marketing site.

## Scope

- [x] Replace starter identity with EventPass.
- [x] Build a distinct event-focused visual system.
- [x] Add FR/EN language switching.
- [x] Add event catalog and event detail pages.
- [x] Add tokenized ticket page.
- [x] Add admin check-in view.
- [x] Add case study page for recruiters.
- [x] Add prefixed Prisma models for shared kv-portfolio Supabase.
- [ ] Connect production to shared Supabase kv-portfolio.
- [ ] Deploy production build.
- [ ] Update Symphonee roadmap notes.

## Routes

- `/` - product landing with capacity and arrival cockpit.
- `/events` - public catalog.
- `/events/[slug]` - event detail and ticket entry.
- `/ticket/[token]` - tokenized attendee ticket.
- `/check-in` - admin arrival desk.
- `/case-study` - recruiter-facing implementation summary.

## Quality checklist

- [ ] `pnpm install`
- [ ] `pnpm db:generate`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`
