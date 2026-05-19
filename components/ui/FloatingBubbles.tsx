"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface FloatingBubblesProps {
    className?: string;
    children?: React.ReactNode;
}

export const FloatingBubbles = ({ className, children }: FloatingBubblesProps) => {
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

        // Floating bubbles with warm, friendly colors
        interface Bubble {
            x: number;
            y: number;
            radius: number;
            speedX: number;
            speedY: number;
            hue: number;
            opacity: number;
            pulseSpeed: number;
            pulsePhase: number;
        }

        const bubbles: Bubble[] = [];
        const bubbleCount = 18;
        const width = window.innerWidth;
        const height = canvas.parentElement?.offsetHeight || window.innerHeight;

        // Pleasant color palette: warm oranges, soft pinks, gentle purples, calm blues
        const hues = [25, 35, 320, 280, 210, 180]; // Orange, gold, pink, purple, blue, cyan

        for (let i = 0; i < bubbleCount; i++) {
            bubbles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 80 + 40,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                hue: hues[Math.floor(Math.random() * hues.length)],
                opacity: Math.random() * 0.08 + 0.03,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulsePhase: Math.random() * Math.PI * 2,
            });
        }

        // Small sparkles for extra friendliness
        interface Sparkle {
            x: number;
            y: number;
            size: number;
            speedY: number;
            opacity: number;
            twinkleSpeed: number;
            phase: number;
        }

        const sparkles: Sparkle[] = [];
        const sparkleCount = 25;

        for (let i = 0; i < sparkleCount; i++) {
            sparkles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 3 + 1,
                speedY: Math.random() * 0.2 + 0.1,
                opacity: Math.random() * 0.6 + 0.2,
                twinkleSpeed: Math.random() * 0.05 + 0.02,
                phase: Math.random() * Math.PI * 2,
            });
        }

        const animate = () => {
            const width = window.innerWidth;
            const height = canvas.parentElement?.offsetHeight || window.innerHeight;

            // Clear with a very subtle fade for trail effect
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, width, height);
            ctx.clearRect(0, 0, width, height);

            time += 0.016;

            // Draw bubbles
            bubbles.forEach((bubble) => {
                // Update position
                bubble.x += bubble.speedX;
                bubble.y += bubble.speedY;

                // Bounce off edges softly
                if (bubble.x < -bubble.radius) bubble.x = width + bubble.radius;
                if (bubble.x > width + bubble.radius) bubble.x = -bubble.radius;
                if (bubble.y < -bubble.radius) bubble.y = height + bubble.radius;
                if (bubble.y > height + bubble.radius) bubble.y = -bubble.radius;

                // Pulsing effect
                const pulse = Math.sin(time * bubble.pulseSpeed + bubble.pulsePhase) * 0.2 + 1;
                const currentRadius = bubble.radius * pulse;

                // Draw bubble with gradient
                const gradient = ctx.createRadialGradient(
                    bubble.x, bubble.y, 0,
                    bubble.x, bubble.y, currentRadius
                );
                gradient.addColorStop(0, `hsla(${bubble.hue}, 70%, 60%, ${bubble.opacity * 1.5})`);
                gradient.addColorStop(0.5, `hsla(${bubble.hue}, 60%, 50%, ${bubble.opacity})`);
                gradient.addColorStop(1, `hsla(${bubble.hue}, 50%, 40%, 0)`);

                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, currentRadius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            });

            // Draw sparkles
            sparkles.forEach((sparkle) => {
                // Float upward slowly
                sparkle.y -= sparkle.speedY;
                if (sparkle.y < -10) {
                    sparkle.y = height + 10;
                    sparkle.x = Math.random() * width;
                }

                // Twinkle effect
                const twinkle = (Math.sin(time * sparkle.twinkleSpeed * 60 + sparkle.phase) + 1) / 2;
                const currentOpacity = sparkle.opacity * twinkle;

                // Draw sparkle as a soft star
                ctx.beginPath();
                ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
                ctx.fill();

                // Add a subtle glow
                const glow = ctx.createRadialGradient(
                    sparkle.x, sparkle.y, 0,
                    sparkle.x, sparkle.y, sparkle.size * 3
                );
                glow.addColorStop(0, `rgba(255, 220, 180, ${currentOpacity * 0.5})`);
                glow.addColorStop(1, "transparent");
                ctx.fillStyle = glow;
                ctx.fillRect(sparkle.x - sparkle.size * 3, sparkle.y - sparkle.size * 3, sparkle.size * 6, sparkle.size * 6);
            });

            // Add subtle ambient glow spots
            const glowColors = [
                { x: width * 0.15, y: height * 0.3, color: "rgba(255, 150, 100, 0.08)", size: 300 },
                { x: width * 0.85, y: height * 0.6, color: "rgba(150, 100, 255, 0.06)", size: 350 },
                { x: width * 0.5, y: height * 0.8, color: "rgba(100, 200, 255, 0.05)", size: 280 },
            ];

            glowColors.forEach((glow) => {
                const moveX = Math.sin(time * 0.3) * 30;
                const moveY = Math.cos(time * 0.25) * 20;

                const gradient = ctx.createRadialGradient(
                    glow.x + moveX, glow.y + moveY, 0,
                    glow.x + moveX, glow.y + moveY, glow.size
                );
                gradient.addColorStop(0, glow.color);
                gradient.addColorStop(1, "transparent");
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
            });

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
