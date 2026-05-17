"use server";

import { redirect } from "next/navigation";
import { nanoid } from "nanoid";

import type { Prisma } from "@/generated/prisma";

import { events } from "@/data/eventpass";
import { prisma } from "@/lib/db";
import { linkEcosystemEntities, publishEcosystemEvent } from "@/lib/ecosystem";
import { requireDashboardAccess } from "@/lib/dashboard-auth";

function payloadOf(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export async function createDemoEventTicket(formData: FormData) {
  const eventSlug = String(formData.get("eventSlug") ?? "");
  const event = events.find((item) => item.slug === eventSlug) ?? events[0];
  const attendeeName = String(formData.get("attendeeName") ?? "").trim();
  const attendeeEmail = String(formData.get("attendeeEmail") ?? "").trim();
  const flowId = String(formData.get("flowId") ?? "").trim() || undefined;
  const sourceApp = String(formData.get("sourceApp") ?? "").trim() || undefined;
  const sourceEventId = String(formData.get("sourceEventId") ?? "").trim() || undefined;
  const projectName = String(formData.get("projectName") ?? "").trim() || undefined;
  const orderNumber = String(formData.get("orderNumber") ?? "").trim() || undefined;
  const token = `ep_${nanoid(18)}`;

  if (!attendeeName || !attendeeEmail) {
    redirect(`/events/${event.slug}?error=missing-attendee`);
  }

  try {
    const savedEvent = await prisma.eventPassEvent.upsert({
      where: { slug: event.slug },
      update: {
        name: event.name,
        venue: event.venue,
        capacity: event.capacity,
        registered: { increment: 1 },
        type: event.type,
        accent: event.accent,
        description: event.description.en,
      },
      create: {
        slug: event.slug,
        name: event.name,
        date: new Date(`${event.date}T10:00:00.000Z`),
        venue: event.venue,
        capacity: event.capacity,
        registered: event.registered + 1,
        type: event.type,
        accent: event.accent,
        description: event.description.en,
      },
    });

    const ticket = await prisma.eventPassTicket.create({
      data: {
        eventId: savedEvent.id,
        token,
        attendeeName,
        attendeeEmail,
        flowId,
        sourceApp,
        sourceEventId,
        projectName,
        orderNumber,
        contextJson: {
          sourceApp,
          sourceEventId,
          projectName,
          orderNumber,
        },
      },
    });

    await publishEcosystemEvent({
      flowId,
      sourceApp: "eventpass",
      targetApps: ["supportdesk-lite", "api-meter"],
      eventType: "event.ticket.created",
      entityType: "event_ticket",
      entityId: ticket.id,
      customerName: attendeeName,
      customerEmail: attendeeEmail,
      title: "Billet cree dans EventPass",
      description: `${attendeeName} a obtenu un billet pour ${event.name}.`,
      payload: {
        eventName: event.name,
        ticketToken: ticket.token,
        sourceModule: event.sourceModule,
        projectName,
        orderNumber,
        flowId,
      },
      priority: "NORMAL",
      actionLabel: "Ouvrir le billet",
      actionUrl: `/ticket/${ticket.token}`,
    });

    redirect(`/ticket/${ticket.token}`);
  } catch {
    redirect("/ticket/eventpass-demo-ticket");
  }
}

export async function createTicketFromEcosystemEvent(formData: FormData) {
  await requireDashboardAccess();

  const eventId = String(formData.get("eventId") ?? "").trim();
  if (!eventId) return;

  const event = await prisma.ecosystemEvent.findUnique({ where: { id: eventId } });
  if (!event) return;

  const payload = payloadOf(event.payload);
  const attendeeName = event.customerName || text(payload.customerName) || text(payload.name) || "Participant recu";
  const attendeeEmail = event.customerEmail || text(payload.customerEmail) || text(payload.email);
  if (!attendeeEmail) return;
  const projectName = text(payload.projectName) || event.title;
  const orderNumber = text(payload.orderNumber) || undefined;
  const eventName = `Atelier - ${projectName}`;
  const eventSlug = `ecosystem-${event.id.slice(0, 10)}`;
  const token = `ep_${nanoid(18)}`;

  const savedEvent = await prisma.eventPassEvent.upsert({
    where: { slug: eventSlug },
    update: {
      name: eventName,
      registered: { increment: 1 },
      description: event.description ?? event.title,
    },
    create: {
      slug: eventSlug,
      name: eventName,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      venue: text(payload.venue) || "Lieu a definir",
      capacity: Math.max(1, numberValue(payload.capacity) ?? 25),
      registered: 1,
      type: "Workshop",
      accent: "#7c3aed",
      description: event.description ?? event.title,
    },
  });

  const ticket = await prisma.eventPassTicket.create({
    data: {
      eventId: savedEvent.id,
      token,
      attendeeName,
      attendeeEmail,
      flowId: event.flowId,
      sourceApp: event.sourceApp,
      sourceEventId: event.id,
      projectName,
      orderNumber,
      contextJson: {
        sourceEvent: event,
        payload,
      } as Prisma.InputJsonValue,
    },
  });

  await linkEcosystemEntities({
    flowId: event.flowId,
    fromApp: event.sourceApp,
    fromEntityType: event.entityType,
    fromEntityId: event.entityId ?? event.id,
    toApp: "eventpass",
    toEntityType: "event_ticket",
    toEntityId: ticket.id,
  });

  await publishEcosystemEvent({
    flowId: event.flowId,
    sourceApp: "eventpass",
    targetApps: ["supportdesk-lite", "api-meter"],
    eventType: "event.ticket.created",
    entityType: "event_ticket",
    entityId: ticket.id,
    customerName: attendeeName,
    customerEmail: attendeeEmail,
    title: "Billet EventPass cree depuis le parcours reel",
    description: `${attendeeName} a un billet pour ${savedEvent.name}.`,
    payload: {
      eventName: savedEvent.name,
      ticketToken: ticket.token,
      projectName,
      orderNumber,
      sourceApp: event.sourceApp,
      sourceEventId: event.id,
      flowId: event.flowId,
    },
    priority: "NORMAL",
    actionLabel: "Ouvrir le billet",
    actionUrl: `/ticket/${ticket.token}`,
  });

  redirect(`/ticket/${ticket.token}`);
}

export async function completeTicketCheckIn(formData: FormData) {
  await requireDashboardAccess();

  const ticketId = String(formData.get("ticketId") ?? "").trim();
  if (!ticketId) return;

  const ticket = await prisma.eventPassTicket.update({
    where: { id: ticketId },
    data: {
      status: "CHECKED_IN",
      checkedInAt: new Date(),
    },
    include: { event: true },
  });

  await publishEcosystemEvent({
    flowId: ticket.flowId ?? undefined,
    sourceApp: "eventpass",
    targetApps: ["supportdesk-lite", "api-meter"],
    eventType: "event.checkin.completed",
    entityType: "event_ticket",
    entityId: ticket.id,
    customerName: ticket.attendeeName,
    customerEmail: ticket.attendeeEmail,
    title: "Check-in EventPass complete",
    description: `${ticket.attendeeName} a complete le check-in pour ${ticket.event.name}.`,
    payload: {
      eventName: ticket.event.name,
      ticketToken: ticket.token,
      projectName: ticket.projectName,
      orderNumber: ticket.orderNumber,
      flowId: ticket.flowId,
    },
    priority: "NORMAL",
    actionLabel: "Voir le dashboard",
    actionUrl: "/dashboard",
  });

  redirect("/dashboard?checkedIn=1");
}
