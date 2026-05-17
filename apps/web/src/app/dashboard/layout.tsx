import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarDays,
  CreditCard,
  Gauge,
  KeyRound,
  LayoutDashboard,
  Settings,
  UserRoundCog,
  Users,
} from "lucide-react";

import { signOutCurrentUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/dashboard/availability", label: "Availability", icon: CalendarDays },
  { href: "/dashboard/services", label: "Services", icon: BriefcaseBusiness },
  { href: "/dashboard/staff", label: "Staff", icon: UserRoundCog },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/api-keys", label: "API Keys", icon: KeyRound },
  { href: "/dashboard/api-usage", label: "API Usage", icon: Gauge },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-muted text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background px-4 py-5 lg:block">
        <Link href="/" className="block px-2 text-lg font-semibold">
          KV Web Starter
        </Link>
        <nav className="mt-8 grid gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex h-10 items-center gap-3 px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <div>
            <p className="text-sm font-medium">{session?.user?.name ?? "Admin"}</p>
            <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
          </div>
          <form action={signOutCurrentUser}>
            <Button type="submit" variant="secondary">
              Deconnexion
            </Button>
          </form>
        </header>
        {children}
      </div>
    </div>
  );
}
