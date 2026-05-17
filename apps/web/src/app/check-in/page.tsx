import { CheckCircle2, ScanLine } from "lucide-react";

import { MarketingPageShell } from "@/components/marketing/page-shell";
import { tickets } from "@/data/eventpass";
import { getCurrentLocale } from "@/lib/locale";

const copy = {
  fr: {
    eyebrow: "Check-in admin",
    title: "Comptoir d'arrivee",
    confirmed: "A valider",
    checked: "Arrive",
  },
  en: {
    eyebrow: "Admin check-in",
    title: "Arrival desk",
    confirmed: "Ready",
    checked: "Checked in",
  },
};

export default async function CheckInPage() {
  const locale = await getCurrentLocale();
  const t = copy[locale];

  return (
    <MarketingPageShell>
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal">{t.title}</h1>
        <div className="mt-8 rounded-lg border bg-card">
          {tickets.map((ticket) => (
            <div key={ticket.token} className="grid gap-3 border-b p-5 last:border-b-0 sm:grid-cols-[1fr_auto_auto]">
              <div>
                <p className="font-semibold">{ticket.attendeeName}</p>
                <p className="mt-1 text-sm text-muted-foreground">{ticket.eventName}</p>
              </div>
              <p className="text-sm font-medium">{ticket.checkedIn ? t.checked : t.confirmed}</p>
              {ticket.checkedIn ? <CheckCircle2 className="size-5 text-primary" /> : <ScanLine className="size-5 text-primary" />}
            </div>
          ))}
        </div>
      </main>
    </MarketingPageShell>
  );
}
