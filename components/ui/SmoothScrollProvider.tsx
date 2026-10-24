"use client";

import { useEffect, useRef } from "react";

type LenisInstance = {
  raf: (time: number) => void;
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { duration?: number; immediate?: boolean; offset?: number }
  ) => void;
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
    let startPromise: Promise<LenisInstance | null> | null = null;
    mountedRef.current = true;

    const startLenis = (): Promise<LenisInstance | null> => {
      if (!mountedRef.current) return Promise.resolve(null);
      if (lenisRef.current) return Promise.resolve(lenisRef.current);
      if (startPromise) return startPromise;

      // PERF: Keep Lenis out of the critical hydration bundle until the user actually starts scrolling.
      startPromise = import("@studio-freight/lenis")
        .then(({ default: Lenis }) => {
          if (!mountedRef.current) return null;

          const lenis = new Lenis({
            lerp: 0.1,
            wheelMultiplier: 1.1,
            smoothWheel: true,
          });
          lenisRef.current = lenis;

          function raf(time: number) {
            // PERF: Stop Lenis RAF immediately after unmount so no zombie scroll loop survives route changes.
            if (!mountedRef.current || !lenisRef.current) return;
            lenisRef.current.raf(time);
            rafIdRef.current = requestAnimationFrame(raf);
          }

          // PERF: Store the RAF id in a ref so cleanup always cancels the latest scheduled frame.
          rafIdRef.current = requestAnimationFrame(raf);
          return lenis;
        })
        .catch(() => null)
        .finally(() => {
          if (!lenisRef.current) startPromise = null;
        });

      return startPromise;
    };

    const scrollToHash = (hash: string) => {
      let id = hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        // Keep the raw hash when a malformed percent escape is supplied.
      }
      const target = document.getElementById(id);
      if (!target) return;

      void startLenis().then((lenis) => {
        if (!mountedRef.current) return;
        if (lenis) {
          lenis.scrollTo(target, { duration: 1.05, offset: -12 });
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    };

    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const origin = event.target;
      if (!(origin instanceof Element)) return;
      const anchor = origin.closest<HTMLAnchorElement>("a[href^='#']");
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      let id = hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        // Keep the raw hash when a malformed percent escape is supplied.
      }
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      history.pushState(null, "", hash);
      scrollToHash(hash);
    };

    const onPopState = () => {
      if (window.location.hash) scrollToHash(window.location.hash);
    };

    // Same-page links should use the same eased scroll path as wheel input instead of falling back
    // to an abrupt browser jump (especially noticeable when a deferred section is just mounting).
    document.addEventListener("click", onAnchorClick);
    window.addEventListener("popstate", onPopState);

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
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("popstate", onPopState);
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
      startPromise = null;
    };
  }, []);

  return <>{children}</>;
};
