import Link from "next/link";
import { ArrowRight, CalendarDays, KeyRound, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MarketingPageShell } from "@/components/marketing/page-shell";

const modules = [
  {
    name: "Sites vitrines",
    description: "Pages marketing, SEO, blog Sanity, formulaires et sections reutilisables.",
    icon: ShieldCheck,
  },
  {
    name: "Rendez-vous",
    description: "Services, staff, disponibilites, exceptions, paiements et rappels.",
    icon: CalendarDays,
  },
  {
    name: "API payante",
    description: "Cles API hashees, plans Stripe, limites, usage tracking et docs OpenAPI.",
    icon: KeyRound,
  },
];

export default function Home() {
  return (
    <MarketingPageShell>
    <main>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              KV Web Starter
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-balance sm:text-6xl">
              Une base premium pour vendre des sites, du booking et des API.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Next.js App Router, TypeScript strict, Prisma, Auth.js, Stripe,
              Resend, Sanity-ready et une architecture modulaire pour livrer
              vite sans repartir de zero.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/dashboard">
                  Ouvrir le dashboard <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/api/health">Verifier API</Link>
              </Button>
            </div>
          </div>

          <div className="border bg-card p-6 shadow-sm">
            <div className="grid gap-4">
              {modules.map((module) => (
                <div key={module.name} className="flex gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex size-10 shrink-0 items-center justify-center border bg-background">
                    <module.icon className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-medium">{module.name}</h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
    </MarketingPageShell>
  );
}
