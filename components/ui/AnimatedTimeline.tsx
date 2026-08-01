"use client";
import React, { useRef, useState } from "react";
import { m, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineItem {
    type: "experience" | "education";
    title: string;
    organization: string;
    location?: string;
    period: string;
    year: string;
    achievements?: string[];
    grade?: string;
    gradientFrom: string;
    gradientTo: string;
}

interface AnimatedTimelineProps {
    items: TimelineItem[];
    className?: string;
}

export const AnimatedTimeline = ({ items, className }: AnimatedTimelineProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"],
    });

    const [currentYear, setCurrentYear] = useState(items[0]?.year || "");
    // Single-column mobile timeline reveals cards on much taller boxes than the desktop
    // two-column layout, so the desktop trigger leaves long empty stretches mid-scroll.
    const [isCompact] = useState(
        () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
    );

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            {/* Floating Year Indicator */}
            {/* Floats only from md up. There the cards are half-width and alternate sides, so the
                centred pill hovers in an empty gutter. On mobile the cards are full-width, so a
                floating centre pill would sit permanently on top of the text it is labelling — and
                each card already carries its own period badge, making it redundant there. */}
            <m.div
                className="relative md:sticky md:top-24 z-20 flex justify-center mb-8 md:mb-12 pointer-events-none"
            >
                {/* PERF: backdrop-blur removed — a sticky blurred pill re-filters its backdrop on
                    every scroll frame. The near-opaque navy underlay keeps the same look. */}
                <div className={cn(
                    "relative px-6 py-2 md:px-8 md:py-3 rounded-full border border-white/10",
                    "bg-gradient-to-b from-white/[0.08] to-transparent",
                    "shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-500 overflow-hidden"
                )}>
                    {/* Now that the pill genuinely floats over the cards, the underlay has to be
                        near-opaque or the card text reads straight through it while scrolling. */}
                    <div className="absolute inset-0 bg-[#06090F]/92 rounded-full z-0" />
                    <span className="relative z-10 text-xl md:text-2xl font-extrabold bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent tracking-[0.15em] transition-all drop-shadow-[0_0_15px_rgba(216,180,254,0.4)]">
                        {currentYear}
                    </span>
                </div>
            </m.div>

            {/* Progress Line — left on mobile, center on desktop */}
            <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent md:-translate-x-1/2 origin-top">
                <m.div
                    className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]"
                    style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
                />
            </div>

            {/* Timeline Items */}
            <div className="space-y-10 md:space-y-16 relative perspective-1000">
                {items.map((item, index) => (
                    <TimelineCard
                        key={index}
                        item={item}
                        index={index}
                        isCompact={isCompact}
                        onInView={() => setCurrentYear(item.year)}
                    />
                ))}
            </div>
        </div>
    );
};

// Timeline Card Component
interface TimelineCardProps {
    item: TimelineItem;
    index: number;
    isCompact: boolean;
    onInView: () => void;
}

const TimelineCard = ({ item, index, isCompact, onInView }: TimelineCardProps) => {
    const [hoveredAchievement, setHoveredAchievement] = useState<number | null>(null);
    const isLeft = index % 2 === 0;

    // Highlight keywords in achievements
    const highlightKeywords = (text: string, isHovered: boolean) => {
        const keywords = ["Proposed", "Designed", "Developed", "Built", "Automated", "Improved", "Optimized", "Created", "Led", "Achieved", "Increased", "Reduced"];
        let result = text;
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b(${keyword})\\b`, "gi");
            result = result.replace(regex, `<span class="keyword-highlight ${isHovered ? 'active' : ''}">$1</span>`);
        });
        return result;
    };

    return (
        <m.div
            initial="hidden"
            whileInView="visible"
            // Mobile cards are near-viewport-height, so requiring 30% inside a viewport shrunk by
            // 100px meant a card sat invisible until it was almost centred — a screen of empty
            // background ahead of it. Trigger as soon as its top edge approaches instead.
            viewport={
                isCompact
                    ? { once: true, amount: 0.05, margin: "0px 0px 100px 0px" }
                    : { once: true, amount: 0.3, margin: "-100px 0px" }
            }
            className={cn(
                "relative",
                /* Mobile: single column with left line */
                "pl-12 md:pl-0",
                /* Desktop: alternating left/right */
                "md:flex md:items-center md:gap-8",
                isLeft ? "md:flex-row" : "md:flex-row-reverse"
            )}
        >
            {/* Year tracker — deliberately separate from the reveal above. Driving the year off the
                reveal meant it advanced the moment a card began entering (and, being `once`, never
                went back when scrolling up), so the pill read 2023 while the 2025 card filled the
                screen. This fires only while the card overlaps the viewport's middle band, and
                re-fires in both directions. */}
            <m.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                onViewportEnter={onInView}
                viewport={{ amount: 0, margin: "-45% 0px -45% 0px" }}
            />

            {/* Connecting Line Dot */}
            <m.div 
                className={cn(
                    "absolute z-10",
                    /* Mobile: perfectly aligned to 2px line at left-[19px] (19px line + 1px center = 20px. Dot width is 20px, so left should be 10px to center it) */
                    "left-[10px] top-8",
                    /* Desktop: centered */
                    "md:left-1/2 md:-translate-x-1/2 md:top-auto"
                )}
                variants={{
                    hidden: { scale: 0, opacity: 0 },
                    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
                }}
            >
                <div className="w-5 h-5 rounded-full border-4 bg-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
            </m.div>

            {/* Card */}
            <m.div 
                // Mobile rises instead of sliding in from the side: in a single column the desktop
                // alternating left/right slide reads as cards drifting in from random directions,
                // and the outward one pushed 40px past the viewport edge mid-animation.
                // PERF: no scale — same reasoning as the skill cards. These are text-dense cards;
                // a scaling layer is re-rasterised every frame, a translating one is just moved.
                variants={{
                    hidden: {
                        opacity: 0,
                        x: isCompact ? 0 : isLeft ? -40 : 40,
                        y: isCompact ? 24 : 0,
                    },
                    visible: {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        transition: { type: "spring", stiffness: 100, damping: 20, mass: 1 }
                    }
                }}
                className={cn(
                    /* Mobile: full width */
                    "w-full",
                    /* Desktop: half width with alignment */
                    "md:w-[calc(50%-2.5rem)]",
                    isLeft ? "md:text-right md:pr-4" : "md:text-left md:pl-4"
                )}
            >
                <div className={cn(
                    // PERF: explicit list rather than `transition-all` — these cards are framer-
                    // animated on reveal, and `all` made every inline transform/opacity write
                    // during that animation also drive CSS transitions.
                    "relative p-[1px] rounded-3xl transition-[box-shadow,background-image] duration-500 group/card",
                    "bg-gradient-to-br from-white/10 via-white/5 to-transparent overflow-hidden",
                    "hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:bg-gradient-to-br hover:from-purple-500/30 hover:via-pink-500/10 hover:to-transparent"
                )}>
                    {/* Inner Card Background — PERF: backdrop-blur removed; the card scrolls over the
                        wave canvas, so the blur re-filtered every frame while being ~invisible behind
                        an 80%-opaque fill. Slightly higher opacity preserves the glass look. */}
                    <div className="absolute inset-[1px] bg-[#06090F]/90 rounded-[23px] z-0" />
                    
                    {/* Glowing Orb behind card content */}
                    <div className={cn(
                        "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-20 transition-opacity duration-500 group-hover/card:opacity-40 z-0",
                        `bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo}`
                    )} />

                    <div className="relative z-10 p-5 md:p-6 h-full flex flex-col justify-center text-left">
                        {/* Period Badge */}
                        <div className="flex justify-start mb-4 md:mb-5">
                            <div className={cn(
                                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] md:text-xs font-bold tracking-[0.15em] uppercase",
                                "bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_4px_rgba(255,255,255,0.05)]",
                                "transition-colors duration-500 group-hover/card:border-white/10 group-hover/card:bg-white/[0.05]"
                            )}>
                                <span className={cn(
                                    "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] transition-colors duration-500",
                                    item.type === "experience" ? "bg-purple-400 text-purple-400" : "bg-emerald-400 text-emerald-400"
                                )} />
                                <span className="text-white/80">{item.period}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-1.5 leading-tight tracking-wide drop-shadow-sm">
                            {item.title}
                        </h3>

                        {/* Organization */}
                        <p className="text-neutral-400 font-medium mb-1 text-xs md:text-sm tracking-wide flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                            <span className={cn(
                                "text-transparent bg-clip-text font-bold",
                                `bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo}`
                            )}>
                                {item.organization}
                            </span>
                            {item.location && (
                                <span className="flex items-center gap-1.5">
                                    <span className="hidden md:inline text-neutral-700">•</span>
                                    <span className="text-neutral-500 text-xs">{item.location}</span>
                                </span>
                            )}
                        </p>

                        {/* Grade for Education */}
                        {item.grade && (
                            <p className="text-xs font-semibold tracking-wide text-white/50 mb-3 mt-1.5 inline-flex px-2.5 py-1 bg-white/[0.02] border border-white/[0.05] rounded-lg w-fit">
                                {item.grade}
                            </p>
                        )}

                        {/* Achievements */}
                        {item.achievements && (
                            <div className="mt-4 md:mt-5 pt-4 md:pt-5 border-t border-white/[0.05]">
                                <ul className="space-y-2.5 md:space-y-3 text-left">
                                    {item.achievements.map((achievement, achIndex) => (
                                        <m.li
                                            key={achIndex}
                                            variants={{
                                                hidden: { opacity: 0, x: -10 },
                                                visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 150, damping: 15, delay: achIndex * 0.1 + 0.2 } }
                                            }}
                                            className={cn(
                                                // PERF: `transition-colors`, not `all`. Framer drives opacity+x on this
                                                // element via variants; `all` had CSS transitioning those same inline
                                                // writes on top of framer's own interpolation, every frame of the reveal.
                                                "relative pl-5 text-xs md:text-sm text-neutral-400 leading-relaxed transition-colors duration-300",
                                                hoveredAchievement === achIndex ? "text-white" : ""
                                            )}
                                            onMouseEnter={() => setHoveredAchievement(achIndex)}
                                            onMouseLeave={() => setHoveredAchievement(null)}
                                        >
                                            <span className={cn(
                                                "absolute left-0 top-[0.6em] w-1.5 h-1.5 rounded-full border border-white/20 transition-[transform,border-color,box-shadow] duration-300",
                                                hoveredAchievement === achIndex ? `bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo} border-transparent scale-125 shadow-[0_0_10px_rgba(168,85,247,0.5)]` : "bg-transparent"
                                            )} />
                                            <span dangerouslySetInnerHTML={{ __html: highlightKeywords(achievement, hoveredAchievement === achIndex) }} />
                                        </m.li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </m.div>

            {/* Spacer for opposite side — hidden on mobile */}
            <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
        </m.div>
    );
};

TimelineCard.displayName = "TimelineCard";

// CSS for keyword highlighting (inject via style tag)
export const TimelineStyles = () => (
    <style jsx global>{`
        .keyword-highlight {
            font-weight: 600;
            color: #d8b4fe; /* Purple 300 */
            transition: all 0.3s ease;
        }
        .keyword-highlight.active {
            color: #f0abfc; /* Fuchsia 300 */
            text-shadow: 0 0 15px rgba(240, 171, 252, 0.4);
        }
    `}</style>
);
