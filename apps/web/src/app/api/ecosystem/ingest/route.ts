import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { publishEcosystemEvent } from "@/lib/ecosystem";

const appKey = "eventpass";

const eventSchema = z.object({
  flowId: z.string().min(3),
  sourceApp: z.string().min(2),
  targetApp: z.string().optional().nullable(),
  eventType: z.string().min(2),
  entityType: z.string().min(2),
  entityId: z.string().optional().nullable(),
  customerName: z.string().optional().nullable(),
  customerEmail: z.string().email().optional().nullable(),
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  payload: z.record(z.string(), z.unknown()).optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).optional(),
  actionLabel: z.string().optional().nullable(),
  actionUrl: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = eventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid ecosystem event" }, { status: 400 });
  }

  const data = parsed.data;
  const event = await publishEcosystemEvent({
    ...data,
    targetApps: [appKey],
    targetApp: data.targetApp ?? undefined,
    description: data.description ?? undefined,
    entityId: data.entityId ?? undefined,
    customerName: data.customerName ?? undefined,
    customerEmail: data.customerEmail ?? undefined,
    actionLabel: data.actionLabel ?? "Continuer",
    actionUrl: data.actionUrl ?? "/dashboard",
    priority: data.priority ?? "NORMAL",
    payload: data.payload as never,
  }).catch(() => null);

  if (event) {
    return NextResponse.json({ ok: true, eventId: event.id, flowId: event.flowId });
  }

  const fallback = await storeFallbackEvent(data).catch((error) => ({ ok: false as const, error: String(error) }));
  if (!fallback.ok) {
    return NextResponse.json({ ok: false, error: fallback.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, eventId: fallback.eventId, flowId: data.flowId, fallback: true });
}

async function storeFallbackEvent(data: z.infer<typeof eventSchema>) {
  const eventId = crypto.randomUUID();
  const notificationId = crypto.randomUUID();

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "EcosystemEvent" (
      "id" TEXT PRIMARY KEY,
      "flowId" TEXT NOT NULL,
      "sourceApp" TEXT NOT NULL,
      "targetApp" TEXT,
      "eventType" TEXT NOT NULL,
      "entityType" TEXT NOT NULL,
      "entityId" TEXT,
      "customerName" TEXT,
      "customerEmail" TEXT,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "payload" JSONB,
      "status" TEXT NOT NULL DEFAULT 'NEW',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "readAt" TIMESTAMP(3)
    )
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "EcosystemNotification" (
      "id" TEXT PRIMARY KEY,
      "appKey" TEXT NOT NULL,
      "eventId" TEXT NOT NULL,
      "flowId" TEXT,
      "title" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "priority" TEXT NOT NULL DEFAULT 'NORMAL',
      "isRead" BOOLEAN NOT NULL DEFAULT false,
      "actionLabel" TEXT,
      "actionUrl" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await prisma.$executeRawUnsafe(`
    INSERT INTO "EcosystemEvent" (
      "id", "flowId", "sourceApp", "targetApp", "eventType", "entityType",
      "entityId", "customerName", "customerEmail", "title", "description", "payload", "status"
    ) VALUES (
      ${sqlString(eventId)},
      ${sqlString(data.flowId)},
      ${sqlString(data.sourceApp)},
      ${sqlString(appKey)},
      ${sqlString(data.eventType)},
      ${sqlString(data.entityType)},
      ${sqlString(data.entityId)},
      ${sqlString(data.customerName)},
      ${sqlString(data.customerEmail)},
      ${sqlString(data.title)},
      ${sqlString(data.description)},
      ${sqlJson(data.payload ?? {})},
      'NEW'
    )
  `);
  await prisma.$executeRawUnsafe(`
    INSERT INTO "EcosystemNotification" (
      "id", "appKey", "eventId", "flowId", "title", "message",
      "priority", "isRead", "actionLabel", "actionUrl"
    ) VALUES (
      ${sqlString(notificationId)},
      ${sqlString(appKey)},
      ${sqlString(eventId)},
      ${sqlString(data.flowId)},
      ${sqlString(data.title)},
      ${sqlString(data.description ?? data.title)},
      ${sqlString(data.priority ?? "NORMAL")},
      false,
      ${sqlString(data.actionLabel ?? "Continuer")},
      ${sqlString(data.actionUrl ?? "/dashboard")}
    )
  `);

  return { ok: true as const, eventId };
}

function sqlString(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "NULL";
  }

  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJson(value: unknown) {
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}
