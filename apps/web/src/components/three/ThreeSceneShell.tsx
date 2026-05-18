"use client";

import { Component, Suspense, useEffect, useState, type ReactNode } from "react";

type ThreeSceneShellProps = {
  children: ReactNode;
  fallback: ReactNode;
  label?: string;
  className?: string;
  decorative?: boolean;
};

type SceneErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type SceneErrorBoundaryState = {
  hasError: boolean;
};

class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  state: SceneErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function listen(query: MediaQueryList, callback: () => void) {
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", callback);
    return () => query.removeEventListener("change", callback);
  }

  query.addListener(callback);
  return () => query.removeListener(callback);
}

function hasWebGLSupport() {
  const canvas = document.createElement("canvas");

  return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl"));
}

export function ThreeSceneShell({ children, fallback, label, className, decorative = true }: ThreeSceneShellProps) {
  const [canRenderScene, setCanRenderScene] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");

    const update = () => {
      setCanRenderScene(!reducedMotion.matches && !mobile.matches && hasWebGLSupport());
    };

    update();

    const disposeReducedMotion = listen(reducedMotion, update);
    const disposeMobile = listen(mobile, update);

    return () => {
      disposeReducedMotion();
      disposeMobile();
    };
  }, []);

  return (
    <div
      className={`relative isolate overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#161326] shadow-2xl shadow-violet-950/25 ${className ?? ""}`}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
    >
      {canRenderScene ? (
        <SceneErrorBoundary fallback={fallback}>
          <Suspense fallback={fallback}>{children}</Suspense>
        </SceneErrorBoundary>
      ) : (
        fallback
      )}
    </div>
  );
}
