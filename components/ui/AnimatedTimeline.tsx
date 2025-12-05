"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
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
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const [currentYear, setCurrentYear] = useState(items[0]?.year || "");
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Track scroll progress and visible items
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate overall scroll progress
            const totalHeight = rect.height;
            const scrolled = Math.max(0, windowHeight - rect.top);
            const progress = Math.min(1, Math.max(0, scrolled / (totalHeight + windowHeight * 0.5)));
            setScrollProgress(progress);

            // Check visibility of each item
            const newVisible = new Set<number>();
            let latestVisibleIndex = -1;

            itemRefs.current.forEach((ref, index) => {
                if (ref) {
                    const itemRect = ref.getBoundingClientRect();
                    const itemCenter = itemRect.top + itemRect.height / 2;

                    if (itemCenter < windowHeight * 0.8 && itemCenter > 0) {
                        newVisible.add(index);
                        latestVisibleIndex = index;
                    }
                }
            });

            setVisibleItems(newVisible);

            if (latestVisibleIndex >= 0) {
                setActiveIndex(latestVisibleIndex);
                setCurrentYear(items[latestVisibleIndex].year);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener("scroll", handleScroll);
    }, [items]);

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            {/* Floating Year Indicator - Time Travel Effect */}
            <div className="sticky top-24 z-20 flex justify-center mb-8 pointer-events-none">
                <div className={cn(
                    "px-6 py-3 rounded-full bg-neutral-900/90 border border-neutral-700 backdrop-blur-md",
                    "transition-all duration-500 shadow-lg shadow-purple-500/20"
                )}>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {currentYear}
                    </span>
                </div>
            </div>

            {/* Progress Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-neutral-800 -translate-x-1/2">
                <div
                    className="absolute top-0 left-0 right-0 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-500 transition-all duration-300"
                    style={{ height: `${scrollProgress * 100}%` }}
                />
            </div>

            {/* Timeline Items */}
            <div className="space-y-16 relative">
                {items.map((item, index) => (
                    <TimelineCard
                        key={index}
                        item={item}
                        index={index}
                        isVisible={visibleItems.has(index)}
                        isActive={activeIndex === index}
                        isOlder={index < activeIndex}
                        ref={(el) => { itemRefs.current[index] = el; }}
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
    isVisible: boolean;
    isActive: boolean;
    isOlder: boolean;
}

const TimelineCard = React.forwardRef<HTMLDivElement, TimelineCardProps>(
    ({ item, index, isVisible, isActive, isOlder }, ref) => {
        const [hoveredAchievement, setHoveredAchievement] = useState<number | null>(null);
        const [revealStage, setRevealStage] = useState(0);
        const isLeft = index % 2 === 0;

        // Cause-Effect Sequential Reveal
        useEffect(() => {
            if (isVisible && revealStage < 4) {
                const timers = [
                    setTimeout(() => setRevealStage(1), 100),  // Title
                    setTimeout(() => setRevealStage(2), 300),  // Organization
                    setTimeout(() => setRevealStage(3), 500),  // Period
                    setTimeout(() => setRevealStage(4), 700),  // Achievements
                ];
                return () => timers.forEach(clearTimeout);
            }
        }, [isVisible, revealStage]);

        // Highlight keywords in achievements
        const highlightKeywords = (text: string, isHovered: boolean) => {
            const keywords = ["Proposed", "Designed", "Developed", "Built", "Automated", "Improved", "Optimized", "Created", "Led", "Achieved", "Increased", "Reduced"];
            let result = text;

            keywords.forEach(keyword => {
                const regex = new RegExp(`(${keyword})`, "gi");
                result = result.replace(regex, `<span class="keyword-highlight ${isHovered ? 'active' : ''}">$1</span>`);
            });

            return result;
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex items-center gap-8",
                    isLeft ? "flex-row" : "flex-row-reverse"
                )}
            >
                {/* Connecting Line Dot */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <div className={cn(
                        "w-4 h-4 rounded-full border-4 transition-all duration-500",
                        isVisible
                            ? "bg-white border-purple-500 scale-100 shadow-lg shadow-purple-500/50"
                            : "bg-neutral-800 border-neutral-600 scale-75"
                    )}>
                        {/* Pulse effect when active */}
                        {isActive && (
                            <div className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-50" />
                        )}
                    </div>
                </div>

                {/* Card */}
                <div className={cn(
                    "w-[calc(50%-2rem)] transition-all duration-700",
                    isLeft ? "text-right pr-8" : "text-left pl-8",
                    // Milestone Reveal Animation
                    isVisible
                        ? "opacity-100 translate-y-0"
                        : `opacity-0 ${isLeft ? "translate-x-8" : "-translate-x-8"} translate-y-4`,
                    // Time Travel - Dim older items
                    isOlder && !isActive && "opacity-60 scale-[0.98]",
                    isActive && "scale-100"
                )}>
                    <div className={cn(
                        "relative p-[2px] rounded-2xl transition-all duration-500",
                        isActive
                            ? `bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo} shadow-lg`
                            : "bg-neutral-700"
                    )}>
                        <div className={cn(
                            "bg-neutral-900/95 rounded-2xl p-6 backdrop-blur-md transition-all duration-300",
                            isActive && "bg-neutral-900/90"
                        )}>
                            {/* Year Badge */}
                            <div className={cn(
                                "inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 transition-all duration-500",
                                revealStage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
                                `bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo} text-white`
                            )}>
                                {item.period}
                            </div>

                            {/* Title - Stage 1 */}
                            <h3 className={cn(
                                "text-xl font-bold text-white mb-1 transition-all duration-500",
                                revealStage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            )}>
                                {item.title}
                            </h3>

                            {/* Organization - Stage 2 */}
                            <p className={cn(
                                "text-neutral-400 font-medium mb-1 transition-all duration-500 delay-100",
                                revealStage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            )}>
                                {item.organization}
                                {item.location && <span className="text-neutral-500"> | {item.location}</span>}
                            </p>

                            {/* Grade for Education */}
                            {item.grade && (
                                <p className={cn(
                                    "text-sm text-neutral-500 mb-4 transition-all duration-500 delay-200",
                                    revealStage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                )}>
                                    {item.grade}
                                </p>
                            )}

                            {/* Achievements - Stage 4 with Achievement Spotlight */}
                            {item.achievements && (
                                <ul className={cn(
                                    "space-y-2 mt-4 transition-all duration-500 delay-300",
                                    isLeft ? "text-left" : "text-left",
                                    revealStage >= 4 ? "opacity-100" : "opacity-0"
                                )}>
                                    {item.achievements.map((achievement, achIndex) => (
                                        <li
                                            key={achIndex}
                                            className={cn(
                                                "relative text-sm text-neutral-300 leading-relaxed pl-4 transition-all duration-300",
                                                hoveredAchievement === achIndex && "text-white"
                                            )}
                                            style={{
                                                transitionDelay: `${achIndex * 100 + 400}ms`,
                                                opacity: revealStage >= 4 ? 1 : 0,
                                                transform: revealStage >= 4 ? "translateY(0)" : "translateY(10px)"
                                            }}
                                            onMouseEnter={() => setHoveredAchievement(achIndex)}
                                            onMouseLeave={() => setHoveredAchievement(null)}
                                        >
                                            {/* Bullet Point */}
                                            <span className={cn(
                                                "absolute left-0 top-2 w-1.5 h-1.5 rounded-full transition-all duration-300",
                                                hoveredAchievement === achIndex
                                                    ? "bg-purple-400 scale-150 shadow-lg shadow-purple-500/50"
                                                    : "bg-neutral-500"
                                            )} />

                                            {/* Achievement Text with Keyword Highlighting */}
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: highlightKeywords(achievement, hoveredAchievement === achIndex)
                                                }}
                                            />

                                            {/* Achievement Spotlight Bar */}
                                            <div className={cn(
                                                "absolute -bottom-1 left-4 right-0 h-0.5 rounded-full transition-all duration-500",
                                                "bg-gradient-to-r from-purple-500 to-pink-500",
                                                hoveredAchievement === achIndex ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                                            )}
                                                style={{ transformOrigin: "left" }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Spacer for opposite side */}
                <div className="w-[calc(50%-2rem)]" />
            </div>
        );
    }
);

TimelineCard.displayName = "TimelineCard";

// CSS for keyword highlighting (inject via style tag)
export const TimelineStyles = () => (
    <style jsx global>{`
        .keyword-highlight {
            font-weight: 600;
            color: #c4b5fd;
            transition: all 0.3s ease;
        }
        .keyword-highlight.active {
            color: #a78bfa;
            text-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
        }
    `}</style>
);
