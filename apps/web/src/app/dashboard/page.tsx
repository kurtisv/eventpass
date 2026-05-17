import { EcosystemNotificationPanel } from "@/components/ecosystem/notification-panel";
import { completeTicketCheckIn, createTicketFromEcosystemEvent } from "@/app/actions/eventpass";
import { getIncomingEcosystemEvents } from "@/lib/ecosystem";
import { prisma } from "@/lib/db";

const timeline = ["Luma Studio", "QuotePilot", "ReserveFlow", "ClientHub", "CommerceKit", "EventPass", "SupportDesk Lite", "API Meter"];

const agenda = [
  ["09:30", "Accueil participants", "badges et verification billets"],
  ["10:00", "Atelier projet", "contexte ClientHub et commande CommerceKit"],
  ["11:15", "Check-in final", "signal vers SupportDesk Lite et API Meter"],
];

export default async function DashboardPage() {
  const [participantEvents, tickets] = await Promise.all([
    getIncomingEcosystemEvents("eventpass", undefined, 8),
    prisma.eventPassTicket.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { event: true },
    }).catch(() => []),
  ]);
  const checkedIn = tickets.filter((ticket) => ticket.status === "CHECKED_IN").length;
  const stats = [
    ["Evenements actifs", String(new Set(tickets.map((ticket) => ticket.eventId)).size)],
    ["Inscriptions", String(participantEvents.length)],
    ["Billets emis", String(tickets.length)],
    ["Check-ins", String(checkedIn)],
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
              Event operations / tickets / check-in
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal">Event launch desk</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              EventPass transforme un projet ou une commande en atelier testable: inscription,
              billet, badge participant, presence et signal de check-in.
            </p>
          </div>
          <section className="rounded-xl border bg-white/85 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Ce que tu peux tester ici
            </p>
            <div className="mt-3 grid gap-2 text-sm">
              <p><span className="font-semibold">Recoit:</span> projet ClientHub ou commande CommerceKit.</p>
              <p><span className="font-semibold">Transmet:</span> ticket event.ticket.created puis event.checkin.completed.</p>
              <p><span className="font-semibold">Boilerplate:</span> operations evenement, token billet, server actions.</p>
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
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Timeline du parcours</p>
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
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Agenda demo</p>
            <div className="mt-4 grid gap-3">
              {agenda.map(([time, title, detail]) => (
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
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-200">Badge participant</p>
            <div className="mt-5 rounded-xl border border-white/15 bg-white/10 p-5">
              <p className="text-sm text-white/60">Nom venant du parcours</p>
              <p className="mt-2 text-2xl font-semibold">{tickets[0]?.attendeeName ?? "Participant recu"}</p>
              <p className="mt-4 font-mono text-xs text-white/50">{tickets[0]?.flowId ?? "flowId apres creation du billet"}</p>
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
              Event operations
            </p>
            <h2 className="mt-2 text-xl font-semibold">Participants provenant de ClientHub / CommerceKit</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Les projets et commandes peuvent devenir ateliers, billets, inscriptions et check-in.
            </p>
          </div>
          <div className="divide-y">
            {participantEvents.map((event) => (
              <article key={event.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="border bg-background px-2 py-1 text-xs font-semibold">{event.sourceApp}</span>
                    <span className="font-mono text-xs text-muted-foreground">{event.flowId}</span>
                  </div>
                  <h3 className="mt-3 font-semibold">{event.customerName ?? "Participant recu"}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{event.description ?? event.title}</p>
                </div>
                <div className="flex flex-col items-start gap-3 self-center md:items-end">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                    {event.eventType}
                  </span>
                  <form action={createTicketFromEcosystemEvent}>
                    <input type="hidden" name="eventId" value={event.id} />
                    <button className="border bg-foreground px-3 py-2 text-xs font-semibold text-background hover:opacity-90">
                      Creer le billet lie
                    </button>
                  </form>
                </div>
              </article>
            ))}
            {participantEvents.length === 0 ? (
              <div className="p-5">
                <p className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
                  Aucun participant entrant pour l&apos;instant. Cree un projet ClientHub ou une commande CommerceKit;
                  EventPass affichera ensuite le client, le contexte projet, le flowId et l&apos;action billet.
                </p>
              </div>
            ) : null}
          </div>
        </section>
        <section className="mt-8 rounded-xl border bg-white/90 shadow-sm">
          <div className="border-b p-5">
            <h2 className="text-xl font-semibold">Billets crees et check-in</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Un check-in publie son evenement vers SupportDesk Lite et API Meter avec le meme flowId.
            </p>
          </div>
          <div className="divide-y">
            {tickets.map((ticket) => (
              <article key={ticket.id} className="grid gap-3 p-5 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-semibold">{ticket.attendeeName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{ticket.event.name}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{ticket.flowId ?? "sans flowId"}</p>
                </div>
                {ticket.status === "CHECKED_IN" ? (
                  <span className="self-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    CHECKED_IN
                  </span>
                ) : (
                  <form action={completeTicketCheckIn} className="self-center">
                    <input type="hidden" name="ticketId" value={ticket.id} />
                    <button className="border bg-background px-3 py-2 text-xs font-semibold hover:bg-secondary">
                      Marquer check-in
                    </button>
                  </form>
                )}
              </article>
            ))}
            {tickets.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">
                Aucun billet cree depuis l&apos;ecosysteme pour l&apos;instant.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
