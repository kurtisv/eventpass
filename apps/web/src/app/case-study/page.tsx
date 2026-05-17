import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { MarketingPageShell } from "@/components/marketing/page-shell";
import { Button } from "@/components/ui/button";
import { getCurrentLocale } from "@/lib/locale";

const copy = {
  fr: {
    eyebrow: "Etude de cas",
    title: "EventPass prouve que le boilerplate peut gerer inscription et check-in.",
    intro: "Le projet complete la serie avec des evenements relies aux clients, ventes, projets et tickets de support du meme ecosysteme.",
    cta: "Explorer les evenements",
    points: [
      "Liste publique des evenements et pages detaillees.",
      "Visualisation de capacite et logique de reservation.",
      "Billet tokenise avec preuve visuelle de type QR.",
      "Dashboard admin pour suivre les arrivees.",
      "Participants alignes avec les memes clients que ClientHub, CommerceKit et SupportDesk.",
      "Interface FR/EN et identite visuelle distincte.",
    ],
  },
  en: {
    eyebrow: "Case study",
    title: "EventPass proves the boilerplate can handle registration and check-in.",
    intro: "The project completes the series with events connected to the same clients, sales, projects, and support tickets in the ecosystem.",
    cta: "Explore events",
    points: [
      "Public event listing and event detail pages.",
      "Capacity visualization and registration logic concept.",
      "Tokenized ticket page with QR-code style proof.",
      "Admin check-in dashboard for arrivals.",
      "Attendees aligned with the same clients as ClientHub, CommerceKit, and SupportDesk.",
      "FR/EN switcher and distinct visual identity.",
    ],
  },
};

export default async function CaseStudyPage() {
  const locale = await getCurrentLocale();
  const t = copy[locale];

  return (
    <MarketingPageShell>
      <main className="mx-auto grid max-w-5xl gap-8 px-6 py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal text-balance sm:text-5xl">{t.title}</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{t.intro}</p>
        </div>
        <div className="grid gap-3">
          {t.points.map((point) => (
            <div key={point} className="flex gap-3 rounded-lg border bg-card p-5 text-sm leading-6 text-muted-foreground">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
              {point}
            </div>
          ))}
        </div>
        <Button asChild><Link href="/events">{t.cta}</Link></Button>
      </main>
    </MarketingPageShell>
  );
}
