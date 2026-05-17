const stats = [
  ["Rendez-vous aujourd'hui", "0"],
  ["Revenus du mois", "$0"],
  ["Requetes API du mois", "0"],
  ["Abonnements actifs", "0"],
];

export default function DashboardPage() {
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
      </div>
    </main>
  );
}
