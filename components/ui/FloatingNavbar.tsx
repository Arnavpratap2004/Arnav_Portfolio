"use client";
import React, { useState, useEffect } from "react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const FloatingNav = ({
    navItems,
    className,
}: {
    navItems: {
        name: string;
        link: string;
        icon?: React.ReactNode;
    }[];
    className?: string;
}) => {
    const { scrollYProgress } = useScroll();

    const [visible, setVisible] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("/");

    // Track active section based on scroll position
    useEffect(() => {
        const sectionIds = navItems
            .map((item) => item.link)
            .filter((link) => link.startsWith("#"))
            .map((link) => link.substring(1));

        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -60% 0px",
            threshold: 0,
        };

        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(`#${entry.target.id}`);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        // Handle scroll to top for "Home" - throttled for 120Hz smoothness
        let scrollThrottled = false;
        const handleScroll = () => {
            if (scrollThrottled) return;
            scrollThrottled = true;

            requestAnimationFrame(() => {
                if (window.scrollY < 100) {
                    setActiveSection("/");
                }
                scrollThrottled = false;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
        };
    }, [navItems]);

    useMotionValueEvent(scrollYProgress, "change", (current) => {
        // Check if current is not undefined and is a number
        if (typeof current === "number") {
            let direction = current! - scrollYProgress.getPrevious()!;

            if (scrollYProgress.get() < 0.05) {
                setVisible(false);
            } else {
                if (direction < 0) {
                    setVisible(true);
                } else {
                    setVisible(false);
                }
            }
        }
    });

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{
                    opacity: 1,
                    y: -100,
                }}
                animate={{
                    y: visible ? 0 : -100,
                    opacity: visible ? 1 : 0,
                }}
                transition={{
                    duration: 0.2,
                }}
                className={cn(
                    "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-white/[0.2] rounded-full bg-black/50 backdrop-blur-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-2 sm:pl-8 sm:pr-2 py-2 items-center justify-center space-x-1 sm:space-x-4",
                    className
                )}
            >
                {navItems.map((navItem: any, idx: number) => {
                    const isActive = activeSection === navItem.link;
                    return (
                        <Link
                            key={`link=${idx}`}
                            href={navItem.link}
                            className={cn(
                                "relative items-center flex space-x-1 px-2 sm:px-4 py-2 transition-colors duration-200",
                                isActive
                                    ? "text-white"
                                    : "text-neutral-400 hover:text-neutral-200"
                            )}
                        >
                            {isActive && (
                                <motion.span
                                    layoutId="activePill"
                                    className="absolute inset-0 border border-neutral-200 dark:border-white/[0.2] rounded-full bg-black/20"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                >
                                    <span className="absolute left-0 right-0 bottom-0 flex justify-center">
                                        <span className="w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                                    </span>
                                </motion.span>
                            )}
                            {/* Show icon on mobile if available, otherwise show shortened text */}
                            <span className="relative z-10 block sm:hidden">
                                {navItem.icon || <span className="text-xs font-medium">{navItem.name.slice(0, 3)}</span>}
                            </span>
                            <span className="relative z-10 hidden sm:block text-sm font-medium tracking-tight">{navItem.name}</span>
                        </Link>
                    );
                })}
                <a
                    href="https://drive.google.com/file/d/1vmWpALCPCccujC0YsqJK0LZgpsu9aFDi/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative text-xs sm:text-sm font-medium px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.98]"
                    title="View my updated resume"
                >
                    {/* Gradient border background */}
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Inner background */}
                    <span className="absolute inset-[1px] rounded-full bg-black/90 group-hover:bg-black/80 transition-colors duration-300" />

                    {/* Glow effect on hover */}
                    <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30" />

                    {/* Content */}
                    <span className="relative z-10 flex items-center gap-1 sm:gap-1.5 text-white whitespace-nowrap">
                        <span className="hidden sm:inline">View Resume</span>
                        <span className="sm:hidden">Resume</span>
                        <svg
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </span>

                    {/* Bottom glow accent */}
                    <span className="absolute inset-x-0 w-2/3 mx-auto -bottom-px bg-gradient-to-r from-transparent via-purple-500 to-transparent h-px opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
            </motion.div>
        </AnimatePresence>
    );
};
