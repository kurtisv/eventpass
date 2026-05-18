import Image from "next/image";

const desktopImage = "/images/hero/eventpass-hero-3d.svg";
const mobileImage = "/images/hero/eventpass-hero-3d-mobile.svg";

export function EventPassScene() {
  return (
    <div className="eventpass-hero-image group relative h-[420px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#161326] shadow-2xl shadow-violet-950/25 sm:h-[460px] lg:h-[520px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(167,139,250,0.22),transparent_18rem),radial-gradient(circle_at_24%_18%,rgba(255,255,255,0.08),transparent_12rem),linear-gradient(150deg,#161326,#23173b_48%,#17112f)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:42px_42px] opacity-28" />

      <div className="absolute inset-0 hidden md:block">
        <Image
          src={desktopImage}
          alt=""
          fill
          priority
          unoptimized
          aria-hidden="true"
          sizes="(max-width: 1279px) 48vw, 42rem"
          className="object-contain object-center p-5 transition-transform duration-700 ease-out motion-safe:group-hover:-translate-y-1.5 motion-safe:group-hover:scale-[1.012]"
        />
      </div>

      <div className="absolute inset-0 md:hidden">
        <Image
          src={mobileImage}
          alt=""
          fill
          priority
          unoptimized
          aria-hidden="true"
          sizes="100vw"
          className="object-contain object-center p-4 transition-transform duration-700 ease-out motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-[1.01]"
        />
      </div>

      <div className="absolute inset-y-0 left-[-30%] w-[38%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.16),transparent)] opacity-32 mix-blend-screen transition-transform duration-1000 ease-out motion-reduce:hidden motion-safe:group-hover:translate-x-[210%]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#100d1d] via-[#100d1d]/55 to-transparent" />
    </div>
  );
}
