"use client";
import React, { useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
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

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            {/* Floating Year Indicator */}
            <motion.div 
                className="sticky top-24 z-20 flex justify-center mb-8 pointer-events-none"
            >
                <div className={cn(
                    "px-6 py-3 rounded-full bg-neutral-900/90 border border-neutral-700 backdrop-blur-md",
                    "transition-all duration-500 shadow-lg shadow-purple-500/20"
                )}>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent transition-all">
                        {currentYear}
                    </span>
                </div>
            </motion.div>

            {/* Progress Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-neutral-800 -translate-x-1/2 rounded-full overflow-hidden origin-top">
                <motion.div
                    className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-500"
                    style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
                />
            </div>

            {/* Timeline Items */}
            <div className="space-y-16 relative perspective-1000">
                {items.map((item, index) => (
                    <TimelineCard
                        key={index}
                        item={item}
                        index={index}
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
    onInView: () => void;
}

const TimelineCard = ({ item, index, onInView }: TimelineCardProps) => {
    const [hoveredAchievement, setHoveredAchievement] = useState<number | null>(null);
    const isLeft = index % 2 === 0;

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
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3, margin: "-100px 0px" }}
            onViewportEnter={onInView}
            className={cn(
                "relative flex items-center gap-8",
                isLeft ? "flex-row" : "flex-row-reverse"
            )}
        >
            {/* Connecting Line Dot */}
            <motion.div 
                className="absolute left-1/2 -translate-x-1/2 z-10"
                variants={{
                    hidden: { scale: 0, opacity: 0 },
                    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
                }}
            >
                <div className="w-5 h-5 rounded-full border-4 bg-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
            </motion.div>

            {/* Card */}
            <motion.div 
                variants={{
                    hidden: { 
                        opacity: 0, 
                        x: isLeft ? -60 : 60,
                        rotateY: isLeft ? -10 : 10,
                        scale: 0.9 
                    },
                    visible: { 
                        opacity: 1, 
                        x: 0, 
                        rotateY: 0, 
                        scale: 1,
                        transition: { type: "spring", stiffness: 100, damping: 20, mass: 1 }
                    }
                }}
                className={cn(
                    "w-[calc(50%-2.5rem)]",
                    isLeft ? "text-right pr-4" : "text-left pl-4"
                )}
            >
                <div className={cn(
                    "relative p-[2px] rounded-2xl",
                    `bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo} overflow-hidden shadow-xl shadow-purple-900/20 hover:shadow-purple-500/40 transition-all duration-300`
                )}>
                    <div className="bg-neutral-900/95 rounded-[14px] p-6 backdrop-blur-md h-full">
                        {/* Year Badge */}
                        <div className={cn(
                            "inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-4",
                            `bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo} text-white`
                        )}>
                            {item.period}
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                            {item.title}
                        </h3>

                        {/* Organization */}
                        <p className="text-neutral-400 font-medium mb-1 text-base">
                            {item.organization}
                            {item.location && <span className="text-neutral-500"> | {item.location}</span>}
                        </p>

                        {/* Grade for Education */}
                        {item.grade && (
                            <p className="text-sm font-semibold text-purple-400 mb-4 mt-2">
                                {item.grade}
                            </p>
                        )}

                        {/* Achievements */}
                        {item.achievements && (
                            <ul className={cn(
                                "space-y-3 mt-6",
                                isLeft ? "text-right" : "text-left"
                            )}>
                                {item.achievements.map((achievement, achIndex) => (
                                    <motion.li
                                        key={achIndex}
                                        variants={{
                                            hidden: { opacity: 0, x: isLeft ? -15 : 15 },
                                            visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 150, damping: 15, delay: achIndex * 0.1 + 0.2 } }
                                        }}
                                        className={cn(
                                            "relative text-sm md:text-base text-neutral-300 leading-relaxed transition-all duration-300",
                                            hoveredAchievement === achIndex && "text-white scale-[1.02]"
                                        )}
                                        onMouseEnter={() => setHoveredAchievement(achIndex)}
                                        onMouseLeave={() => setHoveredAchievement(null)}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: highlightKeywords(achievement, hoveredAchievement === achIndex) }} />
                                    </motion.li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Spacer for opposite side */}
            <div className="w-[calc(50%-2.5rem)]" />
        </motion.div>
    );
};

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
