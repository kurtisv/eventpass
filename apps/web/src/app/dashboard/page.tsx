import { EcosystemNotificationPanel } from "@/components/ecosystem/notification-panel";
import { completeTicketCheckIn, createTicketFromEcosystemEvent } from "@/app/actions/eventpass";
import { getIncomingEcosystemEvents } from "@/lib/ecosystem";
import { prisma } from "@/lib/db";

const stats = [
  ["Rendez-vous aujourd'hui", "0"],
  ["Revenus du mois", "$0"],
  ["Requetes API du mois", "0"],
  ["Abonnements actifs", "0"],
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

  return (
    <main className="px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Centre de controle</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([label, value]) => (
            <section key={label} className="border bg-card p-5">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-3 text-2xl font-semibold">{value}</p>
            </section>
          ))}
        </div>
        <div className="mt-8">
          <EcosystemNotificationPanel appKey="eventpass" />
        </div>
        <section className="mt-8 rounded-md border bg-card">
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
                  <h3 className="mt-3 font-semibold">{event.customerName ?? "Participant ecosysteme"}</h3>
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
              <p className="p-5 text-sm text-muted-foreground">
                Aucun participant entrant pour l'instant. ClientHub ou CommerceKit alimentera cette file.
              </p>
            ) : null}
          </div>
        </section>
        <section className="mt-8 rounded-md border bg-card">
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
                  <span className="self-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
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
                Aucun billet cree depuis l'ecosysteme pour l'instant.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
