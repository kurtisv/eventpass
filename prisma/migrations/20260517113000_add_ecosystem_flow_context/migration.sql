alter table if exists public."EventPassTicket"
  add column if not exists "flowId" text,
  add column if not exists "sourceApp" text,
  add column if not exists "sourceEventId" text,
  add column if not exists "projectName" text,
  add column if not exists "orderNumber" text,
  add column if not exists "contextJson" jsonb;

create index if not exists "EventPassTicket_flowId_idx" on public."EventPassTicket"("flowId");
