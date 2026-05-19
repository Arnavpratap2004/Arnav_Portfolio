"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export const HoverEffect = ({
    items,
    className,
}: {
    items: {
        title: string;
        description?: string;
        skills?: { name: string; icon: string; className?: string }[];
        link?: string;
        icon?: React.ReactNode;
    }[];
    className?: string;
}) => {
    let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
                className
            )}
        >
            {items.map((item, idx) => (
                <div
                    key={item?.title}
                    className="relative group block p-2 h-full w-full"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.span
                                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                                layoutId="hoverBackground"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    transition: { duration: 0.15 },
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.15, delay: 0.2 },
                                }}
                            />
                        )}
                    </AnimatePresence>
                    <Card>
                        <CardTitle icon={item.icon}>{item.title}</CardTitle>
                        <div className="mt-4">
                            {item.skills ? (
                                <div className="grid grid-cols-4 gap-4 mt-4">
                                    {item.skills.map((skill, sIdx) => (
                                        <div key={sIdx} className="flex flex-col items-center justify-center gap-2 group/skill">
                                            <div className="relative w-10 h-10 transition-transform duration-200 group-hover/skill:scale-110">
                                                <Image
                                                    src={skill.icon}
                                                    alt={skill.name}
                                                    fill
                                                    className={cn("object-contain", skill.className)}
                                                />
                                            </div>
                                            <span className="text-[10px] text-neutral-400 mt-1 whitespace-nowrap">
                                                {skill.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <CardDescription>{item.description}</CardDescription>
                            )}
                        </div>
                    </Card>
                </div>
            ))}
        </div>
    );
};

export const Card = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
                className
            )}
        >
            <div className="relative z-50">
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

export const CardTitle = ({
    className,
    children,
    icon,
}: {
    className?: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div className="flex items-center gap-2">
            {icon}
            <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
                {children}
            </h4>
        </div>
    );
};

export const CardDescription = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <p
            className={cn(
                "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
                className
            )}
        >
            {children}
        </p>
    );
};
