"use client";

import React, { memo, useEffect, useRef } from "react";
import { AdditiveBlending, AmbientLight, BufferAttribute, BufferGeometry, Clock, DirectionalLight, Mesh, PerspectiveCamera, PlaneGeometry, Points, RepeatWrapping, Scene, ShaderMaterial, TextureLoader, Vector2, WebGLRenderer, type Material, type Object3D, type Texture } from "three"; // PERF: Named Three.js imports avoid namespace retention in this glass WebGL background.
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

// --- Shaders ---
const fractVert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fractFrag = `
uniform sampler2D tDiffuse;
uniform sampler2D tFracture;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;

float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  // The fracture map is stretched across the whole canvas. On desktop that canvas is wider than
  // tall, so the cells read as organic shattered glass. On a phone the About section runs ~5x
  // taller than it is wide (the skill cards stack into one column), and one copy of the map
  // smeared over that height turns every cell into a vertical streak.
  //
  // Portrait canvases therefore sample the map "cover" style: full height, cropped to a centred
  // column one "aspect" wide. Equal texture-units-per-pixel on both axes, so cells keep
  // the shape they have on desktop. Cropping rather than repeating is deliberate — the map has a
  // radial density falloff (dense centre, sparse edges), so tiling it stacks bright blobs and
  // dark waists into an obvious string-of-beads. Landscape takes the identity path and renders
  // exactly as before.
  float aspect = uResolution.x / uResolution.y;
  vec2 fractureUv = vUv;
  if (aspect < 1.0) {
    fractureUv.x = (vUv.x - 0.5) * aspect + 0.5;
  }

  vec4 fractData = texture2D(tFracture, fractureUv);
  vec2 normal = fractData.rg * 2.0 - 1.0;
  float crackIntensity = fractData.b;

  vec2 mouseOffset = (uMouse - 0.5) * 0.05;
  vec2 refractedUv = vUv + normal * 0.03 + mouseOffset * (1.0 - crackIntensity);

  float rSplit = 0.005;
  float bSplit = -0.005;

  float r = texture2D(tDiffuse, refractedUv + normal * rSplit).r;
  float g = texture2D(tDiffuse, refractedUv).g;
  float b = texture2D(tDiffuse, refractedUv + normal * bSplit).b;

  vec3 baseColor = vec3(r, g, b);

  float sweep = sin(vUv.x * 10.0 + vUv.y * 10.0 - uTime * 2.0) * 0.5 + 0.5;
  float distToMouse = distance(vUv, uMouse);
  float mouseGlow = smoothstep(0.3, 0.0, distToMouse);

  // PERF: Slightly stronger in-shader glow replaces the removed UnrealBloomPass (5 blur passes/frame).
  // Brightness boosted per request — stronger ambient term + wider sweep swing for a livelier background light.
  vec3 glowColor = vec3(0.55, 0.85, 1.0) * crackIntensity * (sweep * 0.6 + 0.66 + mouseGlow * 1.15);

  vec3 finalColor = baseColor + glowColor;

  // PERF: Vignette, film grain, and color grade folded in from the old separate postfx pass —
  // one full-screen pass instead of two halves the composer's fill cost.
  vec2 center = vec2(0.5);
  float distToCenter = distance(vUv, center);
  float vignette = smoothstep(0.8, 0.2, distToCenter);
  finalColor *= vignette;

  float noise = (rand(vUv * uTime) - 0.5) * 0.05;
  finalColor += noise;

  float luma = dot(finalColor, vec3(0.299, 0.587, 0.114));
  vec3 shadows = vec3(0.0, 0.0, 0.05);
  vec3 highlights = vec3(0.05, 0.02, 0.0);
  finalColor += mix(shadows, highlights, luma);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const causticsVert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const causticsFrag = `
uniform float uTime;
uniform sampler2D tNoise;
varying vec2 vUv;

void main() {
  vec2 uv1 = vUv + vec2(uTime * 0.05, uTime * 0.02);
  vec2 uv2 = vUv * 1.5 - vec2(uTime * 0.03, uTime * 0.04);
  
  float n1 = texture2D(tNoise, uv1).r;
  float n2 = texture2D(tNoise, uv2).r;
  
  float caustic = pow(min(n1, n2), 2.0) * 2.0;
  caustic = smoothstep(0.1, 0.4, caustic);
  float fade = smoothstep(0.0, 0.5, 1.0 - vUv.y);
  
  vec3 color = vec3(0.12, 0.45, 0.9) * caustic * fade * 0.75;
  gl_FragColor = vec4(color, 1.0);
}
`;

const partVert = `
uniform float uTime;
uniform vec2 uMouse;
attribute float aSize;
attribute vec3 aRandomness;

varying vec2 vUv;
varying float vAlpha;

void main() {
  vUv = uv;
  vec3 pos = position;
  pos.x += sin(uTime * aRandomness.x + aRandomness.y) * 0.1;
  pos.y += cos(uTime * aRandomness.z + aRandomness.x) * 0.1;
  pos.z += sin(uTime * aRandomness.y + aRandomness.z) * 0.05;
  
  vec2 ndcMouse = uMouse * 2.0 - 1.0;
  vec3 mousePos = vec3(ndcMouse.x * 5.0, ndcMouse.y * 5.0, 0.0);
  float dist = distance(pos.xy, mousePos.xy);
  
  if (dist < 2.0) {
    vec2 dir = normalize(pos.xy - mousePos.xy);
    pos.xy += dir * (2.0 - dist) * 0.1;
  }

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (20.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
  vAlpha = smoothstep(0.0, 10.0, -mvPosition.z) * 0.5;
}
`;

const partFrag = `
varying vec2 vUv;
varying float vAlpha;

void main() {
  vec2 centerUv = gl_PointCoord - vec2(0.5);
  float dist = length(centerUv);
  if (dist > 0.5) discard;
  
  float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
  vec3 color = vec3(0.5, 0.8, 1.0);
  gl_FragColor = vec4(color, alpha);
}
`;

function GlassBackgroundComponent({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const mountedRef = useRef(false);
  // PERF: Coalesce pointer measurement into RAF and cancel queued work on cleanup.
  const pointerRafRef = useRef<number | null>(null);
  const pendingPointerRef = useRef<{ clientX: number; clientY: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    // PERF: Guard async WebGL setup and RAF rendering after unmount.
    mountedRef.current = true;
    let width = container.clientWidth;
    let height = container.clientHeight;
    const isMobile = window.innerWidth < 768;
    let isVisible = false;
    let isReady = false;
    let resizeTimeout: ReturnType<typeof setTimeout> | undefined;

    const mouse = new Vector2(0.5, 0.5); // PERF: Named Three.js import keeps pointer vector construction tree-shakable.
    const targetMouse = new Vector2(0.5, 0.5); // PERF: Named Three.js import keeps pointer vector construction tree-shakable.
    let lastPointerTime = 0;
    const clock = new Clock(); // PERF: Named Three.js import keeps timing helper tree-shakable.
    const minFrameMs = 1000 / 24; // PERF: Render this decorative background below display refresh rate so scroll stays responsive.
    let lastRenderTime = 0; // PERF: Track the last actual GPU draw for RAF throttling.

    const sceneBase = new Scene(); // PERF: Named Three.js import keeps scene construction tree-shakable.
    const camera = new PerspectiveCamera(45, width / height, 0.1, 100); // PERF: Named Three.js import keeps camera construction tree-shakable.
    camera.position.z = 10;

    // PERF: antialias off — every pixel goes through the composer's offscreen targets, so canvas MSAA only added cost.
    // alpha:false — the scene clears to an opaque navy anyway; an opaque canvas skips per-frame
    // transparency blending in the compositor.
    const renderer = new WebGLRenderer({ antialias: false, alpha: false });
    renderer.setSize(width, height);
    // PERF: 0.8 render scale — this backdrop is refracted "glass", so upscaling is imperceptible
    // while cutting full-screen fragment work by ~36%.
    const rendererPixelRatio = 0.8;
    renderer.setPixelRatio(rendererPixelRatio);
    renderer.setClearColor(0x030712, 1);
    container.appendChild(renderer.domElement);

    const textureLoader = new TextureLoader(); // PERF: Named Three.js import keeps texture loading tree-shakable.
    let fractureTex: Texture | null = null, noiseTex: Texture | null = null; // PERF: Named Three.js type imports avoid retaining the namespace for texture types.
    let causticsMat: ShaderMaterial | null = null, particleMat: ShaderMaterial | null = null; // PERF: Named Three.js imports avoid retaining the namespace for material refs.
    let composer: EffectComposer | null = null, glassPass: ShaderPass | null = null;

    const initScene = async () => {
      fractureTex = await new Promise<Texture>(res => textureLoader.load("/assets/fracture.webp", res)); // PERF: Smaller WebP texture preserves the same visual while reducing GPU upload and network cost.
      if (!mountedRef.current) {
        fractureTex.dispose();
        return;
      }
      fractureTex.wrapS = RepeatWrapping; // PERF: Named Three.js import keeps wrapping constant tree-shakable.
      fractureTex.wrapT = RepeatWrapping; // PERF: Named Three.js import keeps wrapping constant tree-shakable.

      noiseTex = await new Promise<Texture>(res => textureLoader.load("/assets/noise.webp", res)); // PERF: Smaller WebP texture preserves the same visual while reducing GPU upload and network cost.
      if (!mountedRef.current) {
        fractureTex.dispose();
        noiseTex.dispose();
        return;
      }
      noiseTex.wrapS = RepeatWrapping; // PERF: Named Three.js import keeps wrapping constant tree-shakable.
      noiseTex.wrapT = RepeatWrapping; // PERF: Named Three.js import keeps wrapping constant tree-shakable.

      // 1. Caustics
      const causticsGeo = new PlaneGeometry(30, 20); // PERF: Named Three.js import keeps geometry construction tree-shakable.
      causticsMat = new ShaderMaterial({ // PERF: Named Three.js import keeps shader material construction tree-shakable.
        vertexShader: causticsVert,
        fragmentShader: causticsFrag,
        uniforms: { uTime: { value: 0 }, tNoise: { value: noiseTex } },
        transparent: true,
        blending: AdditiveBlending, // PERF: Named Three.js import keeps blending constant tree-shakable.
        depthWrite: false
      });
      const causticsMesh = new Mesh(causticsGeo, causticsMat); // PERF: Named Three.js import keeps mesh construction tree-shakable.
      causticsMesh.position.z = -5;
      sceneBase.add(causticsMesh);

      // 2. Particles
      const particleCount = isMobile ? 180 : 360; // PERF: Keep the same particle field impression with fewer animated vertices.
      const partGeo = new BufferGeometry(); // PERF: Named Three.js import keeps particle geometry construction tree-shakable.
      const posArray = new Float32Array(particleCount * 3);
      const randArray = new Float32Array(particleCount * 3);
      const sizeArray = new Float32Array(particleCount);

      for(let i=0; i<particleCount; i++) {
        posArray[i*3] = (Math.random() - 0.5) * 20;
        posArray[i*3+1] = (Math.random() - 0.5) * 15;
        posArray[i*3+2] = (Math.random() - 0.5) * 5 - 2;
        randArray[i*3] = Math.random() * 2;
        randArray[i*3+1] = Math.random() * 2;
        randArray[i*3+2] = Math.random() * 2;
        sizeArray[i] = Math.random() * 0.5 + 0.1;
      }

      partGeo.setAttribute('position', new BufferAttribute(posArray, 3)); // PERF: Named Three.js import keeps buffer attribute construction tree-shakable.
      partGeo.setAttribute('aRandomness', new BufferAttribute(randArray, 3)); // PERF: Named Three.js import keeps buffer attribute construction tree-shakable.
      partGeo.setAttribute('aSize', new BufferAttribute(sizeArray, 1)); // PERF: Named Three.js import keeps buffer attribute construction tree-shakable.

      particleMat = new ShaderMaterial({ // PERF: Named Three.js import keeps shader material construction tree-shakable.
        vertexShader: partVert,
        fragmentShader: partFrag,
        uniforms: { uTime: { value: 0 }, uMouse: { value: new Vector2(0.5, 0.5) } }, // PERF: Named Three.js import keeps vector uniform construction tree-shakable.
        transparent: true,
        blending: AdditiveBlending, // PERF: Named Three.js import keeps blending constant tree-shakable.
        depthWrite: false
      });
      const particles = new Points(partGeo, particleMat); // PERF: Named Three.js import keeps point system construction tree-shakable.
      sceneBase.add(particles);

      // Lights
      const ambient = new AmbientLight(0xffffff, 0.5); // PERF: Named Three.js import keeps light construction tree-shakable.
      sceneBase.add(ambient);
      const dirLight = new DirectionalLight(0xffffff, 2); // PERF: Named Three.js import keeps light construction tree-shakable.
      dirLight.position.set(5, 5, 5);
      sceneBase.add(dirLight);

      // Post-Processing
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(sceneBase, camera));

      glassPass = new ShaderPass({
        uniforms: {
          tDiffuse: { value: null },
          tFracture: { value: fractureTex },
          uTime: { value: 0 },
          uMouse: { value: new Vector2(0.5, 0.5) }, // PERF: Named Three.js import keeps vector uniform construction tree-shakable.
          uResolution: { value: new Vector2(width, height) } // PERF: Named Three.js import keeps resolution vector construction tree-shakable.
        },
        vertexShader: fractVert,
        fragmentShader: fractFrag
      });
      composer.addPass(glassPass);

      // PERF: UnrealBloomPass removed — it ran a 5-level blur chain per frame and was the single
      // largest GPU cost on integrated graphics (About section measured 15fps with it enabled).
      // The glass shader's glow term above was strengthened to keep the same visual feel.
      // The old postfx pass (vignette/grain/grade) is folded into the glass shader, so the
      // composer is now just: scene render → one combined full-screen pass.

      isReady = true;

      // PERF: One warm-up render even while off-screen — compiles every GLSL program and uploads
      // textures at (idle) premount time instead of stalling the first frame the section scrolls
      // into view (measured as a ~280ms mid-scroll hitch).
      if (!isVisible && mountedRef.current) composer.render();

      startRender();
    };

    const startRender = () => {
      if (mountedRef.current && isReady && isVisible && rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(render);
      }
    };

    const stopRender = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    const render = (frameTime = 0) => {
      // PERF: Bail out before drawing if unmounted or off-screen.
      if (!mountedRef.current || !isVisible) {
        rafIdRef.current = null;
        return;
      }
      rafIdRef.current = requestAnimationFrame(render);
      if (frameTime - lastRenderTime < minFrameMs) return; // PERF: Skip expensive composer renders between throttled background frames.
      // PERF: Freeze this ambient backdrop while the page is scrolling — the composer render is
      // the About section's dominant GPU cost and its slow motion is invisible mid-scroll.
      if (document.documentElement.classList.contains("is-scrolling")) return;
      lastRenderTime = frameTime;
      const time = clock.getElapsedTime();
      mouse.lerp(targetMouse, 0.05);

      if (causticsMat) causticsMat.uniforms.uTime.value = time;
      if (particleMat) {
        particleMat.uniforms.uTime.value = time;
        particleMat.uniforms.uMouse.value.copy(mouse);
      }
      if (glassPass) {
        glassPass.uniforms.uTime.value = time;
        glassPass.uniforms.uMouse.value.copy(mouse);
      }

      camera.position.x += ((mouse.x - 0.5) * 2.0 - camera.position.x) * 0.05;
      camera.position.y += ((mouse.y - 0.5) * 2.0 - camera.position.y) * 0.05;
      camera.lookAt(sceneBase.position);

      if (composer) composer.render();
    };

    initScene();

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = (clientX - rect.left) / rect.width;
      targetMouse.y = 1.0 - ((clientY - rect.top) / rect.height);
    };

    const shouldHandlePointer = () => {
      const now = performance.now();
      if (now - lastPointerTime < 16) return false;
      lastPointerTime = now;
      return true;
    };

    const schedulePointerUpdate = (clientX: number, clientY: number) => {
      pendingPointerRef.current = { clientX, clientY };
      if (pointerRafRef.current !== null) return;

      // PERF: Batch getBoundingClientRect into RAF so pointer events do not force synchronous layout.
      pointerRafRef.current = requestAnimationFrame(() => {
        pointerRafRef.current = null;
        const point = pendingPointerRef.current;
        pendingPointerRef.current = null;
        if (!point || !mountedRef.current || !isVisible) return;
        updatePointer(point.clientX, point.clientY);
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isVisible || !shouldHandlePointer()) return;
      schedulePointerUpdate(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isVisible || !shouldHandlePointer()) return;
      const touch = e.touches[0];
      if (touch) schedulePointerUpdate(touch.clientX, touch.clientY);
    };
    
    // Use ResizeObserver for responsive canvas
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (!entry) return;

      width = entry.contentRect.width;
      height = entry.contentRect.height;
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        if (composer) composer.setSize(width, height);
        if (glassPass) glassPass.uniforms.uResolution.value.set(width, height);
      }, 150);
    });

    resizeObserver.observe(container);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startRender();
        } else {
          stopRender();
        }
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(container);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      mountedRef.current = false;
      stopRender();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (pointerRafRef.current !== null) {
        // PERF: Cancel queued pointer measurement before tearing down the WebGL canvas.
        cancelAnimationFrame(pointerRafRef.current);
        pointerRafRef.current = null;
      }
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneBase.traverse((object) => {
        const disposable = object as Object3D & { geometry?: BufferGeometry; material?: Material | Material[] }; // PERF: Named Three.js type imports avoid retaining the namespace during disposal.
        disposable.geometry?.dispose();
        const material = disposable.material;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose();
      });
      fractureTex?.dispose();
      noiseTex?.dispose();
      composer?.dispose();
      renderer.dispose();
      // PERF: Force WebGL context loss so route/section changes release GPU resources promptly.
      renderer.forceContextLoss();
    };
  }, []);

  return <div ref={containerRef} className={`overflow-hidden ${className}`} />;
}

export const GlassBackground = memo(GlassBackgroundComponent);


