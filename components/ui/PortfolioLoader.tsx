"use client";

import { useEffect, useRef, useState } from "react";
import { markIntroReady, subscribeIntro } from "@/lib/intro";
import styles from "./PortfolioLoader.module.css";

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * The intro is a pane of glass under load.
 *
 * Loading progress is not a decorative number here — it is structural stress. Hairline
 * fractures creep outward from the centre as it climbs, and at 100% the pane fails:
 * the cracks race to the edges, the sheet hangs together for a beat, then it lets go and
 * falls past the camera, revealing the hero through the gaps.
 *
 * Act timings, from the moment progress hits 100:
 *   IMPACT  cracks propagate to the edges + flash
 *   HOLD    fully cracked but still intact — the beat that makes it read as physical
 *   SHATTER shards separate, tumble, fall; the hero is handed off at the first frame of this
 */
const IMPACT_MS = 170;
const HOLD_MS = 130;
const SHATTER_MS = 820;
const SHATTER_AT_MS = IMPACT_MS + HOLD_MS;
// Slack so the last shard is fully faded before the overlay leaves the DOM.
const TEARDOWN_MS = SHATTER_AT_MS + SHATTER_MS + 140;
const REDUCED_OUTRO_DELAY_MS = 120;
const REDUCED_FADE_DURATION_MS = 160;

// Honest progress: race the real readiness signal against a deadline so a slow font
// fetch never traps the visitor, and a warm cache never reduces the intro to a flash.
const SOFT_CAP = 88;
const MIN_VISIBLE_MS = 850;
const MAX_WAIT_MS = 2600;

type LoaderPhase = "loading" | "impact" | "shatter";

/** One facet of the pane. Points are stored relative to the centroid so the shard can be
 *  rotated and scaled about its own middle with plain arithmetic — no per-shard canvas
 *  save/rotate/restore, which keeps every facet batchable into a handful of draw calls. */
type Shard = {
  pts: number[]; // flat [x,y,...] relative to centroid
  cx: number;
  cy: number;
  dist: number; // from the impact point, drives ordering + physics
  dirX: number;
  dirY: number;
  outSpeed: number;
  fall: number;
  spin: number;
  grow: number;
  delay: number; // fraction of the shatter it waits before letting go
  tint: number; // fill bucket, baked from where the facet sat under the glow
  edge: number; // edge brightness — a few facets catch the light hard
  alpha: number;
  tumble: number; // rate of the out-of-plane flip
  tumblePhase: number;
  tumbleAxis: number; // 0 = flips about its vertical axis, 1 = about its horizontal
};

/** A fracture line, revealed progressively as the load (stress) climbs. */
type Crack = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  appearAt: number; // progress % at which this fracture starts forming
  width: number;
};

export function PortfolioLoader() {
  const [phase, setPhase] = useState<LoaderPhase>("loading");
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const restoredBodyRef = useRef(false);
  const progressRef = useRef(0);
  const phaseRef = useRef<LoaderPhase>("loading");
  // Set the instant progress reaches 100 — the canvas clock for impact/hold/shatter.
  const impactAtRef = useRef(0);

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
      setPhase("impact");
      phaseRef.current = "impact";
      impactAtRef.current = performance.now();

      if (reducedMotion) {
        // No shatter: the pane simply clears. Same handoff contract, much shorter.
        queueTimer(() => {
          if (cancelled) return;
          restoreBody();
          markIntroReady();
          setPhase("shatter");
          phaseRef.current = "shatter";
        }, REDUCED_OUTRO_DELAY_MS);
        queueTimer(() => {
          if (cancelled) return;
          setIsVisible(false);
        }, REDUCED_OUTRO_DELAY_MS + REDUCED_FADE_DURATION_MS);
        return;
      }

      // The pane lets go. This is the handoff: #main-content is unmasked on the very frame
      // the facets start moving, so the hero is revealed *through* the falling glass rather
      // than cross-faded in behind it. Driven by a timer, not the canvas loop, so it still
      // fires in a backgrounded tab where RAF never runs.
      queueTimer(() => {
        if (cancelled) return;
        setPhase("shatter");
        phaseRef.current = "shatter";
        restoreBody();
        markIntroReady();
      }, SHATTER_AT_MS);

      queueTimer(() => {
        if (cancelled) return;
        setIsVisible(false);
      }, TEARDOWN_MS);
    };

    // Real readiness. Fonts are the signal that actually matters here: the hero's name is
    // text, and letting it type out in a fallback face only to reflow mid-reveal is the one
    // glitch that would break the whole opening.
    const startedAt = performance.now();
    let assetsReady = false;
    const markAssetsReady = () => {
      assetsReady = true;
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(markAssetsReady).catch(markAssetsReady);
    } else {
      markAssetsReady();
    }
    queueTimer(markAssetsReady, MAX_WAIT_MS);

    const simulateLoad = () => {
      if (cancelled) return;

      const elapsed = performance.now() - startedAt;
      const held = currentProgress >= SOFT_CAP && (!assetsReady || elapsed < MIN_VISIBLE_MS);

      // Climb briskly to the soft cap, then creep while waiting on the real signal so the
      // ring keeps breathing instead of freezing, and release to 100 once the page is ready.
      currentProgress += reducedMotion ? 100 : held ? Math.random() * 0.35 : Math.random() * 3.5 + 3;

      if (!held && currentProgress >= 100) {
        triggerOutroAnimation();
        return;
      }

      updateProgressDisplay(Math.min(currentProgress, held ? 99 : 100));
      queueTimer(simulateLoad, Math.random() * 20 + 16);
    };

    queueTimer(simulateLoad, reducedMotion ? 80 : 120);

    // Safety net. restoreBody() unlocks scrolling and unmasks #main-content, so if it never
    // runs the page is left permanently invisible and unscrollable — the worst failure this
    // component can produce. Two independent recoveries, because the timer chain above is a
    // single point of failure:
    //   1. Anyone signalling intro-ready (including useIntroGate's own failsafe) unmasks.
    //   2. A hard backstop that fires regardless of what else went wrong.
    const unsubscribe = subscribeIntro(restoreBody);
    queueTimer(() => {
      restoreBody();
      setIsVisible(false);
    }, 9000);

    return () => {
      cancelled = true;
      unsubscribe();
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

    const TAU = Math.PI * 2;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId: number | null = null;
    let mounted = true;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let impactX = 0;
    let impactY = 0;
    let maxReach = 1;
    let shards: Shard[] = [];
    let cracks: Crack[] = [];
    // Fine debris thrown at the moment of failure — the spray that sells a real break.
    let dust: { vx: number; vy: number; size: number; life: number }[] = [];

    // Facets are drawn in a fixed set of (alpha x tint) buckets so the whole pane costs a
    // handful of fill/stroke calls per frame instead of one pair per facet. Sorting into
    // buckets is a cheap integer compare; issuing ~100 separate fills is not.
    const ALPHA_BINS = 5;
    // Three tints, assigned by where the facet sat under the glow rather than at random: the
    // pane was lit in the middle and dark at the rim, so as it comes apart you watch that
    // light break into pieces and scatter with them. This is the cheapest possible stand-in
    // for "each shard carries an image of what was on the glass".
    const TINTS = 3;
    const BIN_COUNT = ALPHA_BINS * TINTS;
    const TINT_RGB = ["6,9,17", "14,18,34", "27,31,58"];

    // Per-frame scratch, allocated once at build time and refilled in place.
    type Baked = { bin: number; poly: number[]; sparkle: boolean; live: boolean };
    let baked: Baked[] = [];
    const buckets: number[][] = Array.from({ length: BIN_COUNT }, () => []);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const build = () => {
      const isMobile = width < 768;
      const spokes = isMobile ? 11 : 15;
      const rings = isMobile ? 5 : 6;

      impactX = width / 2;
      impactY = height / 2;
      maxReach = Math.hypot(width, height) / 2;

      const spread = TAU / spokes;
      const angles: number[] = [];
      for (let s = 0; s < spokes; s += 1) {
        angles.push(s * spread + rand(-spread * 0.22, spread * 0.22));
      }

      // Exponent > 1 packs the inner rings tightly: small facets at the impact, big plates
      // out at the edges. That size gradient is most of what makes a break read as glass.
      const ringR: number[][] = [];
      for (let j = 0; j < rings; j += 1) {
        const base = maxReach * Math.pow((j + 1) / rings, 1.55);
        const row: number[] = [];
        for (let s = 0; s < spokes; s += 1) row.push(base * rand(0.86, 1.14));
        ringR.push(row);
      }
      const outerR = maxReach * 2.4; // pushed past the corners so nothing uncovers early

      const px = (s: number, j: number) =>
        impactX + Math.cos(angles[s]) * (j >= rings ? outerR : ringR[j][s]);
      const py = (s: number, j: number) =>
        impactY + Math.sin(angles[s]) * (j >= rings ? outerR : ringR[j][s]);

      shards = [];
      cracks = [];

      const pushShard = (poly: number[]) => {
        let sx = 0;
        let sy = 0;
        const n = poly.length / 2;
        for (let i = 0; i < poly.length; i += 2) {
          sx += poly[i];
          sy += poly[i + 1];
        }
        const cx = sx / n;
        const cy = sy / n;
        const rel: number[] = [];
        for (let i = 0; i < poly.length; i += 2) rel.push(poly[i] - cx, poly[i + 1] - cy);

        const dx = cx - impactX;
        const dy = cy - impactY;
        const dist = Math.hypot(dx, dy) || 1;
        const near = 1 - Math.min(1, dist / maxReach); // 1 at the impact, 0 at the rim

        shards.push({
          pts: rel,
          cx,
          cy,
          dist,
          dirX: dx / dist,
          dirY: dy / dist,
          // Facets near the impact took the energy: they fly furthest, grow most (i.e. come
          // at the camera) and let go first. Rim plates mostly just drop out of frame.
          outSpeed: 90 + near * rand(300, 620),
          fall: rand(260, 520) + near * 180,
          spin: rand(-1.6, 1.6) * (0.45 + near),
          grow: near * rand(0.25, 0.8),
          delay: (1 - near) * 0.2 + rand(0, 0.06),
          // Baked from position under the glow, with a little noise so the banding between
          // tiers isn't a visible ring.
          tint: Math.max(0, Math.min(TINTS - 1, Math.floor((near + rand(-0.12, 0.12)) * TINTS))),
          // Out-of-plane flip. Squashing one axis by |cos| is enough to read as a shard
          // tumbling in 3D — at the extremes it goes edge-on and nearly disappears, which is
          // exactly what real glass does as it turns over.
          tumble: rand(2.2, 6.5) * (0.6 + near),
          tumblePhase: Math.random() * TAU,
          tumbleAxis: Math.random() < 0.5 ? 0 : 1,
          // A minority of facets catch the light hard — that glint is the difference between
          // "dark polygons" and "glass".
          edge: Math.random() < 0.18 ? rand(0.8, 1) : rand(0.14, 0.36),
          alpha: rand(0.9, 0.97),
        });
      };

      // Centre fan: the finest facets, first to go.
      for (let s = 0; s < spokes; s += 1) {
        const n = (s + 1) % spokes;
        pushShard([impactX, impactY, px(s, 0), py(s, 0), px(n, 0), py(n, 0)]);
      }
      // Ring quads.
      for (let j = 0; j < rings - 1; j += 1) {
        for (let s = 0; s < spokes; s += 1) {
          const n = (s + 1) % spokes;
          pushShard([px(s, j), py(s, j), px(n, j), py(n, j), px(n, j + 1), py(n, j + 1), px(s, j + 1), py(s, j + 1)]);
        }
      }
      // Outer band stretched past the corners.
      for (let s = 0; s < spokes; s += 1) {
        const n = (s + 1) % spokes;
        pushShard([px(s, rings - 1), py(s, rings - 1), px(n, rings - 1), py(n, rings - 1), px(n, rings), py(n, rings), px(s, rings), py(s, rings)]);
      }

      // Painter's order: far facets first, so near ones sweep over them on the way past.
      shards.sort((a, b) => b.dist - a.dist);
      baked = shards.map((s) => ({ bin: 0, poly: new Array(s.pts.length).fill(0), sparkle: s.edge > 0.7, live: true }));

      // Fracture lines. Radial spokes plus the ring arcs joining them — the pattern a struck
      // pane actually makes. appearAt ties each one to a stress (progress) threshold.
      const stressAt = (j: number) => Math.min(92, (j / rings) * 78 + rand(0, 12));
      for (let s = 0; s < spokes; s += 1) {
        cracks.push({ x1: impactX, y1: impactY, x2: px(s, 0), y2: py(s, 0), appearAt: rand(2, 10), width: 1.5 });
        for (let j = 0; j < rings - 1; j += 1) {
          cracks.push({ x1: px(s, j), y1: py(s, j), x2: px(s, j + 1), y2: py(s, j + 1), appearAt: stressAt(j + 1), width: 1.2 });
        }
      }
      for (let j = 0; j < rings; j += 1) {
        for (let s = 0; s < spokes; s += 1) {
          const n = (s + 1) % spokes;
          cracks.push({ x1: px(s, j), y1: py(s, j), x2: px(n, j), y2: py(n, j), appearAt: stressAt(j) + rand(0, 6), width: 1 });
        }
      }
    };

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
      build();
      buildGradients();
    };

    // PERF: gradients are built once per resize and re-used with globalAlpha to vary their
    // strength. Rebuilding a full-screen radial gradient every frame — which is what this did
    // while the page was still hydrating — is one of the most expensive things you can ask
    // Canvas2D to do. During the load phase the glow is now left entirely to CSS
    // (.wrapper::before and .core, both composited and free), so nothing paints it here.
    let glowGrad: CanvasGradient | null = null;
    let flashGrad: CanvasGradient | null = null;

    const buildGradients = () => {
      glowGrad = ctx.createRadialGradient(impactX, impactY, 0, impactX, impactY, maxReach * 0.62);
      glowGrad.addColorStop(0, "rgba(170, 130, 255, 0.85)");
      glowGrad.addColorStop(0.4, "rgba(107, 72, 255, 0.28)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      flashGrad = ctx.createRadialGradient(impactX, impactY, 0, impactX, impactY, maxReach * 0.95);
      flashGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      flashGrad.addColorStop(0.12, "rgba(224, 208, 255, 0.58)");
      flashGrad.addColorStop(0.42, "rgba(150, 108, 255, 0.24)");
      flashGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    };

    const drawGlow = (strength: number) => {
      if (!glowGrad || strength <= 0.01) return;
      ctx.globalAlpha = strength;
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
    };

    // Fractures creep outward as stress climbs; `force` slams them all to full at impact.
    // Drawn in two weight classes — primary radials heavier than the ring arcs, the way a
    // real break has a few dominant fissures and a lot of finer connecting ones.
    const drawCracks = (progress: number, force: number, fade: number) => {
      ctx.lineCap = "round";
      for (const heavy of [true, false]) {
        ctx.beginPath();
        let any = false;
        for (const c of cracks) {
          if (c.width >= 1.2 !== heavy) continue;
          const grow = Math.max(force, Math.min(1, (progress - c.appearAt) / 7));
          if (grow <= 0) continue;
          any = true;
          ctx.moveTo(c.x1, c.y1);
          ctx.lineTo(c.x1 + (c.x2 - c.x1) * grow, c.y1 + (c.y2 - c.y1) * grow);
        }
        if (!any) continue;
        // Two strokes over one path: a soft violet halo, then a bright lit core.
        ctx.strokeStyle = `rgba(150, 108, 255, ${(heavy ? 0.26 : 0.16) * fade})`;
        ctx.lineWidth = heavy ? 4.5 : 2.5;
        ctx.stroke();
        ctx.strokeStyle = `rgba(230, 240, 255, ${(heavy ? 0.72 : 0.4) * fade})`;
        ctx.lineWidth = heavy ? 1.35 : 0.85;
        ctx.stroke();
      }
    };

    const spawnDust = () => {
      const count = width < 768 ? 46 : 88;
      dust = Array.from({ length: count }, () => {
        const a = Math.random() * TAU;
        const speed = rand(150, 980);
        return { vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, size: rand(0.7, 2.4), life: rand(0.42, 0.95) };
      });
    };

    const drawDust = (elapsed: number) => {
      if (!dust.length) return;
      ctx.beginPath();
      let any = false;
      for (const d of dust) {
        const t = elapsed / d.life;
        if (t >= 1) continue;
        any = true;
        const x = impactX + d.vx * elapsed;
        const y = impactY + d.vy * elapsed + 620 * elapsed * elapsed;
        const s = d.size * (1 - t * 0.45);
        ctx.moveTo(x + s, y);
        ctx.arc(x, y, s, 0, TAU);
      }
      if (!any) return;
      ctx.fillStyle = `rgba(232, 242, 255, ${Math.max(0, 0.85 - elapsed * 0.9)})`;
      ctx.fill();
    };

    // The strike: white core flash plus a stress ring racing out through the sheet.
    const drawImpact = (t: number) => {
      const decay = (1 - t) * (1 - t);
      if (flashGrad) {
        ctx.globalAlpha = decay;
        ctx.fillStyle = flashGrad;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
      }

      // Two stress rings racing out through the sheet, the second trailing the first.
      for (const [delay, weight] of [[0, 1], [0.22, 0.55]] as const) {
        const rt = (t - delay) / (1 - delay);
        if (rt <= 0) continue;
        const r = maxReach * (0.08 + rt * 1.4);
        ctx.beginPath();
        ctx.arc(impactX, impactY, r, 0, TAU);
        ctx.strokeStyle = `rgba(224, 212, 255, ${0.62 * weight * (1 - rt) * (1 - rt)})`;
        ctx.lineWidth = (1.5 + 9 * (1 - rt)) * weight;
        ctx.stroke();
      }
    };

    // p: 0..1 across the whole shatter. Each facet runs its own delayed sub-timeline.
    const drawShards = (p: number) => {
      for (let i = 0; i < shards.length; i += 1) {
        const s = shards[i];
        const b = baked[i];
        const local = (p - s.delay) / (1 - s.delay);

        if (local <= 0) {
          // Still keyed into the pane: draw at rest.
          for (let k = 0; k < s.pts.length; k += 2) {
            b.poly[k] = s.cx + s.pts[k];
            b.poly[k + 1] = s.cy + s.pts[k + 1];
          }
          b.bin = (ALPHA_BINS - 1) * TINTS + s.tint;
          b.live = true;
          continue;
        }
        if (local >= 1) {
          b.live = false;
          continue;
        }

        const accel = local * local;
        const ox = s.dirX * s.outSpeed * local;
        const oy = s.dirY * s.outSpeed * local + s.fall * accel; // gravity takes over late
        const rot = s.spin * local;
        const cos = Math.cos(rot);
        const sin = Math.sin(rot);
        const scale = 1 + s.grow * local;
        // Out-of-plane tumble: squash one axis by |cos| so the facet foreshortens, goes
        // edge-on, and opens back out as it turns over.
        const flip = 0.26 + 0.74 * Math.abs(Math.cos(s.tumblePhase + s.tumble * local));
        const sx = s.tumbleAxis === 0 ? scale * flip : scale;
        const sy = s.tumbleAxis === 0 ? scale : scale * flip;
        const cx = s.cx + ox;
        const cy = s.cy + oy;

        for (let k = 0; k < s.pts.length; k += 2) {
          const rx = s.pts[k] * sx;
          const ry = s.pts[k + 1] * sy;
          b.poly[k] = cx + rx * cos - ry * sin;
          b.poly[k + 1] = cy + rx * sin + ry * cos;
        }

        // The body of the facet thins out faster than its edges do, so mid-flight each shard
        // is a barely-there tinted pane defined almost entirely by its lit rim — which is how
        // you actually perceive a piece of glass moving through the air.
        const a = Math.max(0, s.alpha * (1 - accel * 1.3));
        b.bin = Math.max(0, Math.min(ALPHA_BINS - 1, Math.floor(a * ALPHA_BINS))) * TINTS + s.tint;
        b.live = a > 0.015 || local < 0.85;
      }

      // PERF: bucket once, then walk each bucket — instead of rescanning all ~105 facets for
      // every one of the 15 bins.
      for (let bin = 0; bin < BIN_COUNT; bin += 1) buckets[bin].length = 0;
      for (let i = 0; i < baked.length; i += 1) {
        if (baked[i].live) buckets[baked[i].bin].push(i);
      }

      // Depth: one pass laying every facet's shadow on the hero below, offset along the fall.
      // Cheap (a single path) and it stops the shards reading as flat cut-outs floating on top.
      // Only worth paying for while the facets still read as solid; past that they are mostly
      // edges and the shadow is invisible anyway.
      if (p < 0.55) {
        const drop = 6 + 10 * p;
        ctx.beginPath();
        let shadowed = false;
        for (let i = 0; i < baked.length; i += 1) {
          const b = baked[i];
          if (!b.live) continue;
          shadowed = true;
          ctx.moveTo(b.poly[0] + drop * 0.5, b.poly[1] + drop);
          for (let k = 2; k < b.poly.length; k += 2) ctx.lineTo(b.poly[k] + drop * 0.5, b.poly[k + 1] + drop);
          ctx.closePath();
        }
        if (shadowed) {
          ctx.fillStyle = `rgba(0, 0, 0, ${0.34 * (1 - p / 0.55)})`;
          ctx.fill();
        }
      }

      for (let bin = BIN_COUNT - 1; bin >= 0; bin -= 1) {
        const list = buckets[bin];
        if (!list.length) continue;
        const alpha = (Math.floor(bin / TINTS) + 0.85) / ALPHA_BINS;
        if (alpha <= 0.02) continue;
        const rgb = TINT_RGB[bin % TINTS];

        ctx.beginPath();
        for (let n = 0; n < list.length; n += 1) {
          const b = baked[list[n]];
          ctx.moveTo(b.poly[0], b.poly[1]);
          for (let k = 2; k < b.poly.length; k += 2) ctx.lineTo(b.poly[k], b.poly[k + 1]);
          ctx.closePath();
        }

        ctx.fillStyle = `rgba(${rgb},${Math.min(1, alpha)})`;
        ctx.fill();
        // Every facet is lit along its edges — this is the single strongest "this is glass"
        // cue. Without it the break reads as dark polygons sliding around. The edge outlives
        // the fill on purpose (see the alpha note above).
        ctx.strokeStyle = `rgba(196, 214, 255, ${Math.min(0.9, alpha * 0.45 + 0.4 * (1 - p))})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Glint pass: the minority of facets angled into the light. Stroked three times with a
      // sub-pixel offset in cyan/magenta/white to fake the prismatic split real glass gives —
      // far cheaper than any actual refraction and reads correctly at this size.
      ctx.beginPath();
      let sparkle = false;
      for (let i = 0; i < baked.length; i += 1) {
        const b = baked[i];
        if (!b.live || !b.sparkle) continue;
        sparkle = true;
        ctx.moveTo(b.poly[0], b.poly[1]);
        for (let k = 2; k < b.poly.length; k += 2) ctx.lineTo(b.poly[k], b.poly[k + 1]);
        ctx.closePath();
      }
      if (sparkle) {
        const glint = 1 - p;
        ctx.save();
        ctx.translate(-0.7, 0);
        ctx.strokeStyle = `rgba(120, 226, 255, ${0.34 * glint})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.translate(1.4, 0);
        ctx.strokeStyle = `rgba(236, 150, 255, ${0.3 * glint})`;
        ctx.stroke();
        ctx.restore();
        ctx.strokeStyle = `rgba(240, 248, 255, ${0.8 * glint})`;
        ctx.lineWidth = 1.35;
        ctx.stroke();
      }
    };

    const drawStaticReduced = () => {
      ctx.clearRect(0, 0, width, height);
      drawGlow(0.5);
    };

    let lastCrackFrame = 0;

    const animate = (timeMs: number) => {
      if (!mounted) return;
      const impactAt = impactAtRef.current;
      const since = impactAt ? timeMs - impactAt : -1;

      if (since < 0) {
        // Under load the pane is intact and the fractures grow slowly, so this is capped at
        // ~30fps — visually identical, and it halves the canvas work during the window where
        // React hydration is already fighting for the main thread. Skipping the frame without
        // clearing simply leaves the previous one on screen.
        rafId = requestAnimationFrame(animate);
        if (timeMs - lastCrackFrame < 32) return;
        lastCrackFrame = timeMs;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        // No glow here: .wrapper::before and .core already light the pane from CSS, composited.
        drawCracks(progressRef.current, 0, 1);
        return;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (since < SHATTER_AT_MS) {
        // Impact + hold. Cracks are forced to full length; the flash decays through both.
        if (!dust.length) spawnDust();
        const t = Math.min(1, since / IMPACT_MS);
        drawCracks(100, Math.min(1, since / (IMPACT_MS * 0.55)), 1);
        drawImpact(t);
        drawDust(since / 1000);
      } else {
        const p = (since - SHATTER_AT_MS) / SHATTER_MS;
        if (p >= 1) {
          rafId = null;
          return; // every facet has fallen; leave the canvas clear
        }
        // No canvas glow here: .coreBurst carries the light dispersing behind the pane, and a
        // composited CSS transform costs nothing next to a full-screen gradient fillRect every
        // frame — which was the single biggest per-frame cost of the shatter.
        drawShards(p);
        drawDust(since / 1000);
      }

      rafId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    let idleId: number | undefined;
    if (reducedMotion) {
      // No RAF loop to wait for — the canvas is shown via prefersReducedMotion at render.
      drawStaticReduced();
    } else {
      // Don't fight hydration for the main thread. requestIdleCallback fires as soon as the
      // thread is actually free, which is exactly when this canvas can hold 60fps; until then
      // the composited core/halo animations carry the loader. The timeout is the backstop for
      // a thread that never goes idle.
      const startCanvas = () => {
        if (!mounted) return;
        setCanvasReady(true);
        rafId = requestAnimationFrame(animate);
      };

      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(startCanvas, { timeout: 700 });
      } else {
        rafId = requestAnimationFrame(startCanvas);
      }
    }

    return () => {
      mounted = false;
      window.removeEventListener("resize", resize);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);


  if (!isVisible) return null;

  const isExiting = phase !== "loading";

  return (
    <div
      className={[
        styles.wrapper,
        // At `shatter` the pane stops being a solid backdrop: the wrapper's own fill and its
        // vignette/grid drop out, so the only thing still covering the hero is the canvas full
        // of falling facets. The hero is revealed through the widening gaps between them
        // rather than by a cross-fade.
        phase === "impact" ? styles.impacted : "",
        phase === "shatter" ? styles.shattered : "",
        prefersReducedMotion && phase === "shatter" ? styles.fadeOut : "",
        prefersReducedMotion ? styles.reducedMotion : "",
      ].join(" ")}
      role="status"
      aria-label="Loading portfolio"
    >
      <canvas
        ref={canvasRef}
        className={[styles.particleCanvas, canvasReady || prefersReducedMotion ? styles.canvasReady : ""].join(" ")}
        aria-hidden="true"
      />
      <div className={styles.container}>
        <div className={[styles.core, isExiting ? styles.coreBurst : ""].join(" ")} aria-hidden="true" />
        <div className={[styles.halo, isExiting ? styles.haloOut : ""].join(" ")} aria-hidden="true" />
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
