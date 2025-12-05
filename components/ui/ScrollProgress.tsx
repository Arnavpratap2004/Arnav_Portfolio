"use client";
import React, { useEffect, useState, useRef } from "react";

export const ScrollProgress = () => {
    const [progress, setProgress] = useState(0);
    const ticking = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    const scrollTop = window.scrollY;
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                    setProgress(scrollPercent);
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-neutral-900/50">
            <div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
                style={{
                    width: `${progress}%`,
                    willChange: 'width'
                }}
            />
        </div>
    );
};

