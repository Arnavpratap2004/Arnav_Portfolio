"use client";
import React, { useEffect, useRef } from "react";

export const ScrollProgress = () => {
    const progressRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const dimensionsRafRef = useRef<number | null>(null);
    const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const maxScrollRef = useRef(1);

    useEffect(() => {
        const updateMaxScroll = () => {
            // PERF: Cache document height outside the scroll hot path to avoid forced layout work per wheel frame.
            maxScrollRef.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        };

        const writeProgress = () => {
            rafRef.current = null;
            const scrollPercent = Math.min(1, Math.max(0, window.scrollY / maxScrollRef.current));
            if (progressRef.current) {
                // PERF: Write the transform directly so scroll progress does not trigger a React render every frame.
                progressRef.current.style.transform = `scaleX(${scrollPercent})`;
            }
        };

        const scheduleProgress = () => {
            if (rafRef.current !== null) return;
            rafRef.current = window.requestAnimationFrame(writeProgress);
        };

        const scheduleDimensionRefresh = () => {
            if (dimensionsRafRef.current !== null) return;
            dimensionsRafRef.current = window.requestAnimationFrame(() => {
                dimensionsRafRef.current = null;
                updateMaxScroll();
                scheduleProgress();
            });
        };

        const handleResize = () => {
            if (resizeTimeoutRef.current !== null) clearTimeout(resizeTimeoutRef.current);
            resizeTimeoutRef.current = setTimeout(() => {
                scheduleDimensionRefresh();
            }, 150);
        };

        // Below-the-fold sections are mounted lazily, so the document height can grow well after
        // the first measurement. Keep the progress bar tied to the real page height without
        // reading scrollHeight on every scroll frame.
        const resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(scheduleDimensionRefresh) : null;
        resizeObserver?.observe(document.documentElement);
        resizeObserver?.observe(document.body);

        const mutationObserver = typeof MutationObserver === "function" ? new MutationObserver(scheduleDimensionRefresh) : null;
        mutationObserver?.observe(document.body, { childList: true, subtree: true });

        updateMaxScroll();
        scheduleProgress();

        window.addEventListener("scroll", scheduleProgress, { passive: true });
        window.addEventListener("resize", handleResize, { passive: true });
        return () => {
            window.removeEventListener("scroll", scheduleProgress);
            window.removeEventListener("resize", handleResize);
            resizeObserver?.disconnect();
            mutationObserver?.disconnect();
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            if (dimensionsRafRef.current !== null) cancelAnimationFrame(dimensionsRafRef.current);
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
