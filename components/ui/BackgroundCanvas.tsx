"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface BackgroundCanvasProps {
    className?: string;
}

export function BackgroundCanvas({ className }: BackgroundCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        // Respect reduced motion preference
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            ctx.fillStyle = "#050a14"; // Dark background fallback
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            return;
        }

        let animationFrameId: number;
        let isVisible = true;
        let particles: Particle[] = [];

        // Determine particle count based on screen size (rough proxy for performance)
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 40 : 100;

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                // Slower, smoother movement
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.size = Math.random() * 2 + 0.5;
                
                // Tech-themed colors (teal, purple, blue)
                const colors = [
                    "rgba(0, 245, 212, 0.4)",  // Teal
                    "rgba(139, 92, 246, 0.3)", // Purple
                    "rgba(100, 220, 255, 0.3)" // Blue
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around edges for a seamless infinite feel
                if (this.x < 0) this.x = canvas!.width;
                if (this.x > canvas!.width) this.x = 0;
                if (this.y < 0) this.y = canvas!.height;
                if (this.y > canvas!.height) this.y = 0;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const resize = () => {
            // Set canvas resolution strictly to CSS pixels
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Re-initialize particles to spread them properly on resize
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        window.addEventListener("resize", resize);
        resize();

        // Dark gradient background color (drawn every frame)
        const bgGradientStart = "rgb(10, 20, 40)";
        const bgGradientEnd = "rgb(5, 10, 20)";

        const render = () => {
            if (!isVisible) {
                animationFrameId = requestAnimationFrame(render);
                return;
            }

            // Clear screen with a solid fill to prevent trails and set the background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, bgGradientStart);
            gradient.addColorStop(1, bgGradientEnd);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw connecting lines between close particles
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = dx * dx + dy * dy;

                    if (dist < 10000) { // Connect if close enough
                        const opacity = 1 - dist / 10000;
                        ctx.strokeStyle = `rgba(0, 245, 212, ${opacity * 0.15})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach((p) => {
                p.update();
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        // Pause canvas when section scrolls off-screen
        const observer = new IntersectionObserver(
            ([entry]) => { isVisible = entry.isIntersecting; },
            { threshold: 0 }
        );
        if (canvas.parentElement) {
            observer.observe(canvas.parentElement);
        }

        render();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={cn("absolute inset-0 z-0 w-full h-full pointer-events-none", className)}
            style={{
                willChange: "transform", // Hint browser for separate layer
                transform: "translateZ(0)", // Force GPU acceleration
            }}
        />
    );
}
