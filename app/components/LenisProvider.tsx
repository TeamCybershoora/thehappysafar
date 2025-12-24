"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

type LenisProviderProps = {
  children: ReactNode;
};

export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isSmallScreen =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(max-width: 768px)").matches;

    if (prefersReducedMotion || isSmallScreen) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: true,
      lerp: 0.25,
      wheelMultiplier: 1.3,
      touchMultiplier: 1.15,
    });

    window.lenis = lenis;

    let frameId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      window.lenis = undefined;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
