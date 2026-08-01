"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * Intro handoff signal.
 *
 * The loader owns the first ~1.8s of the page and covers it completely. Without a
 * shared signal the hero's entrance timers start at mount — i.e. behind the opaque
 * overlay — and the whole choreography finishes before the visitor can see any of
 * it. The loader fires `markIntroReady()` the moment its shockwave starts expanding,
 * and every gated animation begins from that instant instead.
 *
 * Modelled as an external store rather than component state so that React can read it
 * during render: sections mounting after the handoff must see `true` immediately, with
 * no extra commit.
 */

type IntroListener = () => void;

let introReady = false;
const listeners = new Set<IntroListener>();

export function markIntroReady() {
  if (introReady) return;
  introReady = true;
  // Snapshot before iterating: a listener may unsubscribe as it runs.
  for (const listener of [...listeners]) listener();
}

export function isIntroReady() {
  return introReady;
}

export function subscribeIntro(listener: IntroListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Always false on the server so the markup React sends matches the client's first render;
// the store flips only once the loader hands off in the browser.
const getServerSnapshot = () => false;

/**
 * Returns false until the loader hands off, then true for the rest of the session.
 *
 * The failsafe matters: if the loader is ever removed, throws before its outro, or the
 * tab is backgrounded so its timers never advance, the hero must still appear. It calls
 * markIntroReady() rather than setting local state so every other gated consumer — and
 * the loader's own body-unlock — recovers on the same signal.
 */
export function useIntroGate(failsafeMs = 4000) {
  const started = useSyncExternalStore(subscribeIntro, isIntroReady, getServerSnapshot);

  useEffect(() => {
    if (started) return;
    const failsafe = window.setTimeout(markIntroReady, failsafeMs);
    return () => window.clearTimeout(failsafe);
  }, [started, failsafeMs]);

  return started;
}
