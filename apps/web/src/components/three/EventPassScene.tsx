"use client";

import dynamic from "next/dynamic";

import { EventPassSceneFallback } from "./EventPassSceneFallback";
import { ThreeSceneShell } from "./ThreeSceneShell";

const EventPassSceneCanvas = dynamic(() => import("./EventPassSceneCanvas"), {
  ssr: false,
  loading: () => <EventPassSceneFallback />,
});

export function EventPassScene() {
  return (
    <ThreeSceneShell
      label="EventPass client event card"
      fallback={<EventPassSceneFallback />}
      className="h-[420px] sm:h-[460px] lg:h-[520px]"
    >
      <EventPassSceneCanvas />
    </ThreeSceneShell>
  );
}
