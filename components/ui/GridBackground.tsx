"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GridBackgroundProps {
    className?: string;
    children?: React.ReactNode;
}

export const GridBackground = ({ className, children }: GridBackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            // Use viewport dimensions instead of bounding rect for full coverage
            const width = window.innerWidth;
            const height = canvas.parentElement?.offsetHeight || window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        };

        resize();
        window.addEventListener("resize", resize);

        // Floating particles - more particles for wider coverage
        const particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            opacity: number;
        }> = [];

        const particleCount = 80; // Increased for full viewport coverage
        const width = window.innerWidth;
        const height = canvas.parentElement?.offsetHeight || window.innerHeight;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2.5 + 1,
                opacity: Math.random() * 0.5 + 0.2,
            });
        }

        const animate = () => {
            const width = window.innerWidth;
            const height = canvas.parentElement?.offsetHeight || window.innerHeight;
            ctx.clearRect(0, 0, width, height);

            time += 0.01;

            // Draw grid lines
            ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
            ctx.lineWidth = 1;

            const gridSize = 60;
            const offset = (time * 10) % gridSize;

            // Vertical lines
            for (let x = -gridSize + offset; x < width + gridSize; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal lines
            for (let y = -gridSize + offset; y < height + gridSize; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Draw and update particles
            particles.forEach((particle) => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Wrap around edges
                if (particle.x < 0) particle.x = width;
                if (particle.x > width) particle.x = 0;
                if (particle.y < 0) particle.y = height;
                if (particle.y > height) particle.y = 0;

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(147, 112, 219, ${particle.opacity})`;
                ctx.fill();
            });

            // Draw connecting lines between nearby particles
            ctx.strokeStyle = "rgba(147, 112, 219, 0.1)";
            ctx.lineWidth = 0.5;

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        const opacity = (1 - distance / 150) * 0.2;
                        ctx.strokeStyle = `rgba(147, 112, 219, ${opacity})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw glowing orbs
            const gradient1 = ctx.createRadialGradient(
                width * 0.2 + Math.sin(time) * 50,
                height * 0.3 + Math.cos(time * 0.7) * 30,
                0,
                width * 0.2 + Math.sin(time) * 50,
                height * 0.3 + Math.cos(time * 0.7) * 30,
                200
            );
            gradient1.addColorStop(0, "rgba(99, 102, 241, 0.15)");
            gradient1.addColorStop(1, "transparent");
            ctx.fillStyle = gradient1;
            ctx.fillRect(0, 0, width, height);

            const gradient2 = ctx.createRadialGradient(
                width * 0.8 + Math.cos(time * 0.8) * 40,
                height * 0.7 + Math.sin(time * 0.6) * 40,
                0,
                width * 0.8 + Math.cos(time * 0.8) * 40,
                height * 0.7 + Math.sin(time * 0.6) * 40,
                250
            );
            gradient2.addColorStop(0, "rgba(168, 85, 247, 0.12)");
            gradient2.addColorStop(1, "transparent");
            ctx.fillStyle = gradient2;
            ctx.fillRect(0, 0, width, height);

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className={cn("relative w-full", className)}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ background: "transparent" }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
};
