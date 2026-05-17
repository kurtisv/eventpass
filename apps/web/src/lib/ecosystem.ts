import type { Prisma } from "@/generated/prisma";

import { prisma } from "@/lib/db";

export type EcosystemPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type PublishEcosystemEventInput = {
  flowId?: string;
  sourceApp: string;
  targetApp?: string;
  targetApps?: string[];
  eventType: string;
  entityType: string;
  entityId?: string;
  customerName?: string;
  customerEmail?: string;
  title: string;
  description?: string;
  payload?: Prisma.InputJsonValue;
  notificationTitle?: string;
  notificationMessage?: string;
  priority?: EcosystemPriority;
  actionLabel?: string;
  actionUrl?: string;
};

function createFlowId(input: PublishEcosystemEventInput) {
  if (input.flowId) return input.flowId;
  const email = input.customerEmail?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return email ? `flow-${email}` : `flow-${crypto.randomUUID()}`;
}

export async function publishEcosystemEvent(input: PublishEcosystemEventInput) {
  const flowId = createFlowId(input);
  const targetApps = input.targetApps?.length ? input.targetApps : input.targetApp ? [input.targetApp] : [];

  try {
    return await writeEcosystemEvent(input, flowId, targetApps);
  } catch {
    try {
      await ensureEcosystemTables();
      return await writeEcosystemEvent(input, flowId, targetApps);
    } catch {
      return (await publishSupabaseEcosystemEvent(input, flowId, targetApps)) as Awaited<ReturnType<typeof writeEcosystemEvent>> | null;
    }
  }
}

async function writeEcosystemEvent(input: PublishEcosystemEventInput, flowId: string, targetApps: string[]) {
  const event = await prisma.ecosystemEvent.create({
    data: {
      flowId,
      sourceApp: input.sourceApp,
      targetApp: targetApps[0] ?? input.targetApp,
      eventType: input.eventType,
      entityType: input.entityType,
      entityId: input.entityId,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      title: input.title,
      description: input.description,
      payload: input.payload,
    },
  });

  if (targetApps.length > 0) {
    await prisma.ecosystemNotification.createMany({
      data: targetApps.map((appKey) => ({
        appKey,
        eventId: event.id,
        flowId,
        title: input.notificationTitle ?? input.title,
        message: input.notificationMessage ?? input.description ?? input.title,
        priority: input.priority ?? "NORMAL",
        actionLabel: input.actionLabel,
        actionUrl: input.actionUrl,
      })),
    });
  }

  return event;
}

async function ensureEcosystemTables() {
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
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "EcosystemEvent_flowId_idx" ON "EcosystemEvent"("flowId")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "EcosystemEvent_targetApp_idx" ON "EcosystemEvent"("targetApp")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "EcosystemEvent_eventType_idx" ON "EcosystemEvent"("eventType")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "EcosystemNotification_appKey_idx" ON "EcosystemNotification"("appKey")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "EcosystemNotification_eventId_idx" ON "EcosystemNotification"("eventId")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "EcosystemNotification_flowId_idx" ON "EcosystemNotification"("flowId")`);
}

export async function getIncomingEcosystemNotifications(appKey: string, take = 6) {
  try {
    return await prisma.ecosystemNotification.findMany({
      where: { appKey },
      orderBy: { createdAt: "desc" },
      take,
    });
  } catch {
    return (await getSupabaseRows("EcosystemNotification", `appKey=eq.${encodeURIComponent(appKey)}&order=createdAt.desc&limit=${take}`)) as Awaited<ReturnType<typeof prisma.ecosystemNotification.findMany>>;
  }
}

export async function getIncomingEcosystemEvents(appKey: string, eventType?: string, take = 10) {
  try {
    const notifications = await prisma.ecosystemNotification.findMany({
      where: { appKey },
      orderBy: { createdAt: "desc" },
      take,
      select: { eventId: true },
    });
    const notificationEventIds = notifications.map((item) => item.eventId);

    return await prisma.ecosystemEvent.findMany({
      where: {
        OR: [
          { targetApp: appKey },
          ...(notificationEventIds.length > 0 ? [{ id: { in: notificationEventIds } }] : []),
        ],
        ...(eventType ? { eventType } : {}),
      },
      orderBy: { createdAt: "desc" },
      take,
    });
  } catch {
    const filter = eventType ? `&eventType=eq.${encodeURIComponent(eventType)}` : "";
    return (await getSupabaseRows(
      "EcosystemEvent",
      `targetApp=eq.${encodeURIComponent(appKey)}${filter}&order=createdAt.desc&limit=${take}`,
    )) as Awaited<ReturnType<typeof prisma.ecosystemEvent.findMany>>;
  }
}

export async function linkEcosystemEntities(input: {
  flowId: string;
  fromApp: string;
  fromEntityType: string;
  fromEntityId: string;
  toApp: string;
  toEntityType: string;
  toEntityId?: string;
}) {
  try {
    return await prisma.ecosystemEntityLink.create({ data: input });
  } catch {
    return (await insertSupabaseRow("EcosystemEntityLink", {
      id: crypto.randomUUID(),
      flowId: input.flowId,
      fromApp: input.fromApp,
      fromEntityType: input.fromEntityType,
      fromEntityId: input.fromEntityId,
      toApp: input.toApp,
      toEntityType: input.toEntityType,
      toEntityId: input.toEntityId ?? null,
    })) as Awaited<ReturnType<typeof prisma.ecosystemEntityLink.create>> | null;
  }
}

export async function getRecentEcosystemEvents(take = 20) {
  try {
    return await prisma.ecosystemEvent.findMany({
      orderBy: { createdAt: "desc" },
      take,
    });
  } catch {
    return (await getSupabaseRows("EcosystemEvent", `order=createdAt.desc&limit=${take}`)) as Awaited<ReturnType<typeof prisma.ecosystemEvent.findMany>>;
  }
}

async function publishSupabaseEcosystemEvent(input: PublishEcosystemEventInput, flowId: string, targetApps: string[]) {
  const event = await insertSupabaseRow("EcosystemEvent", {
    id: crypto.randomUUID(),
    flowId,
    sourceApp: input.sourceApp,
    targetApp: targetApps[0] ?? input.targetApp ?? null,
    eventType: input.eventType,
    entityType: input.entityType,
    entityId: input.entityId ?? null,
    customerName: input.customerName ?? null,
    customerEmail: input.customerEmail ?? null,
    title: input.title,
    description: input.description ?? null,
    payload: input.payload ?? null,
    status: "NEW",
  });

  if (!event) return null;

  await Promise.all(
    targetApps.map((appKey) =>
      insertSupabaseRow("EcosystemNotification", {
        id: crypto.randomUUID(),
        appKey,
        eventId: event.id,
        flowId,
        title: input.notificationTitle ?? input.title,
        message: input.notificationMessage ?? input.description ?? input.title,
        priority: input.priority ?? "NORMAL",
        isRead: false,
        actionLabel: input.actionLabel ?? null,
        actionUrl: input.actionUrl ?? null,
      }),
    ),
  );

  return event;
}

async function insertSupabaseRow(table: string, row: Record<string, unknown>): Promise<Record<string, unknown> | null> {
  const response = await fetch(`${getSupabaseUrl()}/rest/v1/${table}`, {
    method: "POST",
    headers: getSupabaseHeaders({ prefer: "return=representation" }),
    body: JSON.stringify(row),
  }).catch(() => null);

  if (!response?.ok) return null;

  const rows = (await response.json().catch(() => [])) as Record<string, unknown>[];
  return rows[0] ?? null;
}

async function getSupabaseRows(table: string, query: string): Promise<Record<string, unknown>[]> {
  const response = await fetch(`${getSupabaseUrl()}/rest/v1/${table}?select=*&${query}`, {
    headers: getSupabaseHeaders(),
    cache: "no-store",
  }).catch(() => null);

  if (!response?.ok) return [];

  return (await response.json().catch(() => [])) as Record<string, unknown>[];
}

function getSupabaseUrl() {
  return process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

function getSupabaseHeaders(options?: { prefer?: string }) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...(options?.prefer ? { Prefer: options.prefer } : {}),
  };
}




