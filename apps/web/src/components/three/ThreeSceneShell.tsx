"use client";

import { useEffect, useState, type ReactNode } from "react";

type ThreeSceneShellProps = {
  children: ReactNode;
  fallback: ReactNode;
  label: string;
};

export function ThreeSceneShell({ children, fallback, label }: ThreeSceneShellProps) {
  const [useFallback, setUseFallback] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const update = () => setUseFallback(media.matches || mobile.matches);
    update();
    media.addEventListener("change", update);
    mobile.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      mobile.removeEventListener("change", update);
    };
  }, []);

  return (
    <div className="relative min-h-[440px] overflow-hidden rounded-[1.5rem] border bg-[#17132a] shadow-2xl shadow-violet-950/20" aria-label={label}>
      {useFallback ? fallback : children}
    </div>
  );
}
