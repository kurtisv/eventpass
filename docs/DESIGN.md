# EventPass Design Notes

## Direction

EventPass uses a refined event-operations identity: soft violet canvas, ink typography, warm ticket accents, and compact operational panels. The goal is to feel different from the other portfolio projects while staying credible as a business tool.

## UX priorities

- First screen must show the product surface, not only a visual mood.
- Capacity, tickets, and check-in should be visible immediately.
- Public attendee flows and admin operations should both be represented.
- FR/EN switching must affect every meaningful content page.

## Boilerplate proof points

- Next.js App Router pages.
- Shared UI primitives from kv-web-starter.
- Prisma schema extension with `EventPass*` prefixed models.
- Static fallback data so the demo stays functional before database wiring.
- Ready to connect to the shared `kv-portfolio` Supabase database without table-name collisions.
