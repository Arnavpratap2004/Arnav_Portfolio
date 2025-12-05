"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MagneticPulseProps {
    className?: string;
    children?: React.ReactNode;
}

export const MagneticPulse = ({ className, children }: MagneticPulseProps) => {
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

        // Pulsing rings that radiate from center
        interface PulseRing {
            radius: number;
            maxRadius: number;
            opacity: number;
            speed: number;
            hue: number;
        }

        const pulseRings: PulseRing[] = [];
        const createPulseRing = (width: number, height: number) => {
            pulseRings.push({
                radius: 0,
                maxRadius: Math.max(width, height) * 0.8,
                opacity: 0.4,
                speed: 2 + Math.random() * 1,
                hue: 220 + Math.random() * 60, // Blue to purple range
            });
        };

        // Attracted particles moving toward center
        interface AttractedParticle {
            x: number;
            y: number;
            targetX: number;
            targetY: number;
            size: number;
            speed: number;
            opacity: number;
            trail: Array<{ x: number; y: number }>;
            hue: number;
        }

        const particles: AttractedParticle[] = [];
        const particleCount = 60;

        const initParticles = (width: number, height: number) => {
            particles.length = 0;
            const centerX = width / 2;
            const centerY = height / 2;

            for (let i = 0; i < particleCount; i++) {
                // Start from edges
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.max(width, height) * 0.6 + Math.random() * 200;
                particles.push({
                    x: centerX + Math.cos(angle) * distance,
                    y: centerY + Math.sin(angle) * distance,
                    targetX: centerX,
                    targetY: centerY,
                    size: Math.random() * 3 + 1,
                    speed: 0.5 + Math.random() * 1.5,
                    opacity: Math.random() * 0.8 + 0.2,
                    trail: [],
                    hue: 180 + Math.random() * 100, // Cyan to purple
                });
            }
        };

        // Energy lines connecting to center
        interface EnergyLine {
            startAngle: number;
            length: number;
            opacity: number;
            pulsePhase: number;
            width: number;
        }

        const energyLines: EnergyLine[] = [];
        const lineCount = 12;

        for (let i = 0; i < lineCount; i++) {
            energyLines.push({
                startAngle: (Math.PI * 2 / lineCount) * i,
                length: 0.3 + Math.random() * 0.4,
                opacity: 0.1 + Math.random() * 0.2,
                pulsePhase: Math.random() * Math.PI * 2,
                width: 1 + Math.random() * 2,
            });
        }

        // Initialize
        const width = window.innerWidth;
        const height = canvas.parentElement?.offsetHeight || window.innerHeight;
        initParticles(width, height);

        // Create initial pulse rings
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createPulseRing(width, height), i * 1500);
        }

        // Continuously create new pulse rings
        const pulseInterval = setInterval(() => {
            const w = window.innerWidth;
            const h = canvas.parentElement?.offsetHeight || window.innerHeight;
            if (pulseRings.length < 5) {
                createPulseRing(w, h);
            }
        }, 2000);

        const animate = () => {
            const width = window.innerWidth;
            const height = canvas.parentElement?.offsetHeight || window.innerHeight;
            const centerX = width / 2;
            const centerY = height / 2;

            ctx.clearRect(0, 0, width, height);
            time += 0.016;

            // Draw ambient glow at center
            const centerGlow = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, 300
            );
            centerGlow.addColorStop(0, "rgba(99, 102, 241, 0.15)");
            centerGlow.addColorStop(0.5, "rgba(139, 92, 246, 0.08)");
            centerGlow.addColorStop(1, "transparent");
            ctx.fillStyle = centerGlow;
            ctx.fillRect(0, 0, width, height);

            // Draw pulsing center orb
            const orbPulse = Math.sin(time * 3) * 0.2 + 1;
            const orbGradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, 80 * orbPulse
            );
            orbGradient.addColorStop(0, "rgba(167, 139, 250, 0.3)");
            orbGradient.addColorStop(0.5, "rgba(139, 92, 246, 0.15)");
            orbGradient.addColorStop(1, "transparent");
            ctx.fillStyle = orbGradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, 80 * orbPulse, 0, Math.PI * 2);
            ctx.fill();

            // Draw energy lines radiating from center
            energyLines.forEach((line) => {
                const pulse = Math.sin(time * 2 + line.pulsePhase) * 0.3 + 0.7;
                const lineLength = Math.min(width, height) * line.length * pulse;

                const startX = centerX + Math.cos(line.startAngle + time * 0.1) * 50;
                const startY = centerY + Math.sin(line.startAngle + time * 0.1) * 50;
                const endX = centerX + Math.cos(line.startAngle + time * 0.1) * lineLength;
                const endY = centerY + Math.sin(line.startAngle + time * 0.1) * lineLength;

                const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
                gradient.addColorStop(0, `rgba(139, 92, 246, ${line.opacity * pulse})`);
                gradient.addColorStop(1, "transparent");

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = line.width * pulse;
                ctx.stroke();
            });

            // Draw and update pulse rings
            pulseRings.forEach((ring, index) => {
                ring.radius += ring.speed;
                ring.opacity = 0.4 * (1 - ring.radius / ring.maxRadius);

                if (ring.radius < ring.maxRadius && ring.opacity > 0) {
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2);
                    ctx.strokeStyle = `hsla(${ring.hue}, 70%, 60%, ${ring.opacity})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Inner glow
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2);
                    ctx.strokeStyle = `hsla(${ring.hue}, 80%, 70%, ${ring.opacity * 0.5})`;
                    ctx.lineWidth = 6;
                    ctx.filter = "blur(4px)";
                    ctx.stroke();
                    ctx.filter = "none";
                } else {
                    pulseRings.splice(index, 1);
                }
            });

            // Draw and update attracted particles
            particles.forEach((particle) => {
                // Store trail
                particle.trail.push({ x: particle.x, y: particle.y });
                if (particle.trail.length > 15) {
                    particle.trail.shift();
                }

                // Move toward center with acceleration
                const dx = particle.targetX - particle.x;
                const dy = particle.targetY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 50) {
                    const attraction = particle.speed * (1 + (1 - distance / 1000));
                    particle.x += (dx / distance) * attraction;
                    particle.y += (dy / distance) * attraction;
                } else {
                    // Reset particle to edge when it reaches center
                    const angle = Math.random() * Math.PI * 2;
                    const newDistance = Math.max(width, height) * 0.6 + Math.random() * 200;
                    particle.x = centerX + Math.cos(angle) * newDistance;
                    particle.y = centerY + Math.sin(angle) * newDistance;
                    particle.trail = [];
                }

                // Draw trail
                if (particle.trail.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
                    for (let i = 1; i < particle.trail.length; i++) {
                        ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
                    }
                    const trailGradient = ctx.createLinearGradient(
                        particle.trail[0].x, particle.trail[0].y,
                        particle.x, particle.y
                    );
                    trailGradient.addColorStop(0, "transparent");
                    trailGradient.addColorStop(1, `hsla(${particle.hue}, 80%, 65%, ${particle.opacity * 0.5})`);
                    ctx.strokeStyle = trailGradient;
                    ctx.lineWidth = particle.size * 0.5;
                    ctx.stroke();
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, ${particle.opacity})`;
                ctx.fill();

                // Glow effect
                const glowGradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 4
                );
                glowGradient.addColorStop(0, `hsla(${particle.hue}, 80%, 70%, ${particle.opacity * 0.3})`);
                glowGradient.addColorStop(1, "transparent");
                ctx.fillStyle = glowGradient;
                ctx.fillRect(particle.x - particle.size * 4, particle.y - particle.size * 4, particle.size * 8, particle.size * 8);
            });

            // Floating call-to-action sparkles around center
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i + time * 0.5;
                const orbitRadius = 120 + Math.sin(time * 2 + i) * 20;
                const x = centerX + Math.cos(angle) * orbitRadius;
                const y = centerY + Math.sin(angle) * orbitRadius;
                const sparkleSize = 2 + Math.sin(time * 4 + i * 0.5) * 1;

                ctx.beginPath();
                ctx.arc(x, y, sparkleSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + Math.sin(time * 3 + i) * 0.3})`;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
            clearInterval(pulseInterval);
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
