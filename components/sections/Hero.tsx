"use client";
import { m } from "framer-motion";
import Image from "next/image";
import { HyperText } from "@/components/ui/HyperText";
import { BackgroundCanvas } from "@/components/ui/BackgroundCanvas";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const GITHUB_URL = "https://github.com/Arnavpratap2004";
const LINKEDIN_URL = "https://www.linkedin.com/in/arnavpratap2004/";
const RESUME_URL =
    "https://drive.google.com/file/d/1vmWpALCPCccujC0YsqJK0LZgpsu9aFDi/view?usp=sharing";

const highlights = [
    { label: "IIT Research", icon: "🔬" },
    { label: "200+ Concurrent Users", icon: "👥" },
    { label: "AWS AI Pipeline", icon: "☁️" },
    { label: "9.16 CGPA", icon: "🎓" },
];

function CTAButtons() {
    return (
        <m.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
            className="mt-6 flex flex-wrap items-center gap-3"
        >
            {/* Primary CTA */}
            <a
                href="#projects"
                className={cn(
                    "relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white text-sm",
                    "bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-400",
                    "transition-transform duration-300 hover:scale-105 active:scale-95",
                    "group overflow-hidden"
                )}
            >
                <span className="relative z-10">See My Projects</span>
                <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                {/* Optimized glow without heavy shadows */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </a>

            {/* Secondary CTA — Resume */}
            <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                    "relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm",
                    "border border-white/20 text-white bg-white/10", // Removed backdrop-filter
                    "hover:bg-white/20 hover:border-teal-500/50 transition-all duration-300",
                    "hover:scale-105 active:scale-95 group"
                )}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="relative z-10">Download Resume</span>
            </a>
        </m.div>
    );
}

function ProfileFrame() {
    return (
        <m.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
            className="relative flex-shrink-0 w-full md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0 pointer-events-none"
        >
            <m.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{ willChange: "transform", transform: "translateZ(0)" }}
                className="relative w-full max-w-[300px] md:max-w-[380px] lg:max-w-[480px] h-[400px] sm:h-[450px] lg:h-[600px]"
            >
                {/* Background color bridge to flawlessly merge the image with the page */}
                <div className="absolute -inset-24 bg-[radial-gradient(ellipse_at_center,#050a14_40%,transparent_70%)] -z-10 rounded-full opacity-90" />

                {/* Horizontal Fade (Cuts deep to eliminate the JPEG box entirely) */}
                <div className="absolute inset-0 [mask-image:linear-gradient(to_right,transparent_0%,black_25%,black_75%,transparent_100%)]">
                    {/* Vertical Fade (blends the bottom seamlessly) */}
                    <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]">
                        <Image
                            src="/new-profile-photo-2.jpg"
                            alt="Arnav Pratap – Full-Stack & AI Engineer"
                            fill
                            className="object-cover object-top opacity-95 mix-blend-lighten"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>
            </m.div>
        </m.div>
    );
}

function HeroContent() {
    const [currentSkillIndex, setCurrentSkillIndex] = useState(0);

    const skills = [
        "Full Stack Developer",
        "AI/ML Researcher",
        "UI/UX Enthusiast",
        "Backend Specialist",
        "Problem Solver",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSkillIndex((prev) => (prev + 1) % skills.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [skills.length]);

    return (
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-2xl">
            {/* Availability Badge */}
            <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                className="mb-3"
            >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    <span className="relative flex h-2 w-2">
                        {/* CSS ping is GPU accelerated inherently */}
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    Open to Full-Time Roles — 2027
                </span>
            </m.div>

            {/* Name */}
            <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
            >
                <HyperText
                    text="Arnav Pratap"
                    className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight"
                />
            </m.div>

            {/* Credential Subtitle */}
            <m.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                className="text-sm md:text-base text-neutral-400 font-medium tracking-wide mt-1"
            >
                IIT Patna Research Intern &bull; VIT CSE &bull; 9.16 CGPA
            </m.p>

            {/* Skill Loop (Simplified React animation to CSS keyframes/transitions) */}
            <m.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                className="mt-2 h-8 flex items-center"
            >
                <span className="text-neutral-500 mr-2 font-mono">{">"}</span>
                <div className="relative overflow-hidden h-full flex items-center">
                    <span
                        key={currentSkillIndex}
                        className="text-lg sm:text-xl md:text-2xl font-medium bg-gradient-to-r from-teal-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent animate-in slide-in-from-bottom-2 fade-in duration-300"
                    >
                        {skills[currentSkillIndex]}
                    </span>
                </div>
                {/* Static blinking cursor via CSS */}
                <span className="ml-1 w-0.5 h-6 bg-teal-400 animate-pulse" />
            </m.div>

            {/* Bio */}
            <m.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                className="mt-4 text-neutral-300 text-sm md:text-base leading-relaxed max-w-lg"
            >
                Building end-to-end systems that solve real problems — from
                hostel-scale feedback platforms to real-time auction engines
                and AI-powered research frameworks.
            </m.p>

            {/* Credibility Highlight Strip */}
            <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                className="mt-4 flex flex-wrap items-center gap-2"
            >
                {highlights.map((h, i) => (
                    <span
                        key={h.label}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:border-teal-500/30 transition-colors duration-300"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <span>{h.icon}</span>
                        {h.label}
                    </span>
                ))}
            </m.div>

            <CTAButtons />
        </div>
    );
}

export function Hero() {
    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#020617] via-[#050914] to-[#020617]">
            {/* Highly Performant Canvas Particle Background */}
            <BackgroundCanvas />

            {/* Floating Social Icons — Top Right */}
            <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                className="absolute top-6 right-6 z-50 flex items-center gap-2 pointer-events-auto"
            >
                <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:border-teal-500/50 hover:bg-white/10 transition-all duration-300 hover:scale-110"
                    aria-label="GitHub"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                </a>
                <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 hover:scale-110"
                    aria-label="LinkedIn"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                </a>
                <a
                    href="mailto:arnavpratap2003@gmail.com"
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 hover:scale-110"
                    aria-label="Email"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </a>
            </m.div>

            {/* Main Content */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-10 flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-8 pointer-events-auto">

                    {/* Left Side Vertical Accent Line */}
                    <m.div
                        className="absolute left-4 top-0 w-1 bg-gradient-to-b from-teal-400 via-cyan-400 to-purple-500 rounded-full hidden lg:block"
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{ originY: 0, willChange: "transform, opacity", transform: "translateZ(0)" }}
                    />

                    {/* Left Content */}
                    <HeroContent />

                    {/* Right — Profile Photo */}
                    <ProfileFrame />
                </div>
            </div>

            {/* Scroll Hint */}
            <m.div
                className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-2 pointer-events-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.2 }}
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
            >
                <span className="text-neutral-500 text-xs tracking-widest uppercase">Scroll to explore</span>
                <div className="w-6 h-10 rounded-full border-2 border-neutral-600 flex justify-center pt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" />
                </div>
            </m.div>
        </section>
    );
}
