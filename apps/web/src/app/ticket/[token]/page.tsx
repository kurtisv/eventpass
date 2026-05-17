import Link from "next/link";
import { QrCode } from "lucide-react";

import { MarketingPageShell } from "@/components/marketing/page-shell";
import { Button } from "@/components/ui/button";
import { tickets } from "@/data/eventpass";
import { prisma } from "@/lib/db";
import { getCurrentLocale } from "@/lib/locale";

const copy = {
  fr: {
    eyebrow: "Billet evenement",
    checkIn: "Ouvrir le check-in",
    confirmed: "Confirme",
    checked: "Arrive",
    source: "Source ecosysteme",
  },
  en: {
    eyebrow: "Event ticket",
    checkIn: "Open check-in",
    confirmed: "Confirmed",
    checked: "Checked in",
    source: "Ecosystem source",
  },
};

export default async function TicketPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const locale = await getCurrentLocale();
  const t = copy[locale];
  const dbTicket = await prisma.eventPassTicket.findUnique({
    where: { token },
    include: { event: true },
  }).catch(() => null);
  const ticket = dbTicket
    ? {
        token: dbTicket.token,
        attendeeName: dbTicket.attendeeName,
        company: dbTicket.attendeeEmail,
        eventName: dbTicket.event.name,
        source: "EventPass",
        checkedIn: Boolean(dbTicket.checkedInAt),
      }
    : tickets.find((item) => item.token === token) ?? tickets[0];
  const status = ticket.checkedIn ? t.checked : t.confirmed;

  return (
    <MarketingPageShell>
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-[1.25rem] border bg-card p-8">
          <QrCode className="size-14 text-primary" />
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold">{ticket.eventName}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{ticket.attendeeName} - {ticket.company} - {status}</p>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">{t.source}: {ticket.source}</p>
          <div className="mt-8 rounded-lg border bg-muted p-6 font-mono text-sm">{ticket.token}</div>
          <Button asChild className="mt-8" variant="secondary"><Link href="/check-in">{t.checkIn}</Link></Button>
        </div>
      </main>
    </MarketingPageShell>
  );
}
