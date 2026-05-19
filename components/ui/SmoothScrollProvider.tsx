"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export const SmoothScrollProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1, // Slower interpolation for a buttery "gliding" sensation
      wheelMultiplier: 1.1, // More modest jump distance so content remains visible
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
