import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, QrCode, ScanLine, Ticket, UsersRound } from "lucide-react";

import { MarketingPageShell } from "@/components/marketing/page-shell";
import { Button } from "@/components/ui/button";
import { agendaBlocks, ecosystemTimeline, eventStats, events, registrationLanes } from "@/data/eventpass";
import { getCurrentLocale } from "@/lib/locale";

const copy = {
  fr: {
    eyebrow: "Projet 8 - Inscription evenementielle",
    title: "Un systeme d'evenement qui gere capacite, billets et check-in.",
    intro: "EventPass montre le dernier angle du boilerplate: inscription publique, logique de places, billet tokenise et cockpit admin pour l'accueil.",
    primary: "Voir les evenements",
    secondary: "Voir l'etude",
    modules: ["Capacite visible", "Billets par token", "Check-in admin", "Email fallback"],
    ecosystemTitle: "Les evenements prolongent le parcours client.",
    ecosystemText:
      "EventPass utilise les memes personnes que les autres modules: un lead devient client, rejoint un atelier, achete du materiel dans CommerceKit et peut recevoir un suivi SupportDesk.",
    agendaTitle: "Agenda operationnel",
    lanesTitle: "Pipeline inscriptions",
  },
  en: {
    eyebrow: "Project 8 - Event registration",
    title: "An event system that manages capacity, tickets, and check-in.",
    intro: "EventPass shows the final boilerplate angle: public registration, seat logic, tokenized ticket, and admin cockpit for arrivals.",
    primary: "View events",
    secondary: "View case study",
    modules: ["Visible capacity", "Token tickets", "Admin check-in", "Email fallback"],
    ecosystemTitle: "Events extend the client journey.",
    ecosystemText:
      "EventPass uses the same people as the other modules: a lead becomes a client, joins a workshop, buys materials in CommerceKit, and can receive SupportDesk follow-up.",
    agendaTitle: "Operations agenda",
    lanesTitle: "Registration pipeline",
  },
};

export default async function Home() {
  const locale = await getCurrentLocale();
  const t = copy[locale];

  return (
    <MarketingPageShell>
      <main className="overflow-hidden">
        <section className="relative border-b">
          <div className="absolute inset-0 -z-10 eventpass-grid" />
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
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
            <div className="rounded-[1.25rem] border bg-[#17132a] text-white shadow-2xl shadow-violet-950/20">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#cdbdff]">Arrival cockpit</p>
                  <p className="mt-1 text-xl font-semibold">Founder Summit</p>
                </div>
                <div className="flex size-11 items-center justify-center rounded-full bg-[#ff7a45] text-[#17132a]">
                  <ScanLine className="size-5" />
                </div>
              </div>
              <div className="grid gap-4 p-5">
                {events.map((event) => (
                  <div key={event.slug} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{event.name}</p>
                        <p className="mt-1 text-sm text-white/55">{event.sourceModule}</p>
                      </div>
                      <p className="rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-[#cdbdff]">{event.registered}/{event.capacity}</p>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-[#ff7a45]" style={{ width: `${(event.registered / event.capacity) * 100}%` }} />
                    </div>
                  </div>
                ))}
                <div className="grid gap-3 sm:grid-cols-4">
                  {[Ticket, QrCode, ScanLine, CheckCircle2].map((Icon, index) => (
                    <div key={t.modules[index]} className="rounded-lg border border-white/10 bg-white/[0.08] p-3 text-xs text-white/72">
                      <Icon className="mb-3 size-4 text-[#cdbdff]" />
                      {t.modules[index]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="border-b bg-[#fff7ed]">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a3412]">{t.agendaTitle}</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-balance sm:text-5xl">
                {locale === "fr" ? "Calendrier, billets et inscriptions sont visibles dans le meme cockpit." : "Calendar, tickets, and registrations sit in the same cockpit."}
              </h2>
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
        <section className="border-y bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                KV Portfolio ecosystem
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-normal text-balance sm:text-5xl">
                {t.ecosystemTitle}
              </h2>
              <p className="mt-5 text-lg leading-8 text-primary-foreground/75">{t.ecosystemText}</p>
            </div>
            <div className="grid gap-3">
              {ecosystemTimeline.map((item, index) => (
                <div key={item.module} className="grid gap-3 rounded-lg border border-white/15 bg-white/[0.06] p-4 sm:grid-cols-[3rem_0.7fr_1fr]">
                  <p className="font-mono text-sm text-secondary">0{index + 1}</p>
                  <p className="font-semibold">{item.module}</p>
                  <p className="text-sm text-primary-foreground/72">{item[locale]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </MarketingPageShell>
  );
}
