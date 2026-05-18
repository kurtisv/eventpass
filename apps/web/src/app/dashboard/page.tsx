import { EcosystemNotificationPanel } from "@/components/ecosystem/notification-panel";
import { completeTicketCheckIn, createTicketFromEcosystemEvent } from "@/app/actions/eventpass";
import { getIncomingEcosystemEvents } from "@/lib/ecosystem";
import { prisma } from "@/lib/db";
import { getCurrentLocale } from "@/lib/locale";

const timeline = ["Luma Studio", "QuotePilot", "ReserveFlow", "ClientHub", "CommerceKit", "EventPass", "SupportDesk Lite", "API Meter"];

const agenda = {
  fr: [
    ["09:30", "Accueil participants", "badges et verification billets"],
    ["10:00", "Atelier projet", "contexte ClientHub et commande CommerceKit"],
    ["11:15", "Check-in final", "signal vers SupportDesk Lite et API Meter"],
  ],
  en: [
    ["09:30", "Participant arrival", "badges and ticket verification"],
    ["10:00", "Project workshop", "ClientHub context and CommerceKit order"],
    ["11:15", "Final check-in", "signal to SupportDesk Lite and API Meter"],
  ],
} as const;

export default async function DashboardPage() {
  const locale = await getCurrentLocale();
  const copy = locale === "fr"
    ? {
        productLabel: "Operations evenement / billets / check-in",
        title: "Bureau de lancement evenement",
        intro:
          "EventPass transforme un projet ou une commande en atelier testable: inscription, billet, badge participant, presence et signal de check-in.",
        testTitle: "Ce que tu peux tester ici",
        receives: "Recoit",
        receivesText: "event.intent.created depuis ClientHub.",
        sends: "Transmet",
        sendsText: "ticket event.ticket.created puis event.checkin.completed.",
        boilerplate: "Boilerplate",
        boilerplateText: "operations evenement, token billet, server actions.",
        stats: ["Evenements actifs", "Inscriptions", "Billets emis", "Check-ins"],
        timeline: "Timeline du parcours",
        agenda: "Agenda demo",
        participantBadge: "Badge participant",
        nameFromFlow: "Nom venant du parcours",
        participantReceived: "Participant recu",
        flowAfterTicket: "flowId apres creation du billet",
        operations: "Operations evenement",
        participantsTitle: "Atelier recommande depuis ClientHub",
        participantsText: "Le contexte du rendez-vous et de la soumission devient une inscription, un billet et un check-in.",
        createTicket: "Creer inscription et billet",
        emptyParticipants:
          "Aucun element recu pour l'instant. Creez d'abord un rendez-vous dans ReserveFlow puis centralisez le projet dans ClientHub pour alimenter EventPass.",
        ticketsTitle: "Billets crees et check-in",
        ticketsText: "Un check-in publie son evenement vers SupportDesk Lite et API Meter avec le meme flowId.",
        noFlow: "sans flowId",
        markCheckin: "Marquer check-in",
        noTickets: "Aucun billet cree depuis l'ecosysteme pour l'instant.",
      }
    : {
        productLabel: "Event operations / tickets / check-in",
        title: "Event launch desk",
        intro:
          "EventPass turns a project or order into a testable workshop: registration, ticket, attendee badge, attendance, and check-in signal.",
        testTitle: "What you can test here",
        receives: "Receives",
        receivesText: "event.intent.created from ClientHub.",
        sends: "Sends",
        sendsText: "event.ticket.created, then event.checkin.completed.",
        boilerplate: "Boilerplate",
        boilerplateText: "event operations, ticket token, server actions.",
        stats: ["Active events", "Registrations", "Issued tickets", "Check-ins"],
        timeline: "Journey timeline",
        agenda: "Demo agenda",
        participantBadge: "Participant badge",
        nameFromFlow: "Name from the journey",
        participantReceived: "Received participant",
        flowAfterTicket: "flowId after ticket creation",
        operations: "Event operations",
        participantsTitle: "Workshop recommended from ClientHub",
        participantsText: "The meeting and proposal context becomes a registration, ticket, and check-in.",
        createTicket: "Create registration and ticket",
        emptyParticipants:
          "No item received yet. Create a ReserveFlow meeting first, then centralize the project in ClientHub to feed EventPass.",
        ticketsTitle: "Created tickets and check-in",
        ticketsText: "A check-in publishes its event to SupportDesk Lite and API Meter with the same flowId.",
        noFlow: "no flowId",
        markCheckin: "Mark check-in",
        noTickets: "No ticket created from the ecosystem yet.",
      };
  const [participantEvents, tickets] = await Promise.all([
    getIncomingEcosystemEvents("eventpass", "event.intent.created", 8),
    prisma.eventPassTicket.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { event: true },
    }).catch(() => []),
  ]);
  const checkedIn = tickets.filter((ticket) => ticket.status === "CHECKED_IN").length;
  const stats = [
    [copy.stats[0], String(new Set(tickets.map((ticket) => ticket.eventId)).size)],
    [copy.stats[1], String(participantEvents.length)],
    [copy.stats[2], String(tickets.length)],
    [copy.stats[3], String(checkedIn)],
  ];

  return (
    <main className="bg-[linear-gradient(135deg,#fff7ed_0%,#fdf2f8_46%,#eef2ff_100%)] px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-end">
          <div>
          <p className="inline-flex rounded-full border bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            KV Portfolio Ecosystem - Demo Mode
          </p>
            <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {copy.productLabel}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal">{copy.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              {copy.intro}
            </p>
          </div>
          <section className="rounded-xl border bg-white/85 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {copy.testTitle}
            </p>
            <div className="mt-3 grid gap-2 text-sm">
              <p><span className="font-semibold">{copy.receives}:</span> {copy.receivesText}</p>
              <p><span className="font-semibold">{copy.sends}:</span> {copy.sendsText}</p>
              <p><span className="font-semibold">{copy.boilerplate}:</span> {copy.boilerplateText}</p>
            </div>
          </section>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([label, value]) => (
            <section key={label} className="rounded-xl border bg-white/85 p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-3 text-2xl font-semibold">{value}</p>
            </section>
          ))}
        </div>
        <div className="mt-8">
          <EcosystemNotificationPanel appKey="eventpass" />
        </div>
        <section className="mt-8 rounded-xl border bg-white/85 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{copy.timeline}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            {timeline.map((item, index) => (
              <span key={item} className={index === 5 ? "rounded-full border bg-foreground px-3 py-2 text-background" : "rounded-full border bg-background px-3 py-2"}>
                {String(index + 1).padStart(2, "0")} {item}
              </span>
            ))}
          </div>
        </section>
        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-xl border bg-white/85 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{copy.agenda}</p>
            <div className="mt-4 grid gap-3">
              {agenda[locale].map(([time, title, detail]) => (
                <div key={time} className="grid grid-cols-[4rem_1fr] gap-3 rounded-lg border bg-background p-3">
                  <span className="font-mono text-sm font-semibold text-primary">{time}</span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-[#111827] p-5 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-200">{copy.participantBadge}</p>
            <div className="mt-5 rounded-xl border border-white/15 bg-white/10 p-5">
              <p className="text-sm text-white/60">{copy.nameFromFlow}</p>
              <p className="mt-2 text-2xl font-semibold">{tickets[0]?.attendeeName ?? copy.participantReceived}</p>
              <p className="mt-4 font-mono text-xs text-white/50">{tickets[0]?.flowId ?? copy.flowAfterTicket}</p>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                <span className="rounded-md bg-white/10 px-2 py-2">Ticket</span>
                <span className="rounded-md bg-white/10 px-2 py-2">QR</span>
                <span className="rounded-md bg-white/10 px-2 py-2">Check-in</span>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-8 rounded-xl border bg-white/90 shadow-sm">
          <div className="border-b p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {copy.operations}
            </p>
            <h2 className="mt-2 text-xl font-semibold">{copy.participantsTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {copy.participantsText}
            </p>
          </div>
          <div className="divide-y">
            {participantEvents.map((event) => {
              const payload = typeof event.payload === "object" && event.payload !== null
                ? event.payload as Record<string, unknown>
                : {};
              return (
              <article key={event.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="border bg-background px-2 py-1 text-xs font-semibold">{event.sourceApp}</span>
                    <span className="font-mono text-xs text-muted-foreground">{event.flowId}</span>
                  </div>
                  <h3 className="mt-3 font-semibold">{event.customerName ?? copy.participantReceived}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{event.description ?? event.title}</p>
                  <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                    <span className="rounded-md border bg-background px-3 py-2">Projet: {String(payload.projectName ?? payload.projectType ?? "-")}</span>
                    <span className="rounded-md border bg-background px-3 py-2">Soumission: {String(payload.quoteNumber ?? "-")}</span>
                    <span className="rounded-md border bg-background px-3 py-2">Rendez-vous: {String(payload.startAt ?? "-")}</span>
                    <span className="rounded-md border bg-background px-3 py-2">Consultant: {String(payload.consultantName ?? "-")}</span>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-3 self-center md:items-end">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                    {event.eventType}
                  </span>
                  <form action={createTicketFromEcosystemEvent}>
                    <input type="hidden" name="eventId" value={event.id} />
                    <button className="border bg-foreground px-3 py-2 text-xs font-semibold text-background hover:opacity-90">
                      {copy.createTicket}
                    </button>
                  </form>
                </div>
              </article>
              );
            })}
            {participantEvents.length === 0 ? (
              <div className="p-5">
                <p className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
                  {copy.emptyParticipants}
                </p>
              </div>
            ) : null}
          </div>
        </section>
        <section className="mt-8 rounded-xl border bg-white/90 shadow-sm">
          <div className="border-b p-5">
            <h2 className="text-xl font-semibold">{copy.ticketsTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {copy.ticketsText}
            </p>
          </div>
          <div className="divide-y">
            {tickets.map((ticket) => (
              <article key={ticket.id} className="grid gap-3 p-5 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-semibold">{ticket.attendeeName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{ticket.event.name}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{ticket.flowId ?? copy.noFlow}</p>
                </div>
                {ticket.status === "CHECKED_IN" ? (
                  <span className="self-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    CHECKED_IN
                  </span>
                ) : (
                  <form action={completeTicketCheckIn} className="self-center">
                    <input type="hidden" name="ticketId" value={ticket.id} />
                    <button className="border bg-background px-3 py-2 text-xs font-semibold hover:bg-secondary">
                      {copy.markCheckin}
                    </button>
                  </form>
                )}
              </article>
            ))}
            {tickets.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">
                {copy.noTickets}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
