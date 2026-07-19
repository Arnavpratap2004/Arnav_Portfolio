"use client";
import { memo, useEffect, useRef } from "react";
import { ACESFilmicToneMapping, AdditiveBlending, BufferAttribute, BufferGeometry, Color, FogExp2, PerspectiveCamera, Points, Scene, ShaderMaterial, WebGLRenderer } from "three"; // PERF: Named Three.js imports avoid namespace retention in this particle renderer.

function ParticleNebulaComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  // PERF: Store pending RAF ids in refs so cleanup can always cancel frames scheduled by event handlers.
  const mouseRafRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  // PERF: Keep only the newest pointer sample for the next RAF tick instead of doing event-time work.
  const pendingMouseRef = useRef({ clientX: 0, clientY: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // PERF: Guard the WebGL animation loop against post-unmount callbacks.
    mountedRef.current = true;

    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4;
    const clusterCount = isMobile ? 15 : isLowEnd ? 20 : 30;
    const particlesPerCluster = isMobile ? 150 : isLowEnd ? 250 : 500;
    const dustCount = isMobile ? 40 : isLowEnd ? 80 : 200;

    const scene = new Scene(); // PERF: Named Three.js import keeps this particle setup tree-shakable.
    scene.fog = new FogExp2(0x06090f, 0.0008); // PERF: Named Three.js import keeps this particle setup tree-shakable.

    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000); // PERF: Named Three.js import keeps this particle setup tree-shakable.
    camera.position.z = 800;

    const renderer = new WebGLRenderer({ // PERF: Named Three.js import keeps this particle setup tree-shakable.
      antialias: false, // PERF: MSAA does nothing for alpha-blended point sprites — pure cost.
      alpha: true,
      powerPreference: "high-performance",
    });
    // PERF: Cap DPR at 1.5/1.25 — additive-blended overdraw scales with the square of the ratio,
    // and soft nebula particles look identical at the lower density.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = ACESFilmicToneMapping; // PERF: Named Three.js import keeps this particle setup tree-shakable.
    renderer.toneMappingExposure = 1.0;

    container.appendChild(renderer.domElement);

    const particleCount = clusterCount * particlesPerCluster;
    const pGeometry = new BufferGeometry(); // PERF: Named Three.js import keeps geometry construction tree-shakable.
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);
    const pSizes = new Float32Array(particleCount);

    const palette = [
      new Color(0x3b82f6), // PERF: Named Three.js import keeps palette construction tree-shakable.
      new Color(0x8b5cf6), // PERF: Named Three.js import keeps palette construction tree-shakable.
      new Color(0xc026d3), // PERF: Named Three.js import keeps palette construction tree-shakable.
      new Color(0x06b6d4), // PERF: Named Three.js import keeps palette construction tree-shakable.
      new Color(0xf59e0b), // PERF: Named Three.js import keeps palette construction tree-shakable.
      new Color(0x10b981), // PERF: Named Three.js import keeps palette construction tree-shakable.
    ];

    let pIdx = 0;
    for (let c = 0; c < clusterCount; c++) {
      const cx = (Math.random() - 0.5) * 4000;
      const cy = (Math.random() - 0.5) * 4000;
      const cz = (Math.random() - 0.5) * 3000 + 400;
      const clusterColor = palette[Math.floor(Math.random() * palette.length)];

      for (let p = 0; p < particlesPerCluster; p++) {
        const r = Math.pow(Math.random(), 2) * 400;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        pPositions[pIdx * 3] = cx + r * Math.sin(phi) * Math.cos(theta);
        pPositions[pIdx * 3 + 1] = cy + r * Math.sin(phi) * Math.sin(theta);
        pPositions[pIdx * 3 + 2] = cz + r * Math.cos(phi);

        const isCore = Math.random() > 0.85;
        const brightness = 0.6 + Math.random() * 0.6;
        pColors[pIdx * 3] = isCore ? 1.0 : clusterColor.r * brightness;
        pColors[pIdx * 3 + 1] = isCore ? 1.0 : clusterColor.g * brightness;
        pColors[pIdx * 3 + 2] = isCore ? 1.0 : clusterColor.b * brightness;

        pSizes[pIdx] = Math.random() * 15 + 5;
        if (Math.random() > 0.95) pSizes[pIdx] *= 4.0;

        pIdx++;
      }
    }

    pGeometry.setAttribute("position", new BufferAttribute(pPositions, 3)); // PERF: Named Three.js import keeps attribute construction tree-shakable.
    pGeometry.setAttribute("color", new BufferAttribute(pColors, 3)); // PERF: Named Three.js import keeps attribute construction tree-shakable.
    pGeometry.setAttribute("size", new BufferAttribute(pSizes, 1)); // PERF: Named Three.js import keeps attribute construction tree-shakable.

    const pMaterial = new ShaderMaterial({ // PERF: Named Three.js import keeps shader material construction tree-shakable.
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        uniform float time;
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec3 pos = position;
          pos.y += sin(time * 1.5 + pos.x * 0.02) * 20.0;
          pos.x += cos(time * 1.0 + pos.y * 0.02) * 10.0;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (600.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float ll = length(xy);
          if (ll > 0.5) discard;
          float intensity = smoothstep(0.5, 0.35, ll);
          gl_FragColor = vec4(vColor * intensity, intensity * 0.6);
        }
      `,
      blending: AdditiveBlending, // PERF: Named Three.js import keeps blending constant tree-shakable.
      depthWrite: false,
      transparent: true,
    });

    const particleSystem = new Points(pGeometry, pMaterial); // PERF: Named Three.js import keeps point system construction tree-shakable.
    scene.add(particleSystem);

    const dustGeometry = new BufferGeometry(); // PERF: Named Three.js import keeps geometry construction tree-shakable.
    const dustPositions = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);
    const dustColors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 4000;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 4000;
      dustPositions[i * 3 + 2] = Math.random() * 800 + 200;
      dustSizes[i] = Math.random() * 60 + 30;

      const col = palette[Math.floor(Math.random() * palette.length)];
      dustColors[i * 3] = col.r;
      dustColors[i * 3 + 1] = col.g;
      dustColors[i * 3 + 2] = col.b;
    }

    dustGeometry.setAttribute("position", new BufferAttribute(dustPositions, 3)); // PERF: Named Three.js import keeps attribute construction tree-shakable.
    dustGeometry.setAttribute("size", new BufferAttribute(dustSizes, 1)); // PERF: Named Three.js import keeps attribute construction tree-shakable.
    dustGeometry.setAttribute("color", new BufferAttribute(dustColors, 3)); // PERF: Named Three.js import keeps attribute construction tree-shakable.

    const dustMaterial = new ShaderMaterial({ // PERF: Named Three.js import keeps shader material construction tree-shakable.
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (400.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float ll = length(xy);
          if (ll > 0.5) discard;
          float intensity = pow(1.0 - (ll * 2.0), 3.0) * 0.15;
          gl_FragColor = vec4(vColor, intensity);
        }
      `,
      blending: AdditiveBlending, // PERF: Named Three.js import keeps blending constant tree-shakable.
      depthWrite: false,
      transparent: true,
    });

    const dustSystem = new Points(dustGeometry, dustMaterial); // PERF: Named Three.js import keeps point system construction tree-shakable.
    scene.add(dustSystem);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = window.scrollY;
    let time = 0;
    let resizeTimeout: ReturnType<typeof setTimeout> | undefined;
    let isVisible = false;

    const updateMouse = (clientX: number, clientY: number) => {
      mouseX = (clientX / window.innerWidth) * 2 - 1;
      mouseY = -(clientY / window.innerHeight) * 2 + 1;
    };

    const scheduleMouseUpdate = (clientX: number, clientY: number) => {
      pendingMouseRef.current.clientX = clientX;
      pendingMouseRef.current.clientY = clientY;
      if (mouseRafRef.current !== null) return;
      mouseRafRef.current = requestAnimationFrame(() => {
        updateMouse(pendingMouseRef.current.clientX, pendingMouseRef.current.clientY);
        mouseRafRef.current = null;
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isVisible) return;
      scheduleMouseUpdate(event.clientX, event.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!isVisible) return;
      const touch = event.touches[0];
      if (touch) scheduleMouseUpdate(touch.clientX, touch.clientY);
    };

    const onScroll = () => {
      if (!isVisible || scrollRafRef.current !== null) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollY = window.scrollY;
        scrollRafRef.current = null;
      });
    };

    const applyResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const onWindowResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(applyResize, 150);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onWindowResize, { passive: true });

    let lastScrollFrame = 0;
    const animate = (frameTime: number) => {
      // PERF: setAnimationLoop should be stopped before cleanup, but this guard prevents any stale render from drawing.
      if (!mountedRef.current || !isVisible) return;

      // PERF: Half-rate while the page is scrolling — the orbiting cards are the show during the
      // sticky Projects scroll; the nebula can rotate at 30fps unnoticed, freeing GPU for them.
      if (document.documentElement.classList.contains("is-scrolling")) {
        if (frameTime - lastScrollFrame < 33) return;
        lastScrollFrame = frameTime;
      }

      time += 0.005;

      targetX = mouseX * 200;
      targetY = mouseY * 200;
      particleSystem.rotation.y = time * 0.05 + scrollY * 0.0005;
      pMaterial.uniforms.time.value = time;
      dustSystem.rotation.y = time * 0.03;
      dustSystem.rotation.x = time * 0.02;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    const setVisible = (visible: boolean) => {
      isVisible = visible;
      renderer.setAnimationLoop(visible ? animate : null);
    };

    // PERF: One warm-up render before the visibility gate — compiles both particle shader
    // programs at (idle) premount time so the first on-screen frame doesn't stall on compilation.
    renderer.render(scene, camera);

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(container);

    return () => {
      mountedRef.current = false;
      renderer.setAnimationLoop(null);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onWindowResize);
      if (mouseRafRef.current !== null) cancelAnimationFrame(mouseRafRef.current);
      if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
      mouseRafRef.current = null;
      scrollRafRef.current = null;
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      pGeometry.dispose();
      pMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();
      // PERF: Force WebGL context loss so route/section changes release GPU resources promptly.
      renderer.forceContextLoss();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
}

export const ParticleNebula = memo(ParticleNebulaComponent);
