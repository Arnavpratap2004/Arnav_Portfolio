"use client";

import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { ContactForm } from "./ContactForm";
import { ContactInfoPanel } from "./ContactInfoPanel";
import { MoonWalkMedia } from "./MoonWalkMedia";

// PERF: Module-level variants — created once, never re-allocated on render.
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const badgeVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

const headingVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.08, ease: EASE_OUT } },
};

const accentLineVariants = {
  // PERF: Replaced `width` animation (forces Layout + Paint) with `scaleX` (GPU-composited).
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 0.6, delay: 0.3, ease: EASE_OUT } },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.58, delay: 0.38, ease: EASE_OUT } },
};

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.15, once: true });

  const animState = isInView ? "visible" : "hidden";

  return (
    <section ref={sectionRef} className="relative isolate min-h-[calc(100svh-56px)] overflow-hidden bg-[#040c1a] lg:h-[calc(100svh-56px)]">
      <MoonWalkMedia isInView={isInView} />

      {/* Projects ends on #06090F and this section starts on #040c1a, so the boundary reads as a
          hard horizontal line — most obvious on mobile, where the stacked cards run right into it.
          Fading in from the previous section's colour blends the two. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 md:h-32 bg-gradient-to-b from-[#06090F] to-transparent"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-56px)] max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 md:px-8 lg:h-[calc(100svh-56px)] lg:min-h-0 lg:py-9 xl:py-10">
        <div className="mb-6 max-w-3xl md:mb-7 xl:mb-8">
          <m.div
            variants={badgeVariants}
            initial="hidden"
            animate={animState}
            className="portal-badge"
          >
            <span className="portal-dot" />
            PORTAL OPEN
          </m.div>

          <m.h2
            variants={headingVariants}
            initial="hidden"
            animate={animState}
            className="section-heading"
          >
            Get in{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #22D3EE 0%, #5EEAD4 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Touch
            </span>
          </m.h2>

          <m.div
            layout={false}
            variants={accentLineVariants}
            initial="hidden"
            animate={animState}
            className="heading-accent-line"
            style={{ width: 48, transformOrigin: "left" }}
          />

          <m.p
            variants={subtitleVariants}
            initial="hidden"
            animate={animState}
            className="section-subtitle"
          >
            Have a project in mind, or just want to connect?
          </m.p>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 md:gap-6 lg:grid-cols-[2fr_3fr] xl:gap-7">
          <ContactInfoPanel isInView={isInView} />
          <ContactForm isInView={isInView} />
        </div>
      </div>

      <style jsx global>{".portal-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(72,184,216,0.10);border:1px solid rgba(72,184,216,0.30);border-radius:999px;padding:5px 12px;font-size:10px;font-weight:600;letter-spacing:0.12em;color:#48b8d8;text-transform:uppercase;margin-bottom:13px}.portal-dot{width:6px;height:6px;border-radius:50%;background:#48b8d8;box-shadow:0 0 8px rgba(72,184,216,0.80);animation:portal-pulse 2.2s ease-in-out infinite}.section-heading{font-size:clamp(2.45rem,5.35vw,4.15rem);font-weight:800;color:#dce8f2;letter-spacing:-0.02em;line-height:1.02;margin:0 0 9px;text-shadow:0 0 60px rgba(100,180,230,0.20)}.heading-accent-line{height:2.5px;background:linear-gradient(90deg,#48b8d8,rgba(72,184,216,0));border-radius:2px;margin-bottom:11px}.section-subtitle{font-size:0.98rem;color:#7a90a8;margin:0;font-weight:400}@keyframes portal-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.75)}}@keyframes card-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}@keyframes breathe{0%,100%{opacity:1}50%{opacity:.55}}@keyframes ring-expand{0%{transform:scale(1);opacity:.7}100%{transform:scale(3);opacity:0}}@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.glass-card{background:rgba(8,18,45,.88)!important}}@media (max-height:820px) and (min-width:1024px){.section-heading{font-size:clamp(2.3rem,4.8vw,3.75rem)}.portal-badge{margin-bottom:10px}.section-subtitle{font-size:.92rem}.heading-accent-line{margin-bottom:9px}}@media (prefers-reduced-motion:reduce){.info-card,.form-card,.status-dot,.status-ring,.portal-dot{animation:none!important}}/* Phones crop the backdrop to its bright central portal, so the 55% glass fill left the muted body copy at 2.6:1 against it — under the 4.5:1 AA floor, and drifting as the portal brightness varies across the card. A denser fill holds legibility; desktop keeps the lighter glass. The float is also stilled here: stacked vertically, two cards breathing in opposite phase visibly pumps the gap between them. */@media (max-width:767px){.glass-card{background:rgba(8,18,45,0.90)!important}.info-card,.form-card{animation:none!important}}"}</style>
    </section>
  );
}
