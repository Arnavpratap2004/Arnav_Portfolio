"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  icon: string | React.ReactNode;
  className?: string;
  experience?: string;
  projects?: number;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
  icon: React.ReactNode;
  /** Hex accent color driving every colored detail of the card (border, glow, meter). */
  accent?: string;
}

interface AnimatedSkillGridProps {
  categories: SkillCategory[];
  className?: string;
}

const SKILL_DATA: Record<string, { experience: string; projects: number; level: number }> = {
  "C++": { experience: "3 yrs", projects: 5, level: 82 },
  Python: { experience: "4 yrs", projects: 8, level: 92 },
  Java: { experience: "2 yrs", projects: 3, level: 72 },
  HTML5: { experience: "4 yrs", projects: 12, level: 90 },
  CSS3: { experience: "4 yrs", projects: 12, level: 86 },
  JavaScript: { experience: "4 yrs", projects: 12, level: 90 },
  TypeScript: { experience: "2 yrs", projects: 6, level: 84 },
  React: { experience: "3 yrs", projects: 10, level: 88 },
  "Next.js": { experience: "2 yrs", projects: 5, level: 85 },
  "Node.js": { experience: "3 yrs", projects: 7, level: 86 },
  Express: { experience: "3 yrs", projects: 6, level: 82 },
  Tailwind: { experience: "2 yrs", projects: 8, level: 88 },
  MongoDB: { experience: "2 yrs", projects: 4, level: 80 },
  MySQL: { experience: "2 yrs", projects: 4, level: 76 },
  PostgreSQL: { experience: "1 yr", projects: 2, level: 70 },
  AWS: { experience: "1 yr", projects: 3, level: 68 },
  Docker: { experience: "1 yr", projects: 2, level: 70 },
  Linux: { experience: "2 yrs", projects: 6, level: 78 },
  TensorFlow: { experience: "1 yr", projects: 2, level: 72 },
  PyTorch: { experience: "1 yr", projects: 2, level: 75 },
  Pandas: { experience: "2 yrs", projects: 6, level: 85 },
  NumPy: { experience: "2 yrs", projects: 6, level: 85 },
  Git: { experience: "4 yrs", projects: 15, level: 90 },
  GitHub: { experience: "4 yrs", projects: 15, level: 88 },
  Postman: { experience: "2 yrs", projects: 8, level: 80 },
  "VS Code": { experience: "4 yrs", projects: 20, level: 92 },
};

const DEFAULT_SKILL_DATA = { experience: "1+ yr", projects: 2, level: 65 };
const DEFAULT_ACCENT = "#A78BFA";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export const AnimatedSkillGrid = memo(function AnimatedSkillGrid({ categories, className }: AnimatedSkillGridProps) {
  return (
    <m.div
      layout={false}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      // PERF: Positive bottom margin starts the reveal ~250px before the grid is visible, so the
      // expensive animation-start frame (layer creation + first raster) lands off-screen instead
      // of as a visible hitch (measured 270–600ms) the moment the section scrolls in.
      viewport={{ once: true, amount: 0.05, margin: "0px 0px 250px 0px" }}
      className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6", className)}
      style={{ willChange: "opacity" }}
    >
      {categories.map((category) => (
        <CategoryCard key={category.title} category={category} />
      ))}
    </m.div>
  );
});

const GLOW_SIZE = 260;

const CategoryCard = memo(function CategoryCard({ category }: { category: SkillCategory }) {
  const accent = category.accent ?? DEFAULT_ACCENT;
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // Cursor-tracking tilt + glow. All transform-only: the tilt is a composited
  // rotation and the glow is a pre-rastered radial moved with translate.
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 260, damping: 22 });
  const springRotateY = useSpring(rotateY, { stiffness: 260, damping: 22 });
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      glowX.set(event.clientX - rect.left - GLOW_SIZE / 2);
      glowY.set(event.clientY - rect.top - GLOW_SIZE / 2);
      if (!shouldReduceMotion) {
        rotateX.set((py - 0.5) * -6);
        rotateY.set((px - 0.5) * 6);
      }
    },
    [glowX, glowY, rotateX, rotateY, shouldReduceMotion]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <m.div
      ref={cardRef}
      layout={false}
      variants={cardVariants}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.015 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "skill-card group relative h-full p-6 rounded-[28px] border will-change-transform",
        // PERF: backdrop-blur removed — six blurred cards over the animating WebGL canvas re-filtered
        // the backdrop every frame. A slightly more opaque tint keeps the glass look for free.
        // Border/shadow hover tints come from .skill-card rules keyed off --accent; transform is
        // framer-driven, so no CSS transition on it (double-smoothing makes the tilt mushy).
        "bg-[#0b1220]/70 shadow-[0_24px_80px_rgba(0,0,0,0.32)] transition-[border-color,box-shadow] duration-500"
      )}
      style={{
        "--accent": accent,
        contain: "layout style",
        willChange: "transform, opacity",
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 900,
      } as React.CSSProperties}
    >
      {/* Clip layer for glows so tooltips can still overflow the card. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
        {/* Cursor-tracking glow */}
        <m.div
          className="absolute left-0 top-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            x: glowX,
            y: glowY,
            width: GLOW_SIZE,
            height: GLOW_SIZE,
            borderRadius: "50%",
            background: `radial-gradient(circle, color-mix(in srgb, ${accent} 14%, transparent) 0%, transparent 65%)`,
          }}
        />
        {/* Static corner ambience */}
        <div
          className="absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-60"
          style={{ background: `radial-gradient(circle, color-mix(in srgb, ${accent} 10%, transparent) 0%, transparent 70%)` }}
        />
      </div>

      <div className="accent-hairline absolute inset-x-0 top-0 h-px" />

      <div className="relative z-10 flex items-center gap-3 mb-6">
        <div
          className={cn(
            "p-2.5 rounded-xl transition-all duration-300 border",
            "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]",
            "group-hover:-translate-y-0.5 group-hover:scale-105"
          )}
          style={{
            background: `color-mix(in srgb, ${accent} 12%, rgba(255,255,255,0.04))`,
            borderColor: `color-mix(in srgb, ${accent} 25%, transparent)`,
          }}
        >
          {category.icon}
        </div>
        <div>
          <h3
            className={cn(
              "text-xl font-medium tracking-wide transition-all duration-300",
              "text-white",
              "group-hover:text-white group-hover:-translate-y-px"
            )}
          >
            {category.title}
          </h3>
        </div>

        <div className="ml-auto relative flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <span
            className="relative px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 border shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
            style={{
              background: `color-mix(in srgb, ${accent} 10%, rgba(255,255,255,0.03))`,
              borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`,
              color: `color-mix(in srgb, ${accent} 55%, white)`,
            }}
          >
            {category.skills.length}
          </span>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
        {category.skills.map((skill) => (
          <SkillItem key={skill.name} skill={skill} />
        ))}
      </div>
    </m.div>
  );
});

const SkillItem = memo(function SkillItem({ skill }: { skill: Skill }) {
  const [isClicked, setIsClicked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
  const itemRef = useRef<HTMLDivElement>(null);
  const rippleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const data = SKILL_DATA[skill.name] || DEFAULT_SKILL_DATA;

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    setRipplePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
    setIsClicked(true);
    setShowTooltip((prev) => !prev);

    if (rippleTimeoutRef.current) clearTimeout(rippleTimeoutRef.current);
    rippleTimeoutRef.current = setTimeout(() => setIsClicked(false), 600);
  }, []);

  useEffect(() => {
    return () => {
      if (rippleTimeoutRef.current) clearTimeout(rippleTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={itemRef}
      className={cn(
        "group/skill relative flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-300 will-change-transform",
        "hover:bg-neutral-800/80",
        showTooltip && "bg-white/[0.05] shadow-[inset_0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/30 scale-105"
      )}
      style={{ contain: "layout style", willChange: "transform, opacity" }}
      onMouseLeave={() => {
        if (showTooltip) setShowTooltip(false);
      }}
      onClick={handleClick}
    >
      {isClicked && (
        <div
          className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
          style={{ left: ripplePosition.x - 50, top: ripplePosition.y - 50, width: 100, height: 100 }}
        />
      )}

      <div
        className={cn(
          "relative w-10 h-10 flex items-center justify-center transition-transform duration-300 will-change-transform",
          "group-hover/skill:-translate-y-1 group-hover/skill:scale-[1.08]",
          showTooltip && "-translate-y-1 scale-[1.08]"
        )}
      >
        {typeof skill.icon === "string" ? (
          <Image
            src={skill.icon}
            alt={skill.name}
            fill
            loading="lazy"
            sizes="40px"
            className={cn(
              "object-contain transition-[filter] duration-300 group-hover/skill:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]",
              skill.className,
              showTooltip && "drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            )}
          />
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center transition-[filter] duration-300 group-hover/skill:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover/skill:brightness-125",
              skill.className,
              showTooltip && "drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] filter brightness-125"
            )}
          >
            {skill.icon}
          </div>
        )}
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-xl transition-opacity duration-300 opacity-0 group-hover/skill:opacity-60",
            showTooltip && "opacity-60"
          )}
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
        />
      </div>

      <span className={cn("text-xs text-neutral-400 text-center transition-all duration-300 group-hover/skill:text-white group-hover/skill:font-medium group-hover/skill:-translate-y-0.5 group-hover/skill:drop-shadow-md", showTooltip && "text-white font-medium -translate-y-0.5 drop-shadow-md")}>
        {skill.name}
      </span>

      <div
        className={cn(
          "absolute bottom-2 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-[width,opacity] duration-300 group-hover/skill:w-8 group-hover/skill:opacity-100",
          showTooltip ? "w-8 opacity-100" : "w-0 opacity-0"
        )}
        style={{
          background: "linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 40%, white))",
          boxShadow: "0 0 8px color-mix(in srgb, var(--accent) 80%, transparent)",
        }}
      />

      <div
        className={cn(
          "absolute -top-32 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out",
          "px-5 py-3 rounded-2xl border border-white/20 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(168,85,247,0.3)]",
          "bg-[#0A1428]/90",
          showTooltip ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90 pointer-events-none"
        )}
      >
        <div
          className="absolute top-0 left-4 right-4 h-px opacity-60"
          style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
        />

        <div className="text-center whitespace-nowrap relative z-10 flex flex-col items-center">
          <div className="text-white font-extrabold text-base tracking-wide drop-shadow-md mb-2">{skill.name}</div>
          <div className="flex items-center justify-center gap-3 text-xs">
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
              style={{
                background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                borderColor: "color-mix(in srgb, var(--accent) 40%, transparent)",
                color: "color-mix(in srgb, var(--accent) 55%, white)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
              {data.experience}
            </span>
            <span className="text-neutral-300 font-medium">{data.projects} projects</span>
          </div>

          {/* Proficiency meter — fills when the tooltip opens */}
          <div className="mt-2.5 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{
                width: showTooltip ? `${data.level}%` : "0%",
                background: "linear-gradient(90deg, color-mix(in srgb, var(--accent) 60%, transparent), var(--accent))",
                boxShadow: "0 0 8px color-mix(in srgb, var(--accent) 60%, transparent)",
              }}
            />
          </div>
          <div className="mt-1 flex w-40 items-center justify-between text-[10px]">
            <span className="uppercase tracking-[0.14em] text-neutral-400">Proficiency</span>
            <span className="font-semibold text-white/85">{data.level}%</span>
          </div>
        </div>

        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 border-b border-r border-white/20 bg-[#0A1428]" />
      </div>
    </div>
  );
});

// PERF: Ripple keyframes moved to globals.css — no more per-render style injection.
