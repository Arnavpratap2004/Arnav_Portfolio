"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "absolute top-0 left-0 w-full h-full bg-neutral-950 overflow-hidden",
                className
            )}
        >
            <div className="absolute inset-0 bg-neutral-950 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-neutral-950 rounded-full opacity-50 blur-[100px] animate-pulse" />
            {/* Simplified beams for performance and reliability */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_50%)]" />
        </div>
    );
};
