"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { IconBrandGithub, IconBrandLinkedin, IconMail, IconBrain, IconCode } from '@tabler/icons-react';
import NeuralCanvas from '@/components/ui/NeuralCanvas';
import CrystalShards from '@/components/ui/CrystalShards';

const EASE = [0.16, 1, 0.3, 1] as const;
const FULL_NAME = 'ARNAV PRATAP';

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

  const [typedText, setTypedText] = useState('');
  const typingIntervalRef = useRef<number | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    typingTimeoutRef.current = window.setTimeout(() => {
      if (shouldReduceMotion) {
        setTypedText(FULL_NAME);
        return;
      }

      let index = 1;
      setTypedText(FULL_NAME.slice(0, index));

      typingIntervalRef.current = window.setInterval(() => {
        index += 1;
        setTypedText(FULL_NAME.slice(0, index));

        if (index >= FULL_NAME.length && typingIntervalRef.current !== null) {
          window.clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
      }, 35);
    }, 500);

    return () => {
      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (typingIntervalRef.current !== null) {
        window.clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, [shouldReduceMotion]);

  const subtitleContainer = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.9,
        staggerChildren: 0.12,
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
        animate={{ opacity: 0.85 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      <m.div
        className="absolute top-0 left-0 right-0 h-[calc(100%+100px)]"
        style={{ y: backgroundY, zIndex: 1, willChange: 'transform' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: 'linear' }}
      >
        <NeuralCanvas />
      </m.div>

      <CrystalShards y={crystalY} />

      <div className="relative z-10 mx-auto grid min-h-[100dvh] w-full max-w-7xl grid-cols-1 items-center gap-x-10 px-6 pt-28 pb-10 md:px-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:px-16 lg:pt-0 lg:pb-0">
        {/* ---- Left column: identity + actions ---- */}
        <m.div
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
          style={{ y: typographyY, willChange: 'transform' }}
        >
          <m.h1
            className="font-geist font-extrabold leading-[0.95] tracking-normal grid w-full"
            style={{
              fontSize: 'clamp(48px, 8.5vw, 104px)',
              letterSpacing: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.08, ease: 'linear' }}
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
            <span className="col-start-1 row-start-1 whitespace-nowrap">
              <span className="text-gradient-display">{typedText.split(' ')[0]}</span>
              {typedText.length > FULL_NAME.indexOf(' ') && <br />}
              {typedText.split(' ')[1] !== undefined && (
                <span className="text-gradient-display">{typedText.split(' ')[1]}</span>
              )}
              <span
                className="text-gradient-cursor cursor-blink inline-block"
                style={{ marginLeft: '4px', fontWeight: 300 }}
              >
                |
              </span>
            </span>
          </m.h1>

          <m.div
            className="flex flex-col items-center lg:items-start"
            initial="hidden"
            animate="visible"
            variants={subtitleContainer}
          >
            <m.p
              className="mt-4 md:mt-6 text-[#FAFAFA] font-inter font-medium"
              style={{
                fontSize: 'clamp(16px, 2.2vw, 24px)',
                letterSpacing: '0.03em',
                lineHeight: 1.4,
                willChange: 'transform, opacity',
              }}
              variants={subtitleLine}
            >
              Full-Stack & AI Engineer building
              <br className="hidden sm:block" />
              {' '}research-grade ML systems
            </m.p>

            {/* Status Pill */}
            <m.div
              className="mt-5 md:mt-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-300/15 bg-emerald-400/8 px-4 py-1.5"
              style={{ willChange: 'transform, opacity' }}
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
              className="mt-4 text-white/50 font-inter"
              style={{
                fontSize: '13px',
                letterSpacing: '0.10em',
                lineHeight: 1.5,
                willChange: 'transform, opacity',
              }}
              variants={subtitleLine}
            >
              2× IIT Patna Research Intern · VIT CSE · 9.00 CGPA
            </m.p>
          </m.div>

          <m.div
            className="mt-8 md:mt-9 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.4, ease: EASE }}
            style={{ willChange: 'transform, opacity' }}
          >
            <a
              href="#projects"
              data-cursor="hover"
              className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-full text-[#FAFAFA] text-sm font-inter font-medium tracking-[0.06em] backdrop-glass transition-all duration-300 hover:-translate-y-[3px]"
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
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-[#FAFAFA] text-sm font-inter font-medium tracking-[0.06em] transition-all duration-300 hover:-translate-y-[3px]"
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
            className="mt-9 flex items-center gap-4"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.4, ease: EASE }}
            style={{ willChange: 'transform, opacity' }}
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
          className="relative mt-14 flex justify-center lg:mt-0 lg:justify-end"
          style={{ y: portraitY, willChange: 'transform' }}
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.9, ease: EASE }}
        >
          <div className="relative w-[270px] sm:w-[330px] lg:w-[400px] xl:w-[440px]">
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
                sizes="(max-width: 640px) 270px, (max-width: 1024px) 330px, 440px"
                className="h-auto w-full select-none"
                draggable={false}
              />
            </div>

            {/* Floating glass credential chips */}
            <m.div
              className="absolute -left-6 top-[24%] z-[2] hidden lg:block sm:-left-12"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5, ease: EASE }}
            >
              <div className="hero-chip-float flex items-center gap-2 rounded-full border border-white/12 bg-[#0A0E17]/70 backdrop-glass px-3.5 py-2 shadow-[0_8px_24px_rgba(5,8,18,0.5)]">
                <IconBrain size={16} strokeWidth={1.8} className="text-[#B78FFF]" />
                <span className="text-xs font-medium text-white/85 whitespace-nowrap">AI/ML Research</span>
              </div>
            </m.div>

            <m.div
              className="absolute -right-3 top-[55%] z-[2] hidden lg:block sm:-right-8"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.5, ease: EASE }}
            >
              <div className="hero-chip-float-delayed flex items-center gap-2 rounded-full border border-white/12 bg-[#0A0E17]/70 backdrop-glass px-3.5 py-2 shadow-[0_8px_24px_rgba(5,8,18,0.5)]">
                <IconCode size={16} strokeWidth={1.8} className="text-[#7DD3FC]" />
                <span className="text-xs font-medium text-white/85 whitespace-nowrap">Full-Stack Systems</span>
              </div>
            </m.div>
          </div>
        </m.div>
      </div>

      {/* Scroll hint */}
      <m.div
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8, ease: EASE }}
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
