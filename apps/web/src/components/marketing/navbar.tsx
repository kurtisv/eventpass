import Link from "next/link";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { getCurrentLocale } from "@/lib/locale";

const copy = {
  fr: {
    nav: [
      { href: "/events", label: "Evenements" },
      { href: "/check-in", label: "Check-in" },
      { href: "/case-study", label: "Etude" },
    ],
    cta: "S'inscrire",
  },
  en: {
    nav: [
      { href: "/events", label: "Events" },
      { href: "/check-in", label: "Check-in" },
      { href: "/case-study", label: "Case study" },
    ],
    cta: "Register",
  },
};

export async function Navbar() {
  const locale = await getCurrentLocale();
  const t = copy[locale];

  return (
    <header className="border-b bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold">
          <span className="size-3 rounded-full bg-[var(--accent)]" />
          EventPass
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {t.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher current={locale} />
          <Button asChild size="sm">
            <Link href="/events">{t.cta}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
