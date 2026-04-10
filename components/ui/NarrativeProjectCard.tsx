"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NarrativeProjectCardProps {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    techStack: string[];
    highlight: string;
    projectLink: string;
    liveLink?: string;
    badge?: string;
    className?: string;
}

export const NarrativeProjectCard = ({
    title,
    description,
    imageSrc,
    imageAlt,
    techStack,
    highlight,
    projectLink,
    liveLink,
    badge,
    className,
}: NarrativeProjectCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showHighlight, setShowHighlight] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

    // Progressive discovery layers
    const [layer1Visible, setLayer1Visible] = useState(false);
    const [layer2Visible, setLayer2Visible] = useState(false);
    const [layer3Visible, setLayer3Visible] = useState(false);

    // Intersection Observer for scroll-based visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Trigger highlight animation
                    setShowHighlight(true);
                    setTimeout(() => setShowHighlight(false), 2000);

                    // Progressive reveal on scroll
                    setTimeout(() => setLayer1Visible(true), 100);
                    setTimeout(() => setLayer2Visible(true), 400);
                    setTimeout(() => setLayer3Visible(true), 700);
                }
            },
            { threshold: 0.3 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // RAF reference for throttling
    const rafRef = useRef<number | null>(null);

    // Magnetic button effect - throttled with requestAnimationFrame for 120Hz smoothness
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
            if (!cardRef.current) return;

            const rect = cardRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setMousePosition({ x, y });

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            setCursorPosition({ x: rotateY, y: rotateX });
        });
    }, []);

    // Cleanup RAF on unmount
    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    const handleMouseEnter = () => {
        setIsHovered(true);
        setLayer2Visible(true);
        setLayer3Visible(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setCursorPosition({ x: 0, y: 0 });
    };

    return (
        <div
            ref={cardRef}
            className={cn(
                "relative group cursor-pointer",
                className
            )}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: isHovered
                    ? `perspective(1000px) rotateX(${cursorPosition.y}deg) rotateY(${cursorPosition.x}deg) scale(1.02)`
                    : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
                transition: "transform 0.3s ease-out",
            }}
        >
            {/* Highlight Flash Animation */}
            <div
                className={cn(
                    "absolute -top-2 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full",
                    "bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-400",
                    "text-white text-sm font-bold shadow-lg shadow-teal-500/50",
                    "transition-all duration-500",
                    showHighlight
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 -translate-y-4 scale-90"
                )}
            >
                <span className="animate-pulse">{highlight}</span>
            </div>

            {/* Card Container */}
            <div className={cn(
                "relative overflow-hidden rounded-2xl",
                "bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800",
                "border border-neutral-700/50",
                "transition-all duration-500",
                isHovered && "border-teal-500/50 shadow-2xl shadow-teal-500/20"
            )}>
                {/* Magnetic Glow Effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 245, 212, 0.12), transparent 40%)`,
                    }}
                />

                {/* Badge */}
                {badge && (
                    <div className="absolute top-3 right-3 z-20">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white shadow-lg backdrop-blur-sm">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {badge}
                        </span>
                    </div>
                )}

                {/* Image with Reveal Effect */}
                <div className={cn(
                    "relative h-48 overflow-hidden",
                    "transition-all duration-700",
                    isVisible ? "opacity-100" : "opacity-0"
                )}>
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        loading="lazy"
                        className={cn(
                            "object-cover transition-all duration-700",
                            isHovered ? "scale-110 brightness-75" : "scale-100 brightness-100"
                        )}
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Image Overlay with Progressive Discovery */}
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent",
                        "transition-opacity duration-500",
                        isHovered ? "opacity-90" : "opacity-60"
                    )} />

                    {/* Layer 3: Preview Highlight on Hover */}
                    <div className={cn(
                        "absolute inset-0 flex items-center justify-center",
                        "transition-all duration-500",
                        isHovered && layer3Visible ? "opacity-100" : "opacity-0"
                    )}>
                        <div className="text-center px-4">
                            <div className="text-2xl font-bold text-white mb-2 animate-pulse">
                                {highlight}
                            </div>
                            <div className="text-sm text-neutral-300">
                                View on GitHub →
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-4">
                    {/* Layer 1: Title */}
                    <h3 className={cn(
                        "text-xl font-bold text-white",
                        "transition-all duration-500",
                        layer1Visible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4",
                        isHovered && "translate-x-1"
                    )}>
                        {title}
                    </h3>

                    {/* Layer 2: Tech Stack Tags */}
                    <div className={cn(
                        "flex flex-wrap gap-2",
                        "transition-all duration-500 delay-100",
                        layer2Visible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                    )}>
                        {techStack.map((tech, index) => (
                            <span
                                key={tech}
                                className={cn(
                                    "px-3 py-1 text-xs font-medium rounded-full",
                                    "bg-neutral-800 text-neutral-300 border border-neutral-700",
                                    "transition-all duration-300",
                                    isHovered && "hover:scale-105 hover:-translate-y-0.5 hover:bg-teal-500/20 hover:border-teal-500/50 hover:text-teal-300"
                                )}
                                style={{
                                    transitionDelay: `${index * 50}ms`,
                                }}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Layer 3: Full Description */}
                    <div className={cn(
                        "transition-all duration-500 delay-200",
                        layer3Visible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                    )}>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Dual CTA Buttons */}
                    <div className={cn(
                        "pt-2 flex flex-wrap items-center gap-3 transition-all duration-500 delay-300",
                        layer3Visible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                    )}>
                        {/* GitHub Button */}
                        <a
                            href={projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold",
                                "bg-gradient-to-r from-teal-600 to-cyan-600 text-white",
                                "overflow-hidden group/btn",
                                "transition-all duration-300",
                                "hover:shadow-lg hover:shadow-teal-500/30 hover:scale-105",
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            <span>GitHub</span>
                        </a>

                        {/* Live Demo Button (if available) */}
                        {liveLink && (
                            <a
                                href={liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold",
                                    "border border-white/20 text-white bg-white/5",
                                    "transition-all duration-300",
                                    "hover:border-teal-500/50 hover:bg-white/10 hover:scale-105",
                                )}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <span>Live Demo</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Progress bar that fills on scroll visibility */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800">
                    <div
                        className={cn(
                            "h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-300",
                            "transition-all duration-1000 ease-out"
                        )}
                        style={{ width: isVisible ? "100%" : "0%" }}
                    />
                </div>
            </div>
        </div>
    );
};
