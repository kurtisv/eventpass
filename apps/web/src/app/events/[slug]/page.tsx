import { notFound } from "next/navigation";
import { Ticket } from "lucide-react";

import { createDemoEventTicket } from "@/app/actions/eventpass";
import { MarketingPageShell } from "@/components/marketing/page-shell";
import { Button } from "@/components/ui/button";
import { events } from "@/data/eventpass";
import { getCurrentLocale } from "@/lib/locale";

const copy = {
  fr: {
    venue: "Lieu",
    seats: "Places",
    date: "Date",
    ticket: "Obtenir un billet demo",
    linked: "Projet relie",
    source: "Source",
  },
  en: {
    venue: "Venue",
    seats: "Seats",
    date: "Date",
    ticket: "Get demo ticket",
    linked: "Linked project",
    source: "Source",
  },
};

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getCurrentLocale();
  const t = copy[locale];
  const event = events.find((item) => item.slug === slug);
  if (!event) notFound();

  return (
    <MarketingPageShell>
      <main className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.25rem] border bg-card p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{event.type}</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-normal text-balance">{event.name}</h1>
          <p className="mt-5 text-lg text-muted-foreground">{event.description[locale]}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="border bg-background p-4"><p className="text-sm text-muted-foreground">{t.venue}</p><p className="mt-2 font-semibold">{event.venue}</p></div>
            <div className="border bg-background p-4"><p className="text-sm text-muted-foreground">{t.seats}</p><p className="mt-2 font-semibold">{event.registered}/{event.capacity}</p></div>
            <div className="border bg-background p-4"><p className="text-sm text-muted-foreground">{t.date}</p><p className="mt-2 font-semibold">{event.date}</p></div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="border bg-background p-4"><p className="text-sm text-muted-foreground">{t.source}</p><p className="mt-2 font-semibold">{event.sourceModule}</p></div>
            <div className="border bg-background p-4"><p className="text-sm text-muted-foreground">{t.linked}</p><p className="mt-2 font-semibold">{event.linkedProject}</p></div>
          </div>
          <form action={createDemoEventTicket} className="mt-8 grid gap-3 sm:max-w-md">
            <input type="hidden" name="eventSlug" value={event.slug} />
            <input
              className="h-10 border bg-background px-3 text-sm"
              name="attendeeName"
              placeholder={locale === "fr" ? "Nom du participant" : "Attendee name"}
            />
            <input
              className="h-10 border bg-background px-3 text-sm"
              name="attendeeEmail"
              type="email"
              placeholder="participant@example.com"
            />
            <Button type="submit" size="lg">
              <Ticket className="size-4" /> {t.ticket}
            </Button>
          </form>
        </div>
      </main>
    </MarketingPageShell>
  );
}
