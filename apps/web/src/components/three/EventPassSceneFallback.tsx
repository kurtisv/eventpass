export function EventPassSceneFallback() {
  return (
    <div className="relative h-full overflow-hidden bg-[radial-gradient(circle_at_72%_28%,rgba(167,139,250,0.2),transparent_18rem),radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.08),transparent_12rem),linear-gradient(150deg,#161326,#24183e_46%,#1a1333)] p-5 text-white sm:p-6">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:42px_42px] opacity-30" />

      <div className="absolute -right-16 top-8 h-40 w-40 rounded-full bg-violet-400/12 blur-3xl" />
      <div className="absolute -left-10 bottom-12 h-36 w-36 rounded-full bg-indigo-300/10 blur-3xl" />

      <div className="relative flex h-full items-center justify-center">
        <div className="relative w-full max-w-[34rem] [perspective:1400px]">
          <div className="absolute -left-1 top-5 h-[17.5rem] w-full rounded-[2rem] border border-white/8 bg-[#0f0c1c]/60 shadow-[0_32px_80px_rgba(5,3,14,0.45)] [transform:translate3d(0.9rem,0.9rem,-1.2rem)_rotateX(8deg)_rotateY(-18deg)]" />

          <div className="absolute -left-7 top-7 hidden rounded-full border border-white/10 bg-white/8 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-violet-100 shadow-lg backdrop-blur md:block">
            Ticket token
          </div>

          <div className="absolute -right-3 top-4 hidden h-28 w-28 place-items-center rounded-full border border-white/10 bg-[#120f24]/82 text-center shadow-lg backdrop-blur md:grid">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-violet-200/75">Capacity</p>
              <p className="mt-1 text-lg font-semibold">86 / 120</p>
              <p className="text-[0.65rem] text-violet-100/70">seats</p>
            </div>
          </div>

          <div className="absolute -right-5 bottom-8 hidden rounded-full border border-emerald-300/15 bg-emerald-300/10 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-emerald-100 shadow-lg backdrop-blur md:block">
            Check-in ready
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/14 bg-[linear-gradient(150deg,rgba(253,250,255,0.96),rgba(234,227,248,0.96))] p-4 text-[#21163c] shadow-[0_28px_90px_rgba(10,8,24,0.4)] [transform:rotateX(9deg)_rotateY(-17deg)_rotateZ(1deg)] sm:p-5">
            <div className="pointer-events-none absolute inset-x-5 top-0 h-16 rounded-b-[2rem] bg-[linear-gradient(180deg,rgba(167,139,250,0.16),transparent)]" />
            <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-[3.25rem] place-items-center rounded-[1.2rem] bg-[linear-gradient(145deg,#2a1e49,#453178)] text-lg font-semibold text-white shadow-lg shadow-violet-950/20">
                    MC
                  </div>
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#705da5]">Client event pass</p>
                    <h3 className="mt-1 text-xl font-semibold sm:text-2xl">Mara Chen</h3>
                    <p className="text-sm text-[#5e5579]">Northline Studio</p>
                  </div>
                </div>

                <div className="rounded-[1.35rem] border border-[#d8cfee] bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#705da5]">Event</p>
                  <p className="mt-2 text-lg font-semibold leading-tight sm:text-[1.4rem]">KV Client Launch Summit</p>
                  <div className="mt-3 grid gap-2 text-sm text-[#50466b] sm:grid-cols-2">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#8a7bb1]">Venue</p>
                      <p className="mt-1 font-medium">Port Hall Montreal</p>
                    </div>
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#8a7bb1]">Date</p>
                      <p className="mt-1 font-medium">June 12, 2026</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#5d527a]">
                  <span className="rounded-full border border-[#d9d0ee] bg-white/78 px-3 py-1.5">Source ClientHub</span>
                  <span className="rounded-full border border-[#d9d0ee] bg-white/78 px-3 py-1.5">Ticket token</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="rounded-[1.35rem] border border-[#d8cfee] bg-[#f7f3ff] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                  <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#705da5]">QR</p>
                  <div className="grid aspect-square grid-cols-5 gap-1 rounded-[1rem] bg-white p-3">
                    {Array.from({ length: 25 }, (_, index) => (
                      <span
                        key={index}
                        className={`rounded-[0.22rem] ${[0, 1, 4, 5, 6, 8, 10, 12, 14, 16, 18, 19, 20, 21, 23, 24].includes(index) ? "bg-[#24183e]" : "bg-[#e7def7]"}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.2rem] border border-emerald-300/18 bg-[linear-gradient(135deg,rgba(23,89,74,0.9),rgba(46,139,123,0.92))] px-4 py-3 text-white shadow-lg shadow-emerald-950/15">
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-emerald-100/70">Status</p>
                  <p className="mt-1 text-sm font-semibold">Confirmed</p>
                  <p className="text-xs text-emerald-50/75">Ready for check-in</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
