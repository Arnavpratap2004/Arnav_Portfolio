"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PortfolioLoader.module.css";

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// PERF: Tightened intro — the loader is decorative, so it should never hold the page hostage.
// Outro = implosion (420ms) → supernova shockwave while the overlay fades.
const IMPLODE_MS = 420;
const OUTRO_DELAY_MS = IMPLODE_MS + 60;
const FADE_DURATION_MS = 560;
const REDUCED_OUTRO_DELAY_MS = 120;
const REDUCED_FADE_DURATION_MS = 160;

// Brand ramp — the same gradient the hero name and section accents use.
const COLORS = [
  { solid: "#6B48FF", trail: "rgba(107, 72, 255, 0.30)", fill: "rgba(107, 72, 255, 0.85)" },
  { solid: "#9B70FF", trail: "rgba(155, 112, 255, 0.28)", fill: "rgba(155, 112, 255, 0.82)" },
  { solid: "#D896FF", trail: "rgba(216, 150, 255, 0.26)", fill: "rgba(216, 150, 255, 0.80)" },
  { solid: "#E8F4FF", trail: "rgba(232, 244, 255, 0.22)", fill: "rgba(232, 244, 255, 0.78)" },
] as const;

type LoaderPhase = "loading" | "outro" | "fading";

type NeuralNode = {
  baseX: number;
  baseY: number;
  ring: number;
  appearAt: number;
  size: number;
  colorIndex: number;
  wobbleSeed: number;
  x: number;
  y: number;
  alpha: number;
};

type NeuralEdge = { a: number; b: number };

type Spark = {
  edge: number;
  t: number;
  speed: number;
  dir: 1 | -1;
};

type BurstParticle = {
  angle: number;
  distance: number;
  speed: number;
  size: number;
  life: number;
  decay: number;
  colorIndex: number;
  x: number;
  y: number;
};

export function PortfolioLoader() {
  const [phase, setPhase] = useState<LoaderPhase>("loading");
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const restoredBodyRef = useRef(false);
  const progressRef = useRef(0);
  const phaseRef = useRef<LoaderPhase>("loading");

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const updateProgressDisplay = (value: number) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    progressRef.current = clampedValue;

    if (textRef.current) {
      textRef.current.textContent = `${Math.floor(clampedValue)}%`;
    }

    if (ringRef.current) {
      ringRef.current.style.strokeDashoffset = `${CIRCUMFERENCE - (clampedValue / 100) * CIRCUMFERENCE}`;
    }
  };

  useEffect(() => {
    restoredBodyRef.current = false;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let currentProgress = 0;
    let cancelled = false;

    setPrefersReducedMotion(reducedMotion);
    body.classList.add("portfolio-loader-active");
    body.style.overflow = "hidden";

    const restoreBody = () => {
      if (restoredBodyRef.current) return;
      restoredBodyRef.current = true;
      body.classList.remove("portfolio-loader-active");
      body.style.overflow = previousOverflow;
    };

    const queueTimer = (callback: () => void, delay: number) => {
      const timer = setTimeout(callback, delay);
      timersRef.current.push(timer);
      return timer;
    };

    const triggerOutroAnimation = () => {
      updateProgressDisplay(100);
      setPhase("outro");
      phaseRef.current = "outro";

      const outroDelay = reducedMotion ? REDUCED_OUTRO_DELAY_MS : OUTRO_DELAY_MS;
      const fadeDuration = reducedMotion ? REDUCED_FADE_DURATION_MS : FADE_DURATION_MS;

      queueTimer(() => {
        if (cancelled) return;
        setPhase("fading");
        phaseRef.current = "fading";
        restoreBody();
      }, outroDelay);

      queueTimer(() => {
        if (cancelled) return;
        setIsVisible(false);
      }, outroDelay + fadeDuration);
    };

    const simulateLoad = () => {
      if (cancelled) return;

      // PERF: Faster simulated progress (~0.8s to 100%) — the old ~2.2s ramp made every visit feel stuck.
      currentProgress += reducedMotion ? 100 : Math.random() * 3.5 + 3;

      if (currentProgress >= 100) {
        triggerOutroAnimation();
        return;
      }

      updateProgressDisplay(currentProgress);
      queueTimer(simulateLoad, Math.random() * 20 + 16);
    };

    queueTimer(simulateLoad, reducedMotion ? 80 : 120);

    return () => {
      cancelled = true;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      restoreBody();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId: number | null = null;
    let mounted = true;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastTime = performance.now();
    let implodeT = 0;
    let burstStarted = false;
    let burstAge = 0;
    let nodes: NeuralNode[] = [];
    let edges: NeuralEdge[] = [];
    let sparks: Spark[] = [];
    let burstParticles: BurstParticle[] = [];

    const resize = () => {
      const isMobile = window.innerWidth < 768;
      dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.25);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Build the synaptic web: concentric rings of nodes, wired to the previous
      // ring and their neighbors. Growth is gated by the loading progress.
      const ringCount = isMobile ? 4 : 5;
      const ringGap = isMobile ? 52 : 74;
      nodes = [];
      edges = [];
      const ringStart: number[] = [];

      for (let ring = 0; ring < ringCount; ring += 1) {
        ringStart.push(nodes.length);
        const count = 9 + ring * (isMobile ? 4 : 6);
        for (let i = 0; i < count; i += 1) {
          const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.34;
          const dist = 86 + ring * ringGap + (Math.random() - 0.5) * 30;
          nodes.push({
            baseX: Math.cos(angle) * dist,
            baseY: Math.sin(angle) * dist * 0.92,
            ring,
            appearAt: (ring / ringCount) * 68 + Math.random() * 14,
            size: 1.5 + Math.random() * (isMobile ? 1.6 : 2.2),
            colorIndex: (ring + i) % COLORS.length,
            wobbleSeed: Math.random() * Math.PI * 2,
            x: 0,
            y: 0,
            alpha: 0,
          });
        }
      }

      const angleOf = (n: NeuralNode) => Math.atan2(n.baseY, n.baseX);
      for (let ring = 1; ring < ringCount; ring += 1) {
        const start = ringStart[ring];
        const end = ring + 1 < ringCount ? ringStart[ring + 1] : nodes.length;
        const prevStart = ringStart[ring - 1];
        const prevEnd = start;
        for (let i = start; i < end; i += 1) {
          let best = prevStart;
          let bestDiff = Infinity;
          for (let j = prevStart; j < prevEnd; j += 1) {
            let diff = Math.abs(angleOf(nodes[i]) - angleOf(nodes[j]));
            if (diff > Math.PI) diff = Math.PI * 2 - diff;
            if (diff < bestDiff) {
              bestDiff = diff;
              best = j;
            }
          }
          edges.push({ a: i, b: best });
          if ((i - start) % 2 === 0 && i + 1 < end) edges.push({ a: i, b: i + 1 });
        }
      }

      const sparkCount = isMobile ? 10 : 16;
      sparks = Array.from({ length: sparkCount }, () => ({
        edge: Math.floor(Math.random() * edges.length),
        t: Math.random(),
        speed: 1.1 + Math.random() * 1.5,
        dir: Math.random() > 0.5 ? 1 : -1,
      }));
    };

    const createBurst = () => {
      const isMobile = width < 768;
      const count = isMobile ? 90 : 150;
      burstAge = 0;
      burstStarted = true;
      burstParticles = Array.from({ length: count }, (_, index) => ({
        angle: Math.random() * Math.PI * 2,
        distance: 8 + Math.random() * 18,
        speed: (isMobile ? 320 : 420) + Math.random() * (isMobile ? 460 : 700),
        size: 1.2 + Math.random() * (isMobile ? 2.7 : 4),
        life: 0.86 + Math.random() * 0.42,
        decay: 0.72 + Math.random() * 0.58,
        colorIndex: index % COLORS.length,
        x: 0,
        y: 0,
      }));
    };

    const drawGlow = (cx: number, cy: number, time: number, boost: number) => {
      const pulse = 0.5 + Math.sin(time * 4.2) * 0.5;
      const reach = (250 + pulse * 28) * (1 + boost * 1.4);
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, reach);
      glow.addColorStop(0, `rgba(155, 112, 255, ${0.30 + boost * 0.4})`);
      glow.addColorStop(0.22, `rgba(107, 72, 255, ${0.14 + boost * 0.2})`);
      glow.addColorStop(0.52, "rgba(107, 72, 255, 0.05)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, reach * 1.15, 0, Math.PI * 2);
      ctx.fill();
    };

    // Position every node for this frame: slow orbital drift + wobble while
    // loading, then a cubic ease pull into the core during the implosion.
    const layoutNodes = (time: number, cx: number, cy: number) => {
      const rot = time * 0.05;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const pull = implodeT * implodeT * implodeT;
      const progress = progressRef.current;

      for (const node of nodes) {
        const wobX = Math.sin(time * 1.15 + node.wobbleSeed) * 3.4;
        const wobY = Math.cos(time * 0.95 + node.wobbleSeed) * 3.4;
        const rx = node.baseX * cosR - node.baseY * sinR + wobX;
        const ry = node.baseX * sinR + node.baseY * cosR + wobY;
        node.x = cx + rx * (1 - pull);
        node.y = cy + ry * (1 - pull);
        node.alpha = Math.min(1, Math.max(0, (progress - node.appearAt) / 14));
      }
    };

    const drawWeb = (delta: number, time: number, cx: number, cy: number) => {
      drawGlow(cx, cy, time, implodeT);
      layoutNodes(time, cx, cy);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      // Edges — dimmed by the weaker endpoint, killed by the implosion.
      const edgeFade = 1 - implodeT;
      if (edgeFade > 0.01) {
        for (const edge of edges) {
          const a = nodes[edge.a];
          const b = nodes[edge.b];
          const alpha = Math.min(a.alpha, b.alpha) * 0.34 * edgeFade;
          if (alpha <= 0.01) continue;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(155, 112, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Nodes — batched per color; growth is size-based so fills stay batched.
      COLORS.forEach((color, colorIndex) => {
        ctx.beginPath();
        for (const node of nodes) {
          if (node.colorIndex !== colorIndex || node.alpha <= 0.02) continue;
          const size = node.size * (0.35 + node.alpha * 0.65) * (1 + implodeT * 0.6);
          ctx.moveTo(node.x + size, node.y);
          ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        }
        ctx.globalAlpha = 0.88;
        ctx.shadowColor = color.solid;
        ctx.shadowBlur = 9;
        ctx.fillStyle = color.fill;
        ctx.fill();
      });

      // Sparks racing along active synapses.
      if (edgeFade > 0.01) {
        ctx.beginPath();
        for (const spark of sparks) {
          const edge = edges[spark.edge];
          const a = nodes[edge.a];
          const b = nodes[edge.b];
          if (Math.min(a.alpha, b.alpha) < 0.55) {
            spark.edge = Math.floor(Math.random() * edges.length);
            spark.t = 0;
            continue;
          }
          spark.t += spark.speed * delta;
          if (spark.t >= 1) {
            spark.edge = Math.floor(Math.random() * edges.length);
            spark.t = 0;
            continue;
          }
          const tt = spark.dir === 1 ? spark.t : 1 - spark.t;
          const x = a.x + (b.x - a.x) * tt;
          const y = a.y + (b.y - a.y) * tt;
          ctx.moveTo(x + 2, y);
          ctx.arc(x, y, 2, 0, Math.PI * 2);
        }
        ctx.globalAlpha = 0.9 * edgeFade;
        ctx.shadowColor = "#E8F4FF";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "rgba(232, 244, 255, 0.92)";
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.restore();
    };

    const drawBurst = (delta: number) => {
      const cx = width / 2;
      const cy = height / 2;
      const maxDim = Math.max(width, height);
      burstAge += delta;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const flashAlpha = Math.max(0, 0.46 - burstAge * 1.55);
      if (flashAlpha > 0) {
        const flash = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxDim * 0.68);
        flash.addColorStop(0, `rgba(240, 236, 255, ${flashAlpha})`);
        flash.addColorStop(0.2, `rgba(155, 112, 255, ${flashAlpha * 0.55})`);
        flash.addColorStop(0.58, `rgba(107, 72, 255, ${flashAlpha * 0.18})`);
        flash.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = flash;
        ctx.fillRect(0, 0, width, height);
      }

      // Supernova shockwave rings.
      const waves = [
        { delay: 0, speed: 1.55, width: 3.2, alpha: 0.55 },
        { delay: 0.07, speed: 1.2, width: 2.2, alpha: 0.4 },
        { delay: 0.15, speed: 0.92, width: 1.6, alpha: 0.3 },
      ];
      for (const wave of waves) {
        const t = burstAge - wave.delay;
        if (t <= 0) continue;
        const r = t * wave.speed * maxDim;
        const fade = Math.max(0, 1 - r / (maxDim * 0.8));
        if (fade <= 0) continue;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 170, 255, ${wave.alpha * fade})`;
        ctx.lineWidth = wave.width * (0.4 + fade);
        ctx.shadowColor = "#B18CFF";
        ctx.shadowBlur = 18;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      burstParticles.forEach((particle) => {
        particle.distance += particle.speed * delta;
        particle.life -= delta * particle.decay;
        if (particle.life <= 0) return;

        const curve = Math.sin(burstAge * 5 + particle.angle) * 16 * (1 - particle.life);
        particle.x = cx + Math.cos(particle.angle) * particle.distance + Math.cos(particle.angle + Math.PI / 2) * curve;
        particle.y = cy + Math.sin(particle.angle) * particle.distance + Math.sin(particle.angle + Math.PI / 2) * curve;
      });

      COLORS.forEach((color, colorIndex) => {
        ctx.beginPath();
        burstParticles.forEach((particle) => {
          if (particle.colorIndex !== colorIndex || particle.life <= 0) return;
          const alphaScale = Math.max(0.28, Math.min(1, particle.life));
          const size = particle.size * alphaScale;
          ctx.moveTo(particle.x + size, particle.y);
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        });
        ctx.globalAlpha = 0.78;
        ctx.shadowColor = color.solid;
        ctx.shadowBlur = 10;
        ctx.fillStyle = color.fill;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.restore();
    };

    const drawStaticReduced = () => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.clearRect(0, 0, width, height);
      drawGlow(cx, cy, 0, 0);
    };

    const animate = (timeMs: number) => {
      if (!mounted) return;
      const delta = Math.min((timeMs - lastTime) / 1000, 0.05);
      lastTime = timeMs;
      const time = timeMs / 1000;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (phaseRef.current !== "loading" && implodeT < 1) {
        implodeT = Math.min(1, implodeT + (delta * 1000) / IMPLODE_MS);
      }

      drawWeb(delta, time, width / 2, height / 2);

      if (implodeT >= 1 && !burstStarted) createBurst();
      if (burstStarted) drawBurst(delta);

      rafId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    if (reducedMotion) {
      drawStaticReduced();
    } else {
      rafId = requestAnimationFrame(animate);
    }

    return () => {
      mounted = false;
      window.removeEventListener("resize", resize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isVisible) return null;

  const isExiting = phase !== "loading";

  return (
    <div
      className={[
        styles.wrapper,
        phase === "fading" ? styles.fadeOut : "",
        prefersReducedMotion ? styles.reducedMotion : "",
      ].join(" ")}
      role="status"
      aria-label="Loading portfolio"
    >
      <canvas ref={canvasRef} className={styles.particleCanvas} aria-hidden="true" />
      <div className={styles.container}>
        <div className={[styles.core, isExiting ? styles.coreBurst : ""].join(" ")} aria-hidden="true" />
        <svg
          className={[styles.svg, isExiting ? styles.hideRing : ""].join(" ")}
          width="200"
          height="200"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="apLoaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6B48FF" />
              <stop offset="55%" stopColor="#9B70FF" />
              <stop offset="100%" stopColor="#D896FF" />
            </linearGradient>
          </defs>
          <circle className={styles.track} cx="100" cy="100" r={RADIUS} />
          <circle
            ref={ringRef}
            className={styles.ring}
            cx="100"
            cy="100"
            r={RADIUS}
            style={{
              strokeDasharray: CIRCUMFERENCE,
              strokeDashoffset: CIRCUMFERENCE,
            }}
          />
        </svg>
        <div ref={textRef} className={[styles.text, isExiting ? styles.explode : ""].join(" ")} aria-hidden="true">
          0%
        </div>
        <div className={[styles.subtitle, isExiting ? styles.subtitleOut : ""].join(" ")} aria-hidden="true">
          ARNAV PRATAP
        </div>
        <span className="sr-only">Loading portfolio</span>
      </div>
    </div>
  );
}
