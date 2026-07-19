"use client";
import React, { useEffect, useRef } from "react";

export const ScrollProgress = () => {
    const progressRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const maxScrollRef = useRef(1);

    useEffect(() => {
        const updateMaxScroll = () => {
            // PERF: Cache document height outside the scroll hot path to avoid forced layout work per wheel frame.
            maxScrollRef.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        };

        const writeProgress = () => {
            rafRef.current = null;
            const scrollPercent = window.scrollY / maxScrollRef.current;
            if (progressRef.current) {
                // PERF: Write the transform directly so scroll progress does not trigger a React render every frame.
                progressRef.current.style.transform = `scaleX(${scrollPercent})`;
            }
        };

        const scheduleProgress = () => {
            if (rafRef.current !== null) return;
            rafRef.current = window.requestAnimationFrame(writeProgress);
        };

        const handleResize = () => {
            if (resizeTimeoutRef.current !== null) clearTimeout(resizeTimeoutRef.current);
            resizeTimeoutRef.current = setTimeout(() => {
                updateMaxScroll();
                scheduleProgress();
            }, 150);
        };

        updateMaxScroll();
        scheduleProgress();

        window.addEventListener("scroll", scheduleProgress, { passive: true });
        window.addEventListener("resize", handleResize, { passive: true });
        return () => {
            window.removeEventListener("scroll", scheduleProgress);
            window.removeEventListener("resize", handleResize);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            if (resizeTimeoutRef.current !== null) clearTimeout(resizeTimeoutRef.current);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-neutral-900/50">
            <div
                ref={progressRef}
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 origin-left"
                style={{
                    transform: "scaleX(0)",
                    willChange: 'transform',
                }}
            />
        </div>
    );
};