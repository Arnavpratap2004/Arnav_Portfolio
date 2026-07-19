"use client";
import { useMemo, useState, type CSSProperties } from 'react';
import { m, useReducedMotion, type MotionValue } from 'framer-motion';

interface Shard {
  id: number;
  x: string;
  y: string;
  size: number;
  shape: 'hexagon' | 'diamond' | 'prism' | 'fragment';
  rotationSpeed: number;
  mobileHidden?: boolean;
}

interface CrystalShardsProps {
  y?: MotionValue<number>;
}

const MATERIALIZE_EASE = [0.34, 1.56, 0.64, 1] as const;
const HOVER_EASE = [0.16, 1, 0.3, 1] as const;

// PERF: Module-level variants — created once, never re-allocated on render.
const shardHiddenVariant = { scale: 0.85, opacity: 0 };
const shardHiddenReducedVariant = { scale: 1, opacity: 0 };
const shardVisibleVariant = {
  scale: 1,
  opacity: 1,
  transition: { duration: 0.4, ease: MATERIALIZE_EASE },
};

const shardShapes: Record<Shard['shape'], string> = {
  hexagon: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  prism: 'polygon(20% 0%, 80% 0%, 100% 40%, 80% 100%, 20% 100%, 0% 40%)',
  fragment: 'polygon(30% 0%, 70% 10%, 100% 50%, 80% 90%, 40% 100%, 0% 60%, 10% 20%)',
};

function ShardElement({ shard }: { shard: Shard }) {
  const shouldReduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [flashKey, setFlashKey] = useState(0);
  const clipPath = shardShapes[shard.shape];

  const hoverProps = shouldReduceMotion
    ? {}
    : {
        whileHover: { rotateY: 25, rotateX: 15, scale: 1.08 },
        onHoverStart: () => {
          setHovered(true);
          setFlashKey((key) => key + 1);
        },
        onHoverEnd: () => setHovered(false),
      };

  return (
    <m.div
      className={`absolute pointer-events-auto ${shard.mobileHidden ? "hidden md:block" : ""}`}
      data-cursor="hover"
      style={{
        left: shard.x,
        top: shard.y,
        width: shard.size,
        height: shard.size * 1.2,
        zIndex: 2,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      variants={{
        hidden: shouldReduceMotion ? shardHiddenReducedVariant : shardHiddenVariant,
        visible: shardVisibleVariant,
      }}
    >
      <m.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        transition={{ duration: 0.5, ease: HOVER_EASE }}
        {...hoverProps}
      >
        <div
          className="relative h-full w-full shard-rotate"
          style={{
            // PERF: Varied 7–13s float cycles (was a 24–36s 3D spin). preserve-3d dropped — the
            // float is 2D, so no 3D rendering context (and its extra render surfaces) is needed.
            animationDuration: `${10 + shard.rotationSpeed / 2}s`,
            animationDelay: `${shard.id * -1.7}s`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              clipPath,
              // PERF: backdrop-filter removed — 8 shards re-blurring the animating canvas behind
              // them every frame was a large compositor cost. Slightly stronger gradient keeps the look.
              background: `linear-gradient(135deg,
                rgba(184, 212, 255, 0.18) 0%,
                rgba(107, 72, 255, 0.10) 40%,
                rgba(255, 255, 255, 0.06) 70%,
                rgba(216, 150, 255, 0.12) 100%)`,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: `
                inset 0 0 20px rgba(184, 212, 255, 0.1),
                0 0 30px rgba(107, 72, 255, 0.08),
                inset 0 0 40px rgba(107, 72, 255, 0.05)
              `,
            }}
          />

          <div
            className="absolute inset-2"
            style={{
              clipPath,
              background: `linear-gradient(45deg,
                rgba(255, 255, 255, 0.08) 0%,
                transparent 50%,
                rgba(184, 212, 255, 0.06) 100%)`,
            }}
          />
        </div>

        {hovered && !shouldReduceMotion && (
          <m.div
            key={flashKey}
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath,
              background: 'radial-gradient(circle at 50% 50%, rgba(184, 212, 255, 0.5), transparent 70%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.6, ease: 'easeOut', times: [0, 0.45, 1] }}
          />
        )}
      </m.div>
    </m.div>
  );
}

export default function CrystalShards({ y }: CrystalShardsProps) {
  const shards = useMemo<Shard[]>(() => {
    const positions = ['8%', '75%', '15%', '85%', '5%', '90%', '25%', '70%'];
    const verticals = ['15%', '10%', '45%', '35%', '70%', '60%', '80%', '75%'];
    const sizes = [60, 90, 50, 110, 70, 80, 45, 100];
    const shapes: Shard['shape'][] = ['hexagon', 'diamond', 'prism', 'fragment', 'hexagon', 'prism', 'diamond', 'fragment'];

    return positions.map((position, index) => ({
      id: index,
      x: position,
      y: verticals[index],
      size: sizes[index],
      shape: shapes[index],
      rotationSpeed: (index % 5) * 3 - 6,
      mobileHidden: index >= 4,
    }));
  }, []);

  return (
    <m.div
      className="absolute inset-0 pointer-events-none"
      style={{ y, zIndex: 2, willChange: 'transform', contain: 'layout style' } as CSSProperties}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: 0.2,
            staggerChildren: 0.06,
          },
        },
      }}
    >
      {shards.map((shard) => (
        <ShardElement key={shard.id} shard={shard} />
      ))}
    </m.div>
  );
}
