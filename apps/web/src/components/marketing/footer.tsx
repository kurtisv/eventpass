import Link from "next/link";

import { getCurrentLocale } from "@/lib/locale";

export async function Footer() {
  const locale = await getCurrentLocale();

  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 text-sm text-muted-foreground sm:grid-cols-3">
        <div>
          <p className="font-medium text-foreground">EventPass</p>
          <p className="mt-2">
            {locale === "fr"
              ? "Inscription, capacite, billet token et check-in admin."
              : "Registration, capacity, token ticket, and admin check-in."}
          </p>
        </div>
        <div className="grid gap-2">
          <Link href="/events">{locale === "fr" ? "Evenements" : "Events"}</Link>
          <Link href="/check-in">Check-in</Link>
          <Link href="/case-study">{locale === "fr" ? "Etude" : "Case study"}</Link>
        </div>
        <div className="grid gap-2">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
