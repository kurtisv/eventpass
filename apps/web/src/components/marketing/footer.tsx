import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 text-sm text-muted-foreground sm:grid-cols-3">
        <div>
          <p className="font-medium text-foreground">KV Web Starter</p>
          <p className="mt-2">Base modulaire pour sites vitrines, booking et API payantes.</p>
        </div>
        <div className="grid gap-2">
          <Link href="/services">Services</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
        </div>
        <div className="grid gap-2">
          <Link href="/privacy">Confidentialite</Link>
          <Link href="/terms">Conditions</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
