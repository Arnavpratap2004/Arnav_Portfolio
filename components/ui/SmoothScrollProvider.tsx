"use client";

import { useEffect, useRef } from "react";

type LenisInstance = {
  raf: (time: number) => void;
  destroy: () => void;
};

export const SmoothScrollProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const rafIdRef = useRef<number | null>(null);
  const mountedRef = useRef(false);
  const lenisRef = useRef<LenisInstance | null>(null);

  // PERF: Broadcast scroll activity via a class on <html>. Ambient background animations
  // (canvas loops, shard rotation) pause while it is set, handing the full frame budget to
  // scrolling — their motion is imperceptible mid-scroll anyway.
  useEffect(() => {
    const root = document.documentElement;
    let timer: number | null = null;

    const onActivity = () => {
      if (timer === null) root.classList.add("is-scrolling");
      else window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        timer = null;
        root.classList.remove("is-scrolling");
      }, 160);
    };

    window.addEventListener("scroll", onActivity, { passive: true });
    // PERF: scroll events fire only AFTER the first scrolled frame renders, so ambient
    // canvases (GlassBackground composer) could land one full render on that same frame —
    // measured as a recurring ~33ms scroll-start hitch in About. wheel/touchmove fire
    // BEFORE the frame moves, closing the gap; a wheel with no scroll just freezes
    // ambients for a harmless 160ms.
    window.addEventListener("wheel", onActivity, { passive: true });
    window.addEventListener("touchmove", onActivity, { passive: true });
    return () => {
      window.removeEventListener("scroll", onActivity);
      window.removeEventListener("wheel", onActivity);
      window.removeEventListener("touchmove", onActivity);
      if (timer !== null) window.clearTimeout(timer);
      root.classList.remove("is-scrolling");
    };
  }, []);

  useEffect(() => {
    let hasStarted = false;
    mountedRef.current = true;

    const startLenis = async () => {
      if (hasStarted || !mountedRef.current) return;
      hasStarted = true;

      // PERF: Keep Lenis out of the critical hydration bundle until the user actually starts scrolling.
      const { default: Lenis } = await import("@studio-freight/lenis");
      if (!mountedRef.current) return;

      lenisRef.current = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1.1,
        smoothWheel: true,
      });

      function raf(time: number) {
        // PERF: Stop Lenis RAF immediately after unmount so no zombie scroll loop survives route changes.
        if (!mountedRef.current || !lenisRef.current) return;
        lenisRef.current.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      }

      // PERF: Store the RAF id in a ref so cleanup always cancels the latest scheduled frame.
      rafIdRef.current = requestAnimationFrame(raf);
    };

    const onScrollIntent = () => {
      void startLenis();
    };

    const listenerOptions: AddEventListenerOptions = { passive: true, once: true };
    // PERF: Passive one-shot listeners avoid blocking the first wheel/touch/scroll event while deferring Lenis boot cost.
    window.addEventListener("wheel", onScrollIntent, listenerOptions);
    window.addEventListener("touchstart", onScrollIntent, listenerOptions);
    window.addEventListener("scroll", onScrollIntent, listenerOptions);

    // PERF: Also boot Lenis during post-hydration idle — otherwise the first wheel gesture races
    // the async import and lands as raw native scroll before smoothing kicks in.
    let idleId: number | undefined;
    const idleTimer = window.setTimeout(() => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(() => void startLenis(), { timeout: 1500 });
      } else {
        void startLenis();
      }
    }, 600);

    return () => {
      mountedRef.current = false;
      window.removeEventListener("wheel", onScrollIntent);
      window.removeEventListener("touchstart", onScrollIntent);
      window.removeEventListener("scroll", onScrollIntent);
      window.clearTimeout(idleTimer);
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
};
