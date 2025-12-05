"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Skill {
    name: string;
    icon: string;
    className?: string;
    experience?: string; // e.g., "2 yrs experience"
    projects?: number; // e.g., 4 projects
}

interface SkillCategory {
    title: string;
    skills: Skill[];
    icon: React.ReactNode;
}

interface AnimatedSkillGridProps {
    categories: SkillCategory[];
    className?: string;
}

export const AnimatedSkillGrid = ({ categories, className }: AnimatedSkillGridProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [revealedCategories, setRevealedCategories] = useState<Set<number>>(new Set());

    // Intersection Observer for scroll-triggered reveal
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Staggered category reveal
                    categories.forEach((_, index) => {
                        setTimeout(() => {
                            setRevealedCategories(prev => new Set([...prev, index]));
                        }, index * 200);
                    });
                }
            },
            { threshold: 0.15 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [categories]);

    return (
        <div ref={containerRef} className={cn("grid md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
            {categories.map((category, categoryIndex) => (
                <CategoryCard
                    key={category.title}
                    category={category}
                    categoryIndex={categoryIndex}
                    isRevealed={revealedCategories.has(categoryIndex)}
                    isVisible={isVisible}
                />
            ))}
        </div>
    );
};

// Category Card Component
interface CategoryCardProps {
    category: SkillCategory;
    categoryIndex: number;
    isRevealed: boolean;
    isVisible: boolean;
}

const CategoryCard = ({ category, categoryIndex, isRevealed, isVisible }: CategoryCardProps) => {
    const [activeCategory, setActiveCategory] = useState(false);
    const [proficiencyPulsed, setProficiencyPulsed] = useState(false);

    // Trigger proficiency pulse when revealed
    useEffect(() => {
        if (isRevealed && !proficiencyPulsed) {
            const timer = setTimeout(() => setProficiencyPulsed(true), 300);
            return () => clearTimeout(timer);
        }
    }, [isRevealed, proficiencyPulsed]);

    return (
        <div
            className={cn(
                "group relative p-6 rounded-2xl transition-all duration-500",
                "bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm",
                "hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10",
                // Category Reveal Animation
                isRevealed
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12",
                activeCategory && "border-purple-500/50 bg-neutral-900/80 scale-[1.02]"
            )}
            style={{ transitionDelay: `${categoryIndex * 100}ms` }}
            onMouseEnter={() => setActiveCategory(true)}
            onMouseLeave={() => setActiveCategory(false)}
        >
            {/* Proficiency Pulse Indicator - Ability Pulse Animation */}
            <div className="absolute top-4 right-4">
                <div className={cn(
                    "w-3 h-3 rounded-full transition-all duration-700",
                    proficiencyPulsed
                        ? "bg-green-500 shadow-lg shadow-green-500/50"
                        : "bg-neutral-700"
                )}>
                    {proficiencyPulsed && (
                        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                    )}
                </div>
            </div>

            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                    "p-2.5 rounded-xl transition-all duration-300",
                    "bg-neutral-800 group-hover:bg-gradient-to-br group-hover:from-purple-500/20 group-hover:to-pink-500/20",
                    // Competency Micro-Movement
                    "group-hover:-translate-y-0.5 group-hover:scale-105"
                )}>
                    {category.icon}
                </div>
                <div>
                    <h3 className={cn(
                        "text-lg font-semibold text-white transition-all duration-300",
                        "group-hover:text-purple-300 group-hover:-translate-y-px"
                    )}>
                        {category.title}
                    </h3>
                    {/* Proficiency bar that fills on scroll */}
                    <div className="w-24 h-1 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                        <div
                            className={cn(
                                "h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out",
                            )}
                            style={{ width: proficiencyPulsed ? "100%" : "0%" }}
                        />
                    </div>
                </div>

                {/* Skill count badge */}
                <span className={cn(
                    "ml-auto px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-300",
                    "bg-neutral-800 text-neutral-400",
                    "group-hover:bg-purple-500/20 group-hover:text-purple-300 group-hover:scale-110"
                )}>
                    {category.skills.length}
                </span>
            </div>

            {/* Skills Grid with Staggered Reveal */}
            <div className="grid grid-cols-4 gap-3">
                {category.skills.map((skill, skillIndex) => (
                    <SkillItem
                        key={skill.name}
                        skill={skill}
                        skillIndex={skillIndex}
                        categoryIndex={categoryIndex}
                        isRevealed={isRevealed}
                    />
                ))}
            </div>

            {/* Decorative gradient line on hover */}
            <div className={cn(
                "absolute bottom-0 left-6 right-6 h-0.5 rounded-full transition-all duration-500",
                "bg-gradient-to-r from-transparent via-purple-500 to-transparent",
                activeCategory ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            )} />
        </div>
    );
};

// Individual Skill Item Component
interface SkillItemProps {
    skill: Skill;
    skillIndex: number;
    categoryIndex: number;
    isRevealed: boolean;
}

const SkillItem = ({ skill, skillIndex, categoryIndex, isRevealed }: SkillItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
    const itemRef = useRef<HTMLDivElement>(null);

    // Skill experience data (simulated - you can customize these)
    const skillData: Record<string, { experience: string; projects: number }> = {
        "C++": { experience: "3 yrs", projects: 5 },
        "Python": { experience: "4 yrs", projects: 8 },
        "Java": { experience: "2 yrs", projects: 3 },
        "JavaScript": { experience: "4 yrs", projects: 12 },
        "TypeScript": { experience: "2 yrs", projects: 6 },
        "React": { experience: "3 yrs", projects: 10 },
        "Next.js": { experience: "2 yrs", projects: 5 },
        "Node.js": { experience: "3 yrs", projects: 7 },
        "MongoDB": { experience: "2 yrs", projects: 4 },
        "AWS": { experience: "1 yr", projects: 3 },
        "Docker": { experience: "1 yr", projects: 2 },
        "TensorFlow": { experience: "1 yr", projects: 2 },
        "PyTorch": { experience: "1 yr", projects: 2 },
        "Git": { experience: "4 yrs", projects: 15 },
    };

    const data = skillData[skill.name] || { experience: "1+ yr", projects: 2 };

    // Handle click with ripple effect
    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!itemRef.current) return;

        const rect = itemRef.current.getBoundingClientRect();
        setRipplePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
        setIsClicked(true);
        setShowTooltip(true);

        // Hide tooltip after 1.5 seconds
        setTimeout(() => setShowTooltip(false), 1500);
        // Reset click state
        setTimeout(() => setIsClicked(false), 600);
    }, []);

    return (
        <div
            ref={itemRef}
            className={cn(
                "relative flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-300",
                "hover:bg-neutral-800/80 group/skill",
                // Category Reveal - Staggered skill appearance
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
            style={{
                transitionDelay: `${(categoryIndex * 200) + (skillIndex * 100 + 300)}ms`,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
        >
            {/* Ripple Effect on Click - Skill Interaction Feedback */}
            {isClicked && (
                <div
                    className="absolute rounded-full bg-purple-500/30 animate-ripple pointer-events-none"
                    style={{
                        left: ripplePosition.x - 50,
                        top: ripplePosition.y - 50,
                        width: 100,
                        height: 100,
                    }}
                />
            )}

            {/* Skill Icon with Micro-Movement */}
            <div className={cn(
                "relative w-10 h-10 transition-all duration-300",
                // Competency Micro-Movement
                isHovered && "-translate-y-1 scale-[1.08]"
            )}>
                <Image
                    src={skill.icon}
                    alt={skill.name}
                    fill
                    className={cn(
                        "object-contain transition-all duration-300",
                        skill.className,
                        isHovered && "drop-shadow-lg"
                    )}
                />

                {/* Glow effect on hover */}
                <div className={cn(
                    "absolute inset-0 rounded-full transition-all duration-300",
                    "bg-purple-500/0 blur-xl",
                    isHovered && "bg-purple-500/40"
                )} />
            </div>

            {/* Skill Name with Micro-Movement */}
            <span className={cn(
                "text-xs text-neutral-400 text-center transition-all duration-300",
                // Competency Micro-Movement
                isHovered && "text-white -translate-y-0.5"
            )}>
                {skill.name}
            </span>

            {/* Hover Underline - Micro Animation */}
            <div className={cn(
                "absolute bottom-2 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300",
                "bg-gradient-to-r from-purple-500 to-pink-500",
                isHovered ? "w-8 opacity-100" : "w-0 opacity-0"
            )} />

            {/* Click Tooltip - Skill Interaction Feedback */}
            <div className={cn(
                "absolute -top-16 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
                "px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 shadow-xl",
                showTooltip ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95 pointer-events-none"
            )}>
                <div className="text-center whitespace-nowrap">
                    <div className="text-white font-semibold text-sm">{skill.name}</div>
                    <div className="text-purple-400 text-xs mt-1">{data.experience} experience</div>
                    <div className="text-neutral-400 text-xs">Used in {data.projects} projects</div>
                </div>
                {/* Tooltip Arrow */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-800 border-b border-r border-neutral-700 rotate-45" />
            </div>
        </div>
    );
};

// Add ripple animation to globals or use inline style
export const SkillGridStyles = () => (
    <style jsx global>{`
        @keyframes ripple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
        .animate-ripple {
            animation: ripple 0.6s ease-out forwards;
        }
    `}</style>
);
