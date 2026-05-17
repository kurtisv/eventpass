import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { MarketingPageShell } from "@/components/marketing/page-shell";
import { events } from "@/data/eventpass";
import { getCurrentLocale } from "@/lib/locale";

const copy = {
  fr: {
    eyebrow: "Evenements",
    title: "Catalogue des evenements",
    seats: "places",
  },
  en: {
    eyebrow: "Events",
    title: "Event catalog",
    seats: "seats",
  },
};

export default async function EventsPage() {
  const locale = await getCurrentLocale();
  const t = copy[locale];

  return (
    <MarketingPageShell>
      <main className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal">{t.title}</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <Link key={event.slug} href={`/events/${event.slug}`} className="rounded-lg border bg-card p-5 hover:border-primary">
              <CalendarDays className="size-6 text-primary" />
              <p className="mt-5 text-sm text-muted-foreground">{event.type} - {event.date}</p>
              <h2 className="mt-1 text-2xl font-semibold">{event.name}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{event.description[locale]}</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">{event.registered}/{event.capacity} {t.seats}</p>
              <div className="mt-5 h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${(event.registered / event.capacity) * 100}%` }} />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </MarketingPageShell>
  );
}
