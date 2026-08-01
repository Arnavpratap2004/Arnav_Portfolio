"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface MoonWalkMediaProps {
  isInView: boolean;
}

/** Network Information API — still non-standard, so it is typed locally rather than globally. */
type NetworkInformation = { saveData?: boolean; effectiveType?: string };

function shouldSkipVideo(): boolean {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(max-width: 767px)").matches) return true;

  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (connection?.saveData) return true;
  return connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g";
}

export function MoonWalkMedia({ isInView }: MoonWalkMediaProps) {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (!isInView || shouldReduceMotion || videoEnabled) return;
    // PERF/DATA: The video is purely a decorative backdrop, but at 3.6MB it is by far the
    // largest transfer on the page. Phones keep the poster (which the layered gradients above
    // already sit on, so the section looks identical) and skip the fetch — along with the
    // continuous decode that drains battery. Also honours Save-Data and 2G connections.
    if (shouldSkipVideo()) return;

    const timeout = window.setTimeout(() => {
      setVideoEnabled(true);
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [isInView, shouldReduceMotion, videoEnabled]);

  useEffect(() => {
    const video = videoRef.current;
    if (!videoEnabled || !video) return;

    const playVideo = () => {
      void video.play().catch(() => undefined);
    };

    if (video.readyState >= 3) playVideo();
    video.addEventListener("canplay", playVideo, { once: true });

    return () => video.removeEventListener("canplay", playVideo);
  }, [videoEnabled]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <Image
        src="/moon-walk/moon-walk-poster.webp"
        alt=""
        fill
        sizes="100vw"
        // PERF: This section premounts during idle — fetch/decode the full-screen poster then,
        // not as a decode burst when the user scrolls into Contact.
        loading="eager"
        className="object-cover"
        style={{ objectPosition: "center center", opacity: videoReady ? 0.08 : 1, transform: "scale(1.01)" }}
      />

      {videoEnabled && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          // PERF: 130KB, not the 1.27MB original. A `poster` attribute is fetched raw — it cannot
          // go through next/image — so this was pulling the full 2400x1792 source over the wire
          // mid-scroll, on top of the 3.5MB video. It is visible for a fraction of a second
          // behind two gradient scrims before the video takes over.
          poster="/moon-walk/moon-walk-poster.jpg"
          // PERF: 1080p re-encode (3.6MB vs the 29MB 4K original) — same look as a cover
          // background, 8x less bandwidth and far less per-frame GPU scaling.
          src="/moon-walk/moon-walk-1080.mp4"
          onLoadedData={() => setVideoReady(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
          style={{ objectPosition: "center center", opacity: videoReady ? 1 : 0, transform: "scale(1.01)" }}
        />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,12,26,0.40)_0%,rgba(4,12,26,0.25)_50%,rgba(4,12,26,0.50)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(196,216,232,0.14),transparent_30%),linear-gradient(90deg,rgba(4,12,26,0.54)_0%,rgba(4,12,26,0.18)_38%,rgba(4,12,26,0.16)_58%,rgba(4,12,26,0.48)_100%)]" />
    </div>
  );
}
