"use client";
import { memo, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { IconBrandGithub, IconBrandLinkedin, IconMail, IconBrain, IconCode } from '@tabler/icons-react';
import NeuralCanvas from '@/components/ui/NeuralCanvas';
import CrystalShards from '@/components/ui/CrystalShards';
import { useIntroGate } from '@/lib/intro';

const EASE = [0.16, 1, 0.3, 1] as const;
const FULL_NAME = 'ARNAV PRATAP';

// Hero entrance beats, in seconds from the loader's shockwave. Every delay here is relative
// to the handoff rather than to mount — mount happens behind the opaque loader, so timing
// from it meant the entire sequence played to nobody and the visitor only saw the aftermath.
const BEAT = {
  backdrop: 0,
  canvas: 0.15,
  title: 0.06,
  typingStart: 120, // ms
  typingSpeed: 42, // ms per character
  portrait: 0.18,
  subtitle: 0.62,
  actions: 0.95,
  socials: 1.1,
  chipOne: 1.25,
  chipTwo: 1.38,
  scrollHint: 1.7,
} as const;

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/Arnavpratap2004',
    icon: IconBrandGithub,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/arnavpratap2004/',
    icon: IconBrandLinkedin,
  },
  {
    label: 'Email',
    href: 'mailto:arnavpratap2003@gmail.com',
    icon: IconMail,
  },
];

/**
 * The typed name, isolated in its own component on purpose.
 *
 * Typing ticks state once per character. Left inside Hero that re-rendered the entire
 * hero tree ~12 times during the exact window the loader is running its fade-out, and
 * the contention measurably delayed that transition (the overlay was still at opacity
 * 0.94 nearly 300ms after the fade should have started). Scoping the state here keeps
 * each tick to one small subtree.
 */
const TypedName = memo(function TypedName({
  start,
  reduceMotion,
}: {
  start: boolean;
  reduceMotion: boolean;
}) {
  const [typedText, setTypedText] = useState('');
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Reduced motion skips the typing entirely; the full name is derived during render
    // below rather than pushed through state, so this effect has nothing to do.
    if (!start || reduceMotion) return;

    timeoutRef.current = window.setTimeout(() => {
      let index = 1;
      setTypedText(FULL_NAME.slice(0, index));

      intervalRef.current = window.setInterval(() => {
        index += 1;
        setTypedText(FULL_NAME.slice(0, index));

        if (index >= FULL_NAME.length && intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, BEAT.typingSpeed);
    }, BEAT.typingStart);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [start, reduceMotion]);

  const shown = reduceMotion && start ? FULL_NAME : typedText;
  const [firstName, lastName] = shown.split(' ');

  return (
    <span className="col-start-1 row-start-1 whitespace-nowrap">
      <span className="text-gradient-display">{firstName}</span>
      {shown.length > FULL_NAME.indexOf(' ') && <br />}
      {lastName !== undefined && <span className="text-gradient-display">{lastName}</span>}
      <span
        className="text-gradient-cursor cursor-blink inline-block"
        style={{ marginLeft: '4px', fontWeight: 300 }}
      >
        |
      </span>
    </span>
  );
});

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  // Use global scrollY because Hero is sticky and doesn't move relative to the viewport
  const { scrollY } = useScroll();

  // Cinematic 3D Depth-of-field effects
  // Adjusted parallax for elements inside the Hero (now subtle since they are fixed)
  const backgroundY = useTransform(scrollY, [0, 1000], shouldReduceMotion ? [0, 0] : [0, 100]);
  const crystalY = useTransform(scrollY, [0, 1000], shouldReduceMotion ? [0, 0] : [0, 50]);
  const typographyY = useTransform(scrollY, [0, 1000], shouldReduceMotion ? [0, 0] : [0, -50]);
  // Portrait drifts slower than the type for depth separation
  const portraitY = useTransform(scrollY, [0, 1000], shouldReduceMotion ? [0, 0] : [0, -28]);

  // Gates every entrance beat on the loader's shockwave.
  const introStarted = useIntroGate();

  const subtitleContainer = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: BEAT.subtitle,
        staggerChildren: 0.1,
      },
    },
  };

  const subtitleLine = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: EASE },
    },
  };

  return (
    <m.section
      ref={containerRef}
      className="relative w-full min-h-[100dvh] overflow-hidden"
      style={{
        background: '#06090F'
      }}
    >
      {/* Smartly integrated background image */}
      <m.div
        className="absolute top-0 left-0 right-0 h-[calc(100%+100px)] pointer-events-none"
        style={{
          backgroundImage: 'image-set(url("/bg-image.avif") type("image/avif"), url("/bg-image.webp") type("image/webp"), url("/bg-image.png") type("image/png"))', // PERF: Serve the same hero art through modern formats while keeping the PNG fallback.
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.85,
          // PERF: mix-blend-mode:screen removed — over the near-black #06090F backdrop, screen
          // blending is visually a no-op, but it forced backdrop compositing every scroll frame
          // (measured ~7fps of scroll cost on integrated GPUs).
          y: backgroundY,
          zIndex: 0,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: introStarted ? 0.85 : 0 }}
        transition={{ duration: 0.9, delay: BEAT.backdrop, ease: 'easeOut' }}
      />

      {/* The loader's synaptic web dies in the implosion; this one is born out of the blast. */}
      <m.div
        className="absolute top-0 left-0 right-0 h-[calc(100%+100px)]"
        style={{ y: backgroundY, zIndex: 1, willChange: 'transform' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: introStarted ? 1 : 0 }}
        transition={{ duration: 0.7, delay: BEAT.canvas, ease: 'easeOut' }}
      >
        <NeuralCanvas />
      </m.div>

      {/* Afterglow: picks up the supernova's light exactly where the overlay drops it, so the
          blast appears to wash across the hero rather than cross-fading into an unrelated page.
          Compositor-only (opacity + scale) and unmounted the moment it finishes. */}
      {introStarted && !shouldReduceMotion && (
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2"
          style={{
            zIndex: 2,
            background:
              'radial-gradient(circle, rgba(232,244,255,0.30) 0%, rgba(155,112,255,0.20) 22%, rgba(107,72,255,0.08) 45%, transparent 68%)',
            willChange: 'transform, opacity',
          }}
          initial={{ opacity: 0.85, scale: 0.35 }}
          animate={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      <CrystalShards y={crystalY} />

      {/* Melt the hero backdrop into the next section. The neural canvas and bg image end at the
          section edge, which otherwise reads as a hard horizontal seam. Phone/tablet only: at lg+
          the hero is exactly 100dvh, so the boundary sits at the viewport edge and never shows. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 md:h-40 lg:hidden"
        style={{
          zIndex: 3,
          background: 'linear-gradient(to top, #06090F 0%, rgba(6,9,15,0.85) 35%, transparent 100%)',
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-[100dvh] w-full max-w-7xl grid-cols-1 items-center gap-x-10 px-6 pt-20 pb-8 md:px-12 md:pt-28 md:pb-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:px-16 lg:pt-0 lg:pb-0">
        {/* ---- Left column: identity + actions ---- */}
        <m.div
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
          style={{ y: typographyY, willChange: 'transform' }}
        >
          <m.h1
            className="font-geist font-extrabold leading-[0.95] tracking-normal grid w-full"
            style={{
              // The 44px floor keeps "PRATAP" + cursor inside a 360px content box; above ~520px
              // wide the vw term takes over, so desktop sizing is unchanged.
              fontSize: 'clamp(44px, 8.5vw, 104px)',
              letterSpacing: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: introStarted ? 1 : 0 }}
            transition={{ delay: BEAT.title, duration: 0.08, ease: 'linear' }}
          >
            {/* PERF: Reserve the final typed-title footprint so the portrait and hero layout do not shift while letters appear.
                The name renders as a fixed two-line lockup (first/last name) so the cursor never wraps alone. */}
            <span
              aria-hidden="true"
              className="col-start-1 row-start-1 invisible whitespace-nowrap"
            >
              <span className="text-gradient-display">{FULL_NAME.split(' ')[0]}</span>
              <br />
              <span className="text-gradient-display">{FULL_NAME.split(' ')[1]}</span>
              <span
                className="text-gradient-cursor inline-block"
                style={{ marginLeft: '4px', fontWeight: 300 }}
              >
                |
              </span>
            </span>
            <TypedName start={introStarted} reduceMotion={Boolean(shouldReduceMotion)} />
          </m.h1>

          <m.div
            className="flex flex-col items-center lg:items-start"
            initial="hidden"
            animate={introStarted ? 'visible' : 'hidden'}
            variants={subtitleContainer}
          >
            <m.p
              className="mt-4 md:mt-6 text-balance text-[#FAFAFA] font-inter font-medium"
              // PERF: no permanent will-change on the entrance-only elements. These animate
              // once at the intro and never again, but a pinned will-change holds a compositor
              // layer for the whole session — and creating them all at once during the reveal
              // cost 43-48ms of Layerize per frame, which was the shatter's real frame budget
              // problem (the canvas itself traced at a fraction of that). Framer applies
              // will-change for the duration of its own animations and clears it afterwards.
              style={{
                fontSize: 'clamp(16px, 2.2vw, 24px)',
                letterSpacing: '0.03em',
                lineHeight: 1.4,
              }}
              variants={subtitleLine}
            >
              Full-Stack & AI Engineer building
              <br className="hidden sm:block" />
              {' '}research-grade ML systems
            </m.p>

            {/* Status Pill */}
            <m.div
              className="mt-4 md:mt-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-300/15 bg-emerald-400/8 px-4 py-1.5"
              variants={subtitleLine}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
              </span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-300 tracking-wide">
                Open to Full-Time Roles · 2027
              </span>
            </m.div>

            {/* Credential line */}
            <m.p
              // Tighter type + tracking on mobile keeps the whole credential on one line; wrapped
              // it split mid-phrase and cost the portrait ~20px of height.
              className="mt-3 md:mt-4 text-balance font-inter text-[11.5px] tracking-[0.04em] text-white/55 sm:text-[13px] sm:tracking-[0.10em] sm:text-white/50"
              style={{ lineHeight: 1.5 }}
              variants={subtitleLine}
            >
              2× IIT Patna Research Intern · VIT CSE · 9.00 CGPA
            </m.p>
          </m.div>

          <m.div
            // Paired side by side on mobile (flex-1 keeps them exactly equal) rather than stacked:
            // reads as one deliberate control pair and returns ~60px of height to the portrait.
            className="mt-7 md:mt-9 flex w-full max-w-[340px] flex-row items-center gap-3 sm:max-w-none sm:gap-6"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={introStarted ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            transition={{ delay: BEAT.actions, duration: 0.4, ease: EASE }}
          >
            <a
              href="#projects"
              data-cursor="hover"
              className="group relative inline-flex flex-1 sm:flex-none items-center justify-center whitespace-nowrap px-4 sm:px-8 py-3.5 rounded-full text-[#FAFAFA] text-[13px] sm:text-sm font-inter font-medium tracking-[0.04em] sm:tracking-[0.06em] backdrop-glass transition-all duration-300 hover:-translate-y-[3px]"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.4)';
                event.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                event.currentTarget.style.boxShadow = 'none';
              }}
            >
              Explore My Work
            </a>

            <a
              href="#contact"
              data-cursor="hover"
              className="inline-flex flex-1 sm:flex-none items-center justify-center whitespace-nowrap px-4 sm:px-8 py-3.5 rounded-full text-[#FAFAFA] text-[13px] sm:text-sm font-inter font-medium tracking-[0.04em] sm:tracking-[0.06em] transition-all duration-300 hover:-translate-y-[3px]"
              style={{
                background: 'linear-gradient(135deg, #6B48FF 0%, #9B70FF 100%)',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.filter = 'saturate(1.3)';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.filter = 'saturate(1)';
              }}
            >
              Get In Touch
            </a>
          </m.div>

          {/* Social links — glass orbs with a rotating gradient ring on hover */}
          <m.div
            className="mt-6 md:mt-9 flex items-center gap-4"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            animate={introStarted ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            transition={{ delay: BEAT.socials, duration: 0.4, ease: EASE }}
          >
            <span
              aria-hidden="true"
              className="hidden sm:block h-px w-12 bg-gradient-to-r from-transparent to-white/25"
            />
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                data-cursor="hover"
                {...(href.startsWith('mailto:')
                  ? {}
                  : { target: '_blank', rel: 'noopener noreferrer' })}
                className="group relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(107,72,255,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <span
                  aria-hidden="true"
                  className="social-ring absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-[2px] rounded-full border border-white/15 bg-white/[0.05] backdrop-glass transition-colors duration-300 group-hover:border-transparent group-hover:bg-[#0A0E17]/90"
                />
                <Icon
                  size={20}
                  strokeWidth={1.6}
                  className="relative z-10 text-white/70 transition-colors duration-300 group-hover:text-white"
                />
                <span className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#0A0E17]/90 px-2 py-0.5 text-[10px] tracking-[0.12em] text-white/70 opacity-0 transition-all duration-300 group-hover:mt-3 group-hover:opacity-100">
                  {label}
                </span>
              </a>
            ))}
          </m.div>
        </m.div>

        {/* ---- Right column: portrait composition ---- */}
        <m.div
          className="relative mt-8 flex justify-center md:mt-14 lg:mt-0 lg:justify-end"
          style={{ y: portraitY, willChange: 'transform' }}
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 36, scale: shouldReduceMotion ? 1 : 0.94 }}
          animate={
            introStarted
              ? { opacity: 1, x: 0, scale: 1 }
              : { opacity: 0, x: shouldReduceMotion ? 0 : 36, scale: shouldReduceMotion ? 1 : 0.94 }
          }
          transition={{ delay: BEAT.portrait, duration: 0.9, ease: EASE }}
        >
          <div className="hero-portrait-frame relative w-[280px] sm:w-[330px] lg:w-[400px] xl:w-[440px]">
            {/* Ambient glow bed behind the portrait */}
            <div
              aria-hidden="true"
              className="absolute -inset-x-20 -top-6 -bottom-12 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 52% 44% at 50% 52%, rgba(107,72,255,0.30) 0%, rgba(56,89,248,0.14) 46%, transparent 72%)',
              }}
            />

            {/* Slow orbital ring with two riding sparks.
                Outer div owns the centering translate; inner div owns the rotation
                so the animation's transform doesn't clobber the positioning. */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ width: '118%', aspectRatio: '1 / 1' }}
            >
              <div className="hero-orbit absolute inset-0 rounded-full border border-dashed border-white/10">
                <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9B70FF] shadow-[0_0_12px_rgba(155,112,255,0.9)]" />
                <span className="absolute right-0 top-1/2 h-1.5 w-1.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8F4FF] shadow-[0_0_10px_rgba(232,244,255,0.8)]" />
              </div>
            </div>

            {/* Portrait, melting into the background at the bottom */}
            <div className="hero-portrait-fade relative z-[1]">
              <Image
                src="/hero-portrait-arnav.png"
                alt="Portrait of Arnav Pratap"
                width={1016}
                height={1292}
                priority
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 330px, 440px"
                className="h-auto w-full select-none"
                draggable={false}
              />
            </div>

            {/* Floating glass credential chips */}
            <m.div
              // Stacked layouts sit the chips low, beside the shoulders — the face spans roughly
              // 15–52% of this wrapper, and at the desktop 24% offset the chip lands on his glasses
              // once the portrait narrows. The lg offsets restore the original side-by-side framing.
              className="absolute -left-3 top-[57%] z-[2] sm:-left-12 lg:top-[24%]"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              animate={introStarted ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              transition={{ delay: BEAT.chipOne, duration: 0.5, ease: EASE }}
            >
              <div className="hero-chip-float flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/12 bg-[#0A0E17]/70 backdrop-glass px-2.5 py-1.5 sm:px-3.5 sm:py-2 shadow-[0_8px_24px_rgba(5,8,18,0.5)]">
                <IconBrain size={16} strokeWidth={1.8} className="text-[#B78FFF]" />
                <span className="text-[10.5px] sm:text-xs font-medium text-white/85 whitespace-nowrap">AI/ML Research</span>
              </div>
            </m.div>

            <m.div
              className="absolute -right-2 top-[75%] z-[2] sm:-right-8 lg:top-[55%]"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              animate={introStarted ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              transition={{ delay: BEAT.chipTwo, duration: 0.5, ease: EASE }}
            >
              <div className="hero-chip-float-delayed flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/12 bg-[#0A0E17]/70 backdrop-glass px-2.5 py-1.5 sm:px-3.5 sm:py-2 shadow-[0_8px_24px_rgba(5,8,18,0.5)]">
                <IconCode size={16} strokeWidth={1.8} className="text-[#7DD3FC]" />
                <span className="text-[10.5px] sm:text-xs font-medium text-white/85 whitespace-nowrap">Full-Stack Systems</span>
              </div>
            </m.div>
          </div>
        </m.div>
      </div>

      {/* Scroll hint */}
      <m.div
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: introStarted ? 1 : 0 }}
        transition={{ delay: BEAT.scrollHint, duration: 0.8, ease: EASE }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/35">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent" />
          <span className="hero-scroll-dot absolute left-0 top-0 h-2 w-px bg-white/80" />
        </span>
      </m.div>
    </m.section>
  );
}
