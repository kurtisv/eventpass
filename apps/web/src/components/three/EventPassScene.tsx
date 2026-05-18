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
    <ThreeSceneShell label="EventPass 3D access gate" fallback={<EventPassSceneFallback />}>
      <EventPassSceneCanvas />
    </ThreeSceneShell>
  );
}
