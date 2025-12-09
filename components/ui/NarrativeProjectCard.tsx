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
    highlight: string; // e.g., "95% Accuracy", "10k+ Users"
    projectLink: string;
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

    // Magnetic button effect
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMousePosition({ x, y });

        // Calculate tilt based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        setCursorPosition({ x: rotateY, y: rotateX });
    }, []);

    const handleMouseEnter = () => {
        setIsHovered(true);
        // More revealing on hover
        setLayer2Visible(true);
        setLayer3Visible(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setCursorPosition({ x: 0, y: 0 });
    };

    // Typing animation for description
    const [typedText, setTypedText] = useState("");
    useEffect(() => {
        if (isHovered && layer3Visible) {
            setTypedText("");
            const text = description.slice(0, 60) + "...";
            let i = 0;
            const interval = setInterval(() => {
                if (i < text.length) {
                    setTypedText(text.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 15);
            return () => clearInterval(interval);
        }
    }, [isHovered, layer3Visible, description]);

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
                    "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500",
                    "text-white text-sm font-bold shadow-lg shadow-orange-500/50",
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
                isHovered && "border-purple-500/50 shadow-2xl shadow-purple-500/20"
            )}>
                {/* Magnetic Glow Effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
                    }}
                />

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
                        className={cn(
                            "object-cover transition-all duration-700",
                            isHovered ? "scale-110 brightness-75" : "scale-100 brightness-100"
                        )}
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
                                Click to explore
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-4">
                    {/* Layer 1: Title - First to appear */}
                    <h3 className={cn(
                        "text-xl font-bold text-white",
                        "transition-all duration-500",
                        layer1Visible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4",
                        // Micro-moment: subtle shift on hover
                        isHovered && "translate-x-1"
                    )}>
                        {title}
                    </h3>

                    {/* Layer 2: Tech Stack Tags - Second to appear */}
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
                                    // Micro-moment: bounce effect on hover
                                    isHovered && "hover:scale-105 hover:-translate-y-0.5 hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-purple-300"
                                )}
                                style={{
                                    transitionDelay: `${index * 50}ms`,
                                    transform: isHovered ? `translateY(${Math.sin(Date.now() / 500 + index) * 2}px)` : "translateY(0)"
                                }}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Layer 3: Description - Third to appear with typing effect */}
                    <div className={cn(
                        "transition-all duration-500 delay-200",
                        layer3Visible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                    )}>
                        <p className="text-neutral-400 text-sm leading-relaxed min-h-[3rem]">
                            {isHovered ? (
                                <span>
                                    {typedText}
                                    <span className="animate-pulse">|</span>
                                </span>
                            ) : (
                                description.slice(0, 80) + "..."
                            )}
                        </p>
                    </div>

                    {/* Magnetic CTA Button */}
                    <div className={cn(
                        "pt-2 transition-all duration-500 delay-300",
                        layer3Visible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                    )}>
                        <a
                            href={projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold",
                                "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
                                "overflow-hidden group/btn",
                                "transition-all duration-300",
                                "hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105",
                                // Magnetic pull effect
                                isHovered && "translate-x-1"
                            )}
                            style={{
                                transform: isHovered
                                    ? `translate(${(mousePosition.x - 150) / 30}px, ${(mousePosition.y - 200) / 50}px)`
                                    : "translate(0, 0)",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="relative z-10">View Project</span>
                            <svg className="relative z-10 w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        </a>
                    </div>
                </div>

                {/* Progress bar that fills on scroll visibility */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800">
                    <div
                        className={cn(
                            "h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500",
                            "transition-all duration-1000 ease-out"
                        )}
                        style={{ width: isVisible ? "100%" : "0%" }}
                    />
                </div>
            </div>
        </div>
    );
};
