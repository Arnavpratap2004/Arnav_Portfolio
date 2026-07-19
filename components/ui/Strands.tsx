"use client";

import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import { memo, useEffect, useRef, type CSSProperties } from "react";

const MAX_STRANDS = 12;
const MAX_COLORS = 8;
const DEFAULT_COLORS = ["#FF4242", "#7C3AED", "#06B6D4", "#EAB308"];

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColors[8];
uniform int uColorCount;
uniform int uStrandCount;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uHueShift;
uniform float uIntensity;
uniform float uOpacity;
uniform float uScale;
uniform float uSaturation;

out vec4 fragColor;

const float PI = 3.14159265;

vec3 spectrum(float t) {
  return 0.5 + 0.5 * cos(2.0 * PI * (t + vec3(0.00, 0.33, 0.67)));
}

vec3 samplePalette(float t) {
  t = fract(t);
  float scaled = t * float(uColorCount);
  int idx = int(floor(scaled));
  float blend = fract(scaled);
  int nextIdx = idx + 1;
  if (nextIdx >= uColorCount) nextIdx = 0;
  return mix(uColors[idx], uColors[nextIdx], blend);
}

vec3 strandColor(float t) {
  if (uColorCount > 0) return samplePalette(t);
  return spectrum(t);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  uv /= max(uScale, 0.0001);

  float e = 0.06 + uIntensity * 0.94;
  // Use a Gaussian bell curve instead of cosine to prevent periodic repeating at the edges
  float env = exp(-uv.x * uv.x * uTaper * 2.0);

  vec3 col = vec3(0.0);

  for (int i = 0; i < 12; i++) {
    if (i >= uStrandCount) break;

    float fi = float(i);
    float ph = fi * 1.7 * uSpread;
    float freq = (2.0 + fi * 0.35) * uWaviness;
    float spd = 1.4 + fi * 1.2;

    float tt = uTime * uSpeed;
    float w = sin(uv.x * freq + tt * spd + ph) * 0.60
            + sin(uv.x * freq * 1.1 - tt * spd * 0.7 + ph * 1.7) * 0.40;

    float amp = (0.1 + 0.02 * e) * env * uAmplitude;
    float y = w * amp;

    float d = abs(uv.y - y);
    float thick = (0.001 + 0.05 * e) * (0.35 + env) * uThickness;
    float g = thick / (d + thick * 0.45);
    g = g * g;

    float h = fi / float(uStrandCount) + uv.x * 0.30 + uTime * 0.04 + uHueShift;
    col += strandColor(h) * g * env;
  }

  col *= 0.45 + 0.7 * e;
  col = 1.0 - exp(-col * uGlow);

  float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = max(mix(vec3(gray), col, uSaturation), 0.0);

  float lum = max(max(col.r, col.g), col.b);
  float alpha = clamp(lum, 0.0, 1.0) * uOpacity;

  fragColor = vec4(col * uOpacity, alpha);
}
`;

type RuntimeProps = {
  colors: string[];
  count: number;
  speed: number;
  amplitude: number;
  waviness: number;
  thickness: number;
  glow: number;
  taper: number;
  spread: number;
  hueShift: number;
  intensity: number;
  saturation: number;
  opacity: number;
  scale: number;
};

export type StrandsProps = Partial<RuntimeProps> & {
  glass?: boolean;
  refraction?: number;
  dispersion?: number;
  glassSize?: number;
  className?: string;
  style?: CSSProperties;
};

function buildPalette(colors: string[]) {
  const filled = colors.length > 0 ? colors : ["#ffffff"];
  const padded: number[][] = [];

  for (let index = 0; index < MAX_COLORS; index += 1) {
    const hex = filled[index] ?? filled[filled.length - 1];
    const color = new Color(hex);
    padded.push([color.r, color.g, color.b]);
  }

  return padded;
}

function debounce<T extends (...args: never[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function StrandsComponent({
  colors = DEFAULT_COLORS,
  count = 3,
  speed = 0.5,
  amplitude = 1,
  waviness = 1,
  thickness = 0.7,
  glow = 2.6,
  taper = 3,
  spread = 1,
  hueShift = 0,
  intensity = 0.6,
  saturation = 1.5,
  opacity = 1,
  scale = 1.5,
  className = "",
  style,
}: StrandsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const mountedRef = useRef(false);
  const visibleRef = useRef(false);
  const propsRef = useRef<RuntimeProps>({ colors, count, speed, amplitude, waviness, thickness, glow, taper, spread, hueShift, intensity, saturation, opacity, scale });

  propsRef.current = { colors, count, speed, amplitude, waviness, thickness, glow, taper, spread, hueShift, intensity, saturation, opacity, scale };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    let program: Program | null = null;
    let geometry: Triangle | null = null;
    let mesh: Mesh | null = null;
    let lastPaletteKey = "";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    mountedRef.current = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        powerPreference: "high-performance",
      });

      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.canvas.style.backgroundColor = "transparent";
      gl.canvas.style.display = "block";
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";

      geometry = new Triangle(gl);
      if (geometry.attributes.uv) delete geometry.attributes.uv;

      const initial = propsRef.current;
      program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [1, 1] },
          uColors: { value: buildPalette(initial.colors) },
          uColorCount: { value: Math.min(initial.colors.length, MAX_COLORS) },
          uStrandCount: { value: Math.min(initial.count, MAX_STRANDS) },
          uSpeed: { value: initial.speed },
          uAmplitude: { value: initial.amplitude },
          uWaviness: { value: initial.waviness },
          uThickness: { value: initial.thickness },
          uGlow: { value: initial.glow },
          uTaper: { value: initial.taper },
          uSpread: { value: initial.spread },
          uHueShift: { value: initial.hueShift },
          uIntensity: { value: initial.intensity },
          uOpacity: { value: initial.opacity },
          uScale: { value: initial.scale },
          uSaturation: { value: initial.saturation },
        },
      });

      mesh = new Mesh(gl, { geometry, program });
      container.appendChild(gl.canvas);

      const resize = () => {
        if (!renderer || !program) return;
        const width = Math.max(1, Math.floor(container.clientWidth));
        const height = Math.max(1, Math.floor(container.clientHeight));
        const dpr = renderer.dpr || 1;

        renderer.setSize(width, height);
        program.uniforms.uResolution.value = [width * dpr, height * dpr];
      };

      const debouncedResize = debounce(resize, 150);
      window.addEventListener("resize", debouncedResize, { passive: true });
      resize();
      visibleRef.current = true;

      const syncUniforms = (current: RuntimeProps) => {
        if (!program) return;
        const paletteKey = current.colors.join("|");
        if (paletteKey !== lastPaletteKey) {
          program.uniforms.uColors.value = buildPalette(current.colors);
          lastPaletteKey = paletteKey;
        }

        program.uniforms.uColorCount.value = Math.min(current.colors.length, MAX_COLORS);
        program.uniforms.uStrandCount.value = Math.min(Math.max(Math.round(current.count), 1), MAX_STRANDS);
        program.uniforms.uSpeed.value = current.speed;
        program.uniforms.uAmplitude.value = current.amplitude;
        program.uniforms.uWaviness.value = current.waviness;
        program.uniforms.uThickness.value = current.thickness;
        program.uniforms.uGlow.value = current.glow;
        program.uniforms.uTaper.value = current.taper;
        program.uniforms.uSpread.value = current.spread;
        program.uniforms.uHueShift.value = current.hueShift;
        program.uniforms.uIntensity.value = current.intensity;
        program.uniforms.uOpacity.value = current.opacity;
        program.uniforms.uScale.value = current.scale;
        program.uniforms.uSaturation.value = current.saturation;
      };

      const renderFrame = (time: number) => {
        if (!mountedRef.current || !renderer || !program || !mesh) return;

        if (visibleRef.current) {
          const current = propsRef.current;
          syncUniforms(current);
          program.uniforms.uTime.value = time * 0.001;
          renderer.render({ scene: mesh });
        }

        if (!reducedMotion) rafRef.current = window.requestAnimationFrame(renderFrame);
      };

      rafRef.current = window.requestAnimationFrame(renderFrame);

      return () => {
        mountedRef.current = false;
        if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
        window.removeEventListener("resize", debouncedResize);
        observer.disconnect();
        program?.remove();
        geometry?.remove();
        if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
        const loseContext = gl.getExtension("WEBGL_lose_context") as WEBGL_lose_context | null;
        loseContext?.loseContext();
      };
    } catch {
      observer.disconnect();
      mountedRef.current = false;
      return undefined;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={"strands-container " + className}
      style={{ position: "relative", width: "100%", height: "100%", background: "transparent", ...style }}
    />
  );
}

export const Strands = memo(StrandsComponent);

