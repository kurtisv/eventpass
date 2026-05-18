import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, ScanLine, UsersRound } from "lucide-react";

import { MarketingPageShell } from "@/components/marketing/page-shell";
import { EventPassScene } from "@/components/three/EventPassScene";
import { Button } from "@/components/ui/button";
import { agendaBlocks, eventStats, events, registrationLanes } from "@/data/eventpass";
import { getCurrentLocale } from "@/lib/locale";

const copy = {
  fr: {
    eyebrow: "Carte evenement client 3D",
    title: "Une carte evenement client qui relie billet, statut et check-in.",
    intro:
      "EventPass transforme les informations client en pass evenementiel clair, premium et pret au controle: identite, evenement, QR, capacite et check-in sont lisibles des le hero.",
    primary: "Voir les evenements",
    secondary: "Voir l'etude",
    modules: ["Capacite visible", "Billets par token", "Check-in admin", "Email fallback"],
    agendaTitle: "Agenda operationnel",
    lanesTitle: "Pipeline inscriptions",
    proofTitle: "Un site evenement doit donner envie d'entrer dans la salle.",
  },
  en: {
    eyebrow: "3D client event card",
    title: "A client event card that ties ticket, status, and check-in together.",
    intro:
      "EventPass turns client information into a premium event pass: identity, event details, QR, capacity, and check-in readiness are readable directly in the hero.",
    primary: "View events",
    secondary: "View case study",
    modules: ["Visible capacity", "Token tickets", "Admin check-in", "Email fallback"],
    agendaTitle: "Operations agenda",
    lanesTitle: "Registration pipeline",
    proofTitle: "An event site should make people feel the room before they enter it.",
  },
} as const;

export default async function Home() {
  const locale = await getCurrentLocale();
  const t = copy[locale];

  return (
    <MarketingPageShell>
      <main className="overflow-hidden">
        <section className="relative border-b">
          <div className="absolute inset-0 -z-10 eventpass-grid" />
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border bg-card/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{t.eyebrow}</p>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-normal text-balance sm:text-6xl lg:text-7xl">{t.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{t.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg"><Link href="/events">{t.primary} <ArrowRight className="size-4" /></Link></Button>
                <Button asChild size="lg" variant="secondary"><Link href="/case-study">{t.secondary}</Link></Button>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {eventStats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border bg-card/85 p-4">
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <EventPassScene />
          </div>
        </section>

        <section className="border-b bg-[#fff7ed]">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a3412]">{t.agendaTitle}</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-balance sm:text-5xl">{t.proofTitle}</h2>
              <div className="mt-8 grid gap-3">
                {registrationLanes.map((lane) => (
                  <div key={lane.label} className="border bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium">{lane.label}</span>
                      <span className="font-mono text-sm">{lane.value}</span>
                    </div>
                    <div className="mt-3 h-2 bg-black/10">
                      <div className={`h-2 ${lane.tone}`} style={{ width: `${Math.min(Number(lane.value), 60) + 25}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              {agendaBlocks.map((block) => (
                <article key={`${block.time}-${block.title}`} className="grid gap-4 border bg-white p-5 shadow-sm sm:grid-cols-[5rem_1fr_auto] sm:items-center">
                  <div className="flex items-center gap-2 font-mono text-sm text-[#9a3412]">
                    <Clock3 className="size-4" />
                    {block.time}
                  </div>
                  <div>
                    <h3 className="font-semibold">{block.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{block.module}</p>
                  </div>
                  <div className="flex items-center gap-2 border bg-[#17132a] px-3 py-2 text-sm font-semibold text-white">
                    <UsersRound className="size-4 text-[#ff7a45]" />
                    {block.seats}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-6 py-16 md:grid-cols-3">
          {events.map((event) => (
            <Link key={event.slug} href={`/events/${event.slug}`} className="rounded-lg border bg-card p-5 hover:border-primary">
              <CalendarDays className="size-6 text-primary" />
              <h2 className="mt-5 text-2xl font-semibold">{event.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{event.description[locale]}</p>
            </Link>
          ))}
          <Link href="/check-in" className="rounded-lg border bg-primary p-5 text-primary-foreground">
            <ScanLine className="size-6" />
            <h2 className="mt-5 text-2xl font-semibold">Check-in</h2>
            <p className="mt-2 text-sm text-primary-foreground/75">{locale === "fr" ? "Suivre les arrivees et le statut des billets." : "Review arrivals and ticket status."}</p>
          </Link>
        </section>
      </main>
    </MarketingPageShell>
  );
}
