"use client";
import React, { useState, useEffect, useRef } from "react";
import {
    m,
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
    const visibleRef = useRef(false);
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

        // Use IntersectionObserver for "Home" state instead of scroll listener
        // Fires only on hero enter/exit â€” zero cost during scroll
        const heroElement = document.querySelector('section');
        let heroObserver: IntersectionObserver | null = null;
        if (heroElement) {
            heroObserver = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection("/");
                    }
                },
                { threshold: 0.1 }
            );
            heroObserver.observe(heroElement);
        }

        return () => {
            observer.disconnect();
            heroObserver?.disconnect();
        };
    }, [navItems]);

    useMotionValueEvent(scrollYProgress, "change", (current) => {
        // Check if current is not undefined and is a number
        if (typeof current === "number") {
            const direction = current - (scrollYProgress.getPrevious() ?? current);
            const nextVisible = scrollYProgress.get() >= 0.05 && direction < 0;

            // PERF: Avoid redundant React state updates on every scroll tick when nav visibility is unchanged.
            if (visibleRef.current !== nextVisible) {
                visibleRef.current = nextVisible;
                setVisible(nextVisible);
            }
        }
    });

    return (
        <>
            <m.div
                layout={false}
                initial={{
                    opacity: 1,
                    y: -100,
                }}
                animate={{
                    y: visible ? 0 : -100,
                    opacity: visible ? 1 : 0,
                }}
                transition={{
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                }}
                style={{ willChange: "transform, opacity" }}
                className={cn(
                    // True glass: translucent navy + backdrop blur/saturate (small fixed strip, so the
                    // per-frame filter cost is bounded — same tradeoff as the footer's backdrop-blur-xl).
                    "flex max-w-fit fixed top-8 inset-x-0 mx-auto z-[5000] items-center gap-0.5 sm:gap-1",
                    "rounded-full border border-white/10 bg-[#0A0E17]/60 backdrop-blur-xl backdrop-saturate-150",
                    "px-2 py-1.5 sm:px-2.5 sm:py-2",
                    "shadow-[0_12px_40px_rgba(3,6,16,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]",
                    className
                )}
            >
                {/* Top hairline sheen */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                {/* Monogram */}
                <Link
                    href="/"
                    aria-label="Back to top"
                    className="hidden sm:flex items-center pl-0.5 pr-1.5"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#6B48FF] to-[#D896FF] text-[12px] font-extrabold tracking-tight text-white shadow-[0_0_16px_rgba(107,72,255,0.45)] transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(107,72,255,0.7)]">
                        AP
                    </span>
                </Link>
                <span aria-hidden="true" className="hidden sm:block h-5 w-px bg-white/10" />

                {navItems.map((navItem, idx) => {
                    const isActive = activeSection === navItem.link;
                    return (
                        <Link
                            key={`link=${idx}`}
                            href={navItem.link}
                            className={cn(
                                "relative items-center justify-center flex rounded-full min-h-11 min-w-11 px-2 sm:min-h-0 sm:min-w-0 sm:px-4 py-2 transition-colors duration-200",
                                isActive
                                    ? "text-white"
                                    : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                            )}
                        >
                            {isActive && (
                                <m.span
                                    layoutId="activePill"
                                    className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.07] shadow-[inset_0_0_16px_rgba(107,72,255,0.18)]"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                >
                                    <span className="absolute left-0 right-0 bottom-0 flex justify-center">
                                        <span className="w-1/2 h-px bg-gradient-to-r from-transparent via-[#9B70FF] to-transparent" />
                                    </span>
                                </m.span>
                            )}
                            {/* Show icon on mobile if available, otherwise show shortened text */}
                            <span className="relative z-10 block sm:hidden">
                                {navItem.icon || <span className="text-[10px] font-semibold uppercase tracking-[0.08em]">{navItem.name.slice(0, 3)}</span>}
                            </span>
                            <span className="relative z-10 hidden sm:block text-sm font-medium tracking-tight">{navItem.name}</span>
                        </Link>
                    );
                })}

                <span aria-hidden="true" className="hidden sm:block h-5 w-px bg-white/10 mx-1" />

                <a
                    href="/Arnav_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex min-h-11 items-center text-xs sm:text-sm font-medium px-3 sm:min-h-0 sm:px-5 py-2 sm:py-2.5 rounded-full transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-[0.98]"
                    title="View my resume"
                >
                    {/* Gradient border background — the site's signature purple ramp */}
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6B48FF] via-[#9B70FF] to-[#D896FF] opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Inner background */}
                    <span className="absolute inset-[1.5px] rounded-full bg-[#0A0E17]/95 group-hover:bg-[#0A0E17]/85 transition-colors duration-300" />

                    {/* Glow effect on hover */}
                    <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md bg-gradient-to-r from-[#6B48FF]/30 via-[#9B70FF]/30 to-[#D896FF]/30" />

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
                    <span className="absolute inset-x-0 w-2/3 mx-auto -bottom-px bg-gradient-to-r from-transparent via-[#9B70FF] to-transparent h-px opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
            </m.div>
        </>
    );
};
