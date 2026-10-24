"use client";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface VortexPanelProps {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    techStack: string[];
    highlight: string;
    projectLink: string;
    badge?: string;
    className?: string;
    priority?: boolean;
    /** Depth of the slab in px. 0 would render the old infinitely thin plane. */
    thickness?: number;
}

const RADIUS = 18;

/**
 * The card as it appears inside the vortex: a wide, image-forward glass panel with real physical
 * THICKNESS rather than an infinitely thin plane.
 *
 * A plane has no edge, so it collapses to nothing as it turns side-on and the vortex reads as
 * floating images rather than objects. Depth means building an actual box in 3D: the artwork is
 * the front face at z = 0, a back plate sits at z = -thickness, and four side faces bridge them by
 * being hinged along one edge of the front face and swung 90deg out of the card plane. Turned
 * edge-on you now see a solid lit edge.
 *
 * Side faces are inset by the corner radius so they span only the straight part of each side. A
 * square strip cannot follow a rounded corner, and without the inset it juts past the silhouette.
 *
 * The back plate earns its place twice: it is the far wall of the box, and because it sits nearer
 * the viewer once a card passes 90deg, it also hides the front face's mirrored text.
 *
 * Detail (chips, description) stays in the DOM at opacity 0 and rises on hover/focus, so the
 * resting composition stays sparse while the text remains selectable, indexable and available to
 * screen readers, and the whole front face is a real anchor rather than a click handler.
 */
export const VortexPanel = React.memo(function VortexPanel({
    title, description, imageSrc, imageAlt, techStack, highlight, projectLink, badge, className,
    priority, thickness = 16,
}: VortexPanelProps) {
    // Light rakes across the edge rather than lighting it evenly: a flat fill reads as a printed
    // border, a gradient reads as a material catching light.
    const edgeSide =
        "linear-gradient(180deg, rgba(214,225,240,0.62) 0%, rgba(148,163,184,0.30) 38%, rgba(10,16,26,0.72) 100%)";
    const edgeCap =
        "linear-gradient(90deg, rgba(214,225,240,0.55) 0%, rgba(148,163,184,0.26) 42%, rgba(10,16,26,0.70) 100%)";

    return (
        <div
            className={cn("relative w-full aspect-[16/10]", className)}
            style={{ transformStyle: "preserve-3d" }}
        >
            {/* Far wall of the slab. */}
            <div
                aria-hidden="true"
                className="absolute inset-0 rounded-[18px]"
                style={{
                    transform: `translateZ(${-thickness}px)`,
                    background: "linear-gradient(160deg, #141c29 0%, #090d15 100%)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
                }}
            />

            {/* Four side faces, each hinged on one edge of the front face and swung back so it
                spans exactly the gap between front face and back plate. */}
            <div
                aria-hidden="true"
                className="absolute left-0"
                style={{
                    top: RADIUS,
                    height: `calc(100% - ${RADIUS * 2}px)`,
                    width: thickness,
                    transformOrigin: "left center",
                    transform: "rotateY(90deg)",
                    background: edgeSide,
                }}
            />
            <div
                aria-hidden="true"
                className="absolute right-0"
                style={{
                    top: RADIUS,
                    height: `calc(100% - ${RADIUS * 2}px)`,
                    width: thickness,
                    transformOrigin: "right center",
                    transform: "rotateY(-90deg)",
                    background: edgeSide,
                }}
            />
            <div
                aria-hidden="true"
                className="absolute top-0"
                style={{
                    left: RADIUS,
                    width: `calc(100% - ${RADIUS * 2}px)`,
                    height: thickness,
                    transformOrigin: "center top",
                    transform: "rotateX(-90deg)",
                    background: edgeCap,
                }}
            />
            <div
                aria-hidden="true"
                className="absolute bottom-0"
                style={{
                    left: RADIUS,
                    width: `calc(100% - ${RADIUS * 2}px)`,
                    height: thickness,
                    transformOrigin: "center bottom",
                    transform: "rotateX(90deg)",
                    background: edgeCap,
                }}
            />

            {/* Front face. */}
            <a
                href={projectLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} — open on GitHub`}
                className="group absolute inset-0 block overflow-hidden rounded-[18px] outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                // PERF: the front face repaints on hover; containment stops that escaping into the
                // sibling panels sharing the 3D stage.
                style={{ contain: "layout style paint" }}
            >
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 767px) 80vw, 560px"
                    priority={priority}
                    className="object-cover opacity-[0.92] transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />

                {/* Legibility wash, heaviest at the bottom where the title sits. */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50" />

                {/* Glass rim: a hairline light edge keeps overlapping panels readable as separate
                    objects against a dark scene. */}
                <div className="absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/15" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

                {badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-200/90 ring-1 ring-inset ring-cyan-300/25">
                        {badge}
                    </span>
                )}

                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <span className="mb-2 inline-block rounded-full bg-fuchsia-500/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-fuchsia-200 ring-1 ring-inset ring-fuchsia-300/30">
                        {highlight}
                    </span>

                    <h3 className="text-xl md:text-[27px] font-bold leading-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]">
                        {title}
                    </h3>

                    <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 ease-out group-hover:max-h-52 group-hover:opacity-100 group-focus-visible:max-h-52 group-focus-visible:opacity-100">
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {techStack.map((tech) => (
                                <span key={tech} className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-neutral-200 ring-1 ring-inset ring-white/10">
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <p className="mt-2.5 line-clamp-3 text-[13px] leading-relaxed text-neutral-300">
                            {description}
                        </p>
                    </div>
                </div>
            </a>
        </div>
    );
});
