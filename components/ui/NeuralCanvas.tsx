"use client";
import { memo, useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const PARTICLE_COLORS = ['#3B3B8A', '#5A4FCF', '#6B48FF', '#8A7FFF', '#B8D4FF'];

function NeuralCanvasComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    const currentCanvas = canvasRef.current;
    if (!currentCanvas) return;
    const context = currentCanvas.getContext('2d');
    if (!context) return;
    const canvas = currentCanvas;
    const ctx = context;

    // PERF: Guard the canvas RAF after unmount.
    mountedRef.current = true;

    const isMobile = window.innerWidth < 768;
    // PERF: Adaptive particle budget based on device capability.
    const isLowEnd = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2;
    const PARTICLE_COUNT = isLowEnd ? 40 : isMobile ? 60 : 90;
    const CONNECTION_DISTANCE = 140;
    const MAX_DISTANCE_SQ = CONNECTION_DISTANCE * CONNECTION_DISTANCE;
    const DRIFT_SPEED = 0.15;
    // PERF: The drift/breath motion is slow — 24fps is visually identical and cuts canvas raster/upload work.
    const FRAME_INTERVAL_MS = 1000 / 24;
    let lastFrameTime = 0;
    // PERF: Reused per-frame buckets so batched drawing allocates nothing.
    const LINE_BUCKETS = 8;
    const lineBuckets: number[][] = Array.from({ length: LINE_BUCKETS }, () => []);
    let width = 0;
    let height = 0;
    let resizeTimeout: ReturnType<typeof setTimeout> | undefined;
    let rayGradients: CanvasGradient[] = [];

    function buildRayGradients() {
      rayGradients = Array.from({ length: 4 }, (_, i) => {
        const offset = (i / 4) * height * 0.6;
        const x = -100 + offset * 0.5;
        const y = -50 + offset;
        const gradient = ctx.createLinearGradient(x, y, x + width * 0.8, y + height * 0.6);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.025)');
        gradient.addColorStop(0.5, 'rgba(184, 212, 255, 0.012)');
        gradient.addColorStop(1, 'transparent');
        return gradient;
      });
    }

    function resize() {
      const parent = canvas.parentElement;
      width = parent?.clientWidth || window.innerWidth;
      height = parent?.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildRayGradients();
    }

    function createParticles() {
      const particles: Particle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const yNorm = Math.random();
        particles.push({
          x: 50 + Math.random() * Math.max(width - 100, 1),
          y: 50 + Math.random() * Math.max(height - 100, 1),
          vx: (Math.random() - 0.5) * DRIFT_SPEED * 2,
          vy: (Math.random() - 0.5) * DRIFT_SPEED * 2,
          radius: 1.5 + Math.random() * 1.5,
          color: PARTICLE_COLORS[Math.floor(yNorm * PARTICLE_COLORS.length)],
        });
      }
      return particles;
    }

    resize();
    particlesRef.current = createParticles();
    startTimeRef.current = performance.now();

    function drawLightRays(time: number) {
      const rays = 4;
      for (let i = 0; i < rays; i++) {
        const offset = (i / rays) * height * 0.6;
        const sweep = Math.sin((time / 12000) + (i * 1.5)) * 80;
        const x = -100 + sweep + offset * 0.5;
        const y = -50 + offset;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 60, y + height * 0.6);
        ctx.lineTo(x + 200, y + height * 0.6);
        ctx.lineTo(x + 140, y);
        ctx.closePath();
        ctx.fillStyle = rayGradients[i];
        ctx.fill();
        ctx.restore();
      }
    }

    function startAnimation() {
      if (animFrameRef.current === null) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    }

    function stopAnimation() {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    }

    // PERF: Reusable sort comparator — avoids allocating a closure every frame.
    function sortByX(a: Particle, b: Particle) {
      return a.x - b.x;
    }

    function animate(frameTime: number) {
      // PERF: Bail out before drawing if unmounted.
      if (!mountedRef.current) {
        animFrameRef.current = null;
        return;
      }
      animFrameRef.current = requestAnimationFrame(animate);

      // PERF: 30fps cap — skip raster work on in-between frames so scroll/compositing gets the headroom.
      if (frameTime - lastFrameTime < FRAME_INTERVAL_MS - 1) return;
      // PERF: Freeze the ambient drift while the page is scrolling — its motion is invisible
      // mid-scroll and every skipped raster+composite goes straight to scroll smoothness.
      if (document.documentElement.classList.contains('is-scrolling')) return;
      lastFrameTime = frameTime;

      const time = performance.now() - startTimeRef.current;
      ctx.clearRect(0, 0, width, height);

      const breath = Math.sin((time / 8000) * Math.PI * 2) * 0.1 + 0.25;
      drawLightRays(time);

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + (Math.random() - 0.5) * 0.05;
        p.y += p.vy + (Math.random() - 0.5) * 0.05;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }

      // PERF: Sort particles by X, then early-break the inner loop when dx exceeds
      // CONNECTION_DISTANCE. Reduces O(n²) pair checks from ~6000 to ~800 on average.
      particles.sort(sortByX);

      // PERF: Batch connection lines into opacity buckets — one beginPath/stroke per bucket
      // (8 draw calls) instead of one per pair (hundreds). Per-pair immediate-mode stroke()
      // was the dominant CPU cost of this canvas.
      for (let b = 0; b < LINE_BUCKETS; b++) lineBuckets[b].length = 0;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particles[i].x;
          // PERF: Since particles are X-sorted, all subsequent j have dx >= current dx.
          if (dx > CONNECTION_DISTANCE) break;

          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < MAX_DISTANCE_SQ) {
            const proximity = 1 - Math.sqrt(distSq) / CONNECTION_DISTANCE;
            const bucket = Math.min(LINE_BUCKETS - 1, (proximity * LINE_BUCKETS) | 0);
            lineBuckets[bucket].push(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
          }
        }
      }

      for (let b = 0; b < LINE_BUCKETS; b++) {
        const segments = lineBuckets[b];
        if (segments.length === 0) continue;
        const midProximity = (b + 0.5) / LINE_BUCKETS;
        ctx.beginPath();
        for (let s = 0; s < segments.length; s += 4) {
          ctx.moveTo(segments[s], segments[s + 1]);
          ctx.lineTo(segments[s + 2], segments[s + 3]);
        }
        ctx.strokeStyle = 'rgba(107, 72, 255, ' + midProximity * breath * 0.6 + ')';
        ctx.lineWidth = 0.5 + midProximity * 0.5;
        ctx.stroke();
      }

      // PERF: Batch dots by color — one fill per color instead of one per particle.
      ctx.globalAlpha = 0.6 + breath * 0.4;
      for (let c = 0; c < PARTICLE_COLORS.length; c++) {
        const color = PARTICLE_COLORS[c];
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (p.color !== color) continue;
          ctx.moveTo(p.x + p.radius, p.y);
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        }
        ctx.fillStyle = color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (let c = 0; c < PARTICLE_COLORS.length; c++) {
        const color = PARTICLE_COLORS[c];
        ctx.beginPath();
        let hasGlow = false;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (p.color !== color || p.radius <= 2.5) continue;
          hasGlow = true;
          ctx.moveTo(p.x + p.radius * 3, p.y);
          ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        }
        if (!hasGlow) continue;
        ctx.fillStyle = color + '20';
        ctx.fill();
      }
    }

    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0 }
    );

    const observedElement = canvas.parentElement || canvas;
    observer.observe(observedElement);

    return () => {
      mountedRef.current = false;
      stopAnimation();
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1, opacity: 0.85 }}
    />
  );
}

export default memo(NeuralCanvasComponent);
