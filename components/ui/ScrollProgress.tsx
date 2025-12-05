"use client";
import React, { useEffect, useState } from "react";

export const ScrollProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(scrollPercent);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-neutral-900/50 backdrop-blur-sm">
            <div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
            {/* Glow effect */}
            <div
                className="absolute top-0 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 blur-sm opacity-60 transition-all duration-150"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};
