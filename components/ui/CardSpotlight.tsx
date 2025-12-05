"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CardSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    radius?: number;
    color?: string;
    className?: string;
}

export const CardSpotlight = ({
    children,
    radius = 350,
    color = "rgba(120, 119, 198, 0.15)",
    className,
    ...props
}: CardSpotlightProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Generate dots pattern on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // Clear canvas
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Draw random dots
        const dotCount = 800;
        for (let i = 0; i < dotCount; i++) {
            const x = Math.random() * rect.width;
            const y = Math.random() * rect.height;
            const size = Math.random() * 1.5 + 0.5;
            const alpha = Math.random() * 0.5 + 0.2;

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(148, 163, 255, ${alpha})`;
            ctx.fill();
        }
    }, []);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!divRef.current) return;

            const div = divRef.current;
            const rect = div.getBoundingClientRect();

            setPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        },
        []
    );

    const handleMouseEnter = useCallback(() => {
        setOpacity(1);
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setOpacity(0);
        setIsHovered(false);
    }, []);

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 p-8",
                className
            )}
            {...props}
        >
            {/* Dots canvas with mask */}
            <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500"
                style={{
                    opacity: isHovered ? 1 : 0,
                    maskImage: `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, black 0%, transparent 70%)`,
                    WebkitMaskImage: `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, black 0%, transparent 70%)`,
                }}
            />

            {/* Glow effect */}
            <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-500"
                style={{
                    opacity,
                    background: `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, ${color}, transparent 50%)`,
                }}
            />

            {children}
        </div>
    );
};
