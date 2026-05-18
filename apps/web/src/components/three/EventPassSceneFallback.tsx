export function EventPassSceneFallback() {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[1.5rem] border bg-[#17132a] p-6 text-white shadow-2xl shadow-violet-950/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(255,225,168,0.22),transparent_30%),linear-gradient(135deg,rgba(23,19,42,0.98),rgba(60,47,105,0.96))]" />
      <div className="relative grid min-h-[360px] grid-cols-[1fr_0.8fr] items-end gap-4">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffe1a8]">Access gate</p>
          <h3 className="mt-3 text-3xl font-semibold">Ticket scanned</h3>
          <p className="mt-3 text-sm leading-6 text-white/62">Capacity, ticket token, QR scan, and check-in status are visible before entry.</p>
        </div>
        <div className="rounded-3xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur">
          <div className="mx-auto mb-4 grid size-24 place-items-center rounded-2xl border border-[#ffe1a8]/50 text-[#ffe1a8]">QR</div>
          <p className="text-sm font-semibold">Checked-in</p>
        </div>
      </div>
    </div>
  );
}
