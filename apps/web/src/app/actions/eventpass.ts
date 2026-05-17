"use server";

import { redirect } from "next/navigation";
import { nanoid } from "nanoid";

import { events } from "@/data/eventpass";
import { prisma } from "@/lib/db";
import { publishEcosystemEvent } from "@/lib/ecosystem";

export async function createDemoEventTicket(formData: FormData) {
  const eventSlug = String(formData.get("eventSlug") ?? "");
  const event = events.find((item) => item.slug === eventSlug) ?? events[0];
  const attendeeName = String(formData.get("attendeeName") ?? "Mara Chen").trim() || "Mara Chen";
  const attendeeEmail = String(formData.get("attendeeEmail") ?? "mara@example.com").trim() || "mara@example.com";
  const flowId = String(formData.get("flowId") ?? "").trim() || undefined;
  const sourceApp = String(formData.get("sourceApp") ?? "").trim() || undefined;
  const sourceEventId = String(formData.get("sourceEventId") ?? "").trim() || undefined;
  const projectName = String(formData.get("projectName") ?? "").trim() || undefined;
  const orderNumber = String(formData.get("orderNumber") ?? "").trim() || undefined;
  const token = `ep_${nanoid(18)}`;

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
