"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { HyperText } from "@/components/ui/HyperText";
import { BackgroundGradientAnimation } from "@/components/ui/BackgroundGradientAnimation";
import { Vortex } from "@/components/ui/Vortex";
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

export function Hero() {
    const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
    const [isSkillVisible, setIsSkillVisible] = useState(true);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isPhotoHovered, setIsPhotoHovered] = useState(false);
    const photoRef = useRef<HTMLDivElement>(null);

    const skills = [
        "Full Stack Developer",
        "AI/ML Researcher",
        "UI/UX Enthusiast",
        "Backend Specialist",
        "Problem Solver",
    ];

    // Skill loop animation - cycles every 2.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsSkillVisible(false);
            setTimeout(() => {
                setCurrentSkillIndex((prev) => (prev + 1) % skills.length);
                setIsSkillVisible(true);
            }, 150);
        }, 2500);

        return () => clearInterval(interval);
    }, [skills.length]);

    // Track mouse position for photo glow effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!photoRef.current) return;
        const rect = photoRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div className="relative h-[100vh] w-full overflow-hidden">
            <BackgroundGradientAnimation
                containerClassName="absolute inset-0 z-0"
                gradientBackgroundStart="rgb(10, 20, 40)"
                gradientBackgroundEnd="rgb(5, 10, 20)"
                firstColor="0, 245, 212"
                secondColor="139, 92, 246"
                thirdColor="100, 220, 255"
                fourthColor="0, 184, 169"
                fifthColor="168, 85, 247"
                pointerColor="0, 245, 212"
                size="80%"
                blendingValue="hard-light"
            >
                <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
                    <Vortex
                        backgroundColor="transparent"
                        rangeY={800}
                        particleCount={100}
                        baseHue={168}
                        rangeHue={30}
                        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
                    >
                        {/* Content Container */}
                        <div className="relative z-20 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between w-full h-full pt-20 pointer-events-auto">

                            {/* Left Side Vertical Accent Line */}
                            <motion.div
                                className="absolute left-8 top-1/4 w-1 bg-gradient-to-b from-teal-400 via-cyan-400 to-purple-500 rounded-full hidden md:block"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 200, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                            />

                            {/* Left Content */}
                            <div className="flex flex-col items-start text-left max-w-2xl ml-0 md:ml-8">

                                {/* Availability Badge */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.05 }}
                                    className="mb-4"
                                >
                                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                        </span>
                                        Open to Full-Time Roles — 2027
                                    </span>
                                </motion.div>

                                {/* Name - Micro Reveal */}
                                <motion.div
                                    initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                    transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.2 }}
                                >
                                    <HyperText
                                        text="Arnav Pratap"
                                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight drop-shadow-lg"
                                    />
                                </motion.div>

                                {/* Credential Subtitle */}
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.35 }}
                                    className="text-sm md:text-base text-neutral-400 font-medium tracking-wide mt-1"
                                >
                                    IIT Patna Research Intern &bull; VIT CSE &bull; 9.16 CGPA
                                </motion.p>

                                {/* Skill Loop - Auto-swapping */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.45 }}
                                    className="mt-3 h-8 flex items-center"
                                >
                                    <span className="text-neutral-500 mr-2 font-mono">{">"}</span>
                                    <span
                                        className={cn(
                                            "text-xl md:text-2xl font-medium bg-gradient-to-r from-teal-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent transition-all duration-150",
                                            isSkillVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                                        )}
                                    >
                                        {skills[currentSkillIndex]}
                                    </span>
                                    <motion.span
                                        className="ml-1 w-0.5 h-6 bg-teal-400"
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                </motion.div>

                                {/* Bio */}
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 25, delay: 0.6 }}
                                    className="mt-5 text-neutral-300 text-base md:text-lg leading-relaxed max-w-lg drop-shadow-md"
                                >
                                    Building end-to-end systems that solve real problems — from
                                    hostel-scale feedback platforms to real-time auction engines
                                    and AI-powered research frameworks.
                                </motion.p>

                                {/* Credibility Highlight Strip */}
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 25, delay: 0.75 }}
                                    className="mt-5 flex flex-wrap items-center gap-3"
                                >
                                    {highlights.map((h, i) => (
                                        <motion.span
                                            key={h.label}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.8 + i * 0.1, type: "spring", stiffness: 150, damping: 15 }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-neutral-300 backdrop-blur-sm hover:bg-white/10 hover:border-teal-500/30 transition-all duration-300"
                                        >
                                            <span>{h.icon}</span>
                                            {h.label}
                                        </motion.span>
                                    ))}
                                </motion.div>

                                {/* Dual CTA Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.95 }}
                                    className="mt-8 flex flex-wrap items-center gap-4"
                                >
                                    {/* Primary CTA */}
                                    <motion.a
                                        href="#projects"
                                        className={cn(
                                            "relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white",
                                            "bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-400",
                                            "hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300",
                                            "group overflow-hidden"
                                        )}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        animate={{
                                            boxShadow: [
                                                "0 0 0 0 rgba(0, 245, 212, 0)",
                                                "0 0 20px 4px rgba(0, 245, 212, 0.25)",
                                                "0 0 0 0 rgba(0, 245, 212, 0)",
                                            ],
                                        }}
                                        transition={{
                                            boxShadow: { duration: 2.5, repeat: Infinity, delay: 1.5 },
                                        }}
                                    >
                                        <span className="relative z-10">See My Projects</span>
                                        <svg
                                            className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </motion.a>

                                    {/* Secondary CTA — Resume */}
                                    <motion.a
                                        href={RESUME_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(
                                            "relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold",
                                            "border border-white/20 text-white bg-white/5 backdrop-blur-sm",
                                            "hover:border-teal-500/50 hover:bg-white/10 transition-all duration-300",
                                            "group"
                                        )}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <svg
                                            className="w-4 h-4 relative z-10"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="relative z-10">Download Resume</span>
                                    </motion.a>
                                </motion.div>

                                {/* Social Icons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.1 }}
                                    className="mt-6 flex items-center gap-3"
                                >
                                    <a
                                        href={GITHUB_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:border-teal-500/40 hover:bg-white/10 transition-all duration-300"
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
                                        className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:border-blue-500/40 hover:bg-white/10 transition-all duration-300"
                                        aria-label="LinkedIn"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="mailto:arnavpratap2003@gmail.com"
                                        className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 text-neutral-400 hover:text-white hover:border-purple-500/40 hover:bg-white/10 transition-all duration-300"
                                        aria-label="Email"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </a>
                                </motion.div>
                            </div>

                            {/* Right Photo with Presence Animation */}
                            <motion.div
                                ref={photoRef}
                                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.4 }}
                                className="hidden md:block relative"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setIsPhotoHovered(true)}
                                onMouseLeave={() => setIsPhotoHovered(false)}
                            >
                                {/* Breathing scale container */}
                                <motion.div
                                    animate={{ scale: [1, 1.01, 1] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative"
                                >
                                    {/* Glowing rim */}
                                    <motion.div
                                        className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-500 via-cyan-400 to-purple-500 blur-md"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 0.6, 0.4] }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                    />

                                    {/* Cursor responsive glow */}
                                    {isPhotoHovered && (
                                        <div
                                            className="absolute w-40 h-40 rounded-full pointer-events-none transition-opacity duration-300"
                                            style={{
                                                left: mousePosition.x - 80,
                                                top: mousePosition.y - 80,
                                                background: "radial-gradient(circle, rgba(0, 245, 212, 0.4) 0%, transparent 70%)",
                                                filter: "blur(20px)",
                                            }}
                                        />
                                    )}

                                    {/* Photo container */}
                                    <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-2 border-white/20">
                                        <Image
                                            src="/profile-photo.png"
                                            alt="Arnav Pratap – Full-Stack & AI Engineer"
                                            fill
                                            className="object-cover"
                                            priority
                                            sizes="(max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
                                        />

                                        {/* Gradient overlay on hover */}
                                        <div className={cn(
                                            "absolute inset-0 bg-gradient-to-t from-teal-500/20 to-transparent transition-opacity duration-300",
                                            isPhotoHovered ? "opacity-100" : "opacity-0"
                                        )} />
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Scroll Hint at Bottom */}
                        <motion.div
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                        >
                            <span className="text-neutral-500 text-xs tracking-widest uppercase">Scroll to explore</span>
                            <motion.div
                                className="w-6 h-10 rounded-full border-2 border-neutral-600 flex justify-center pt-2"
                                animate={{ borderColor: ["rgba(115, 115, 115, 0.5)", "rgba(0, 245, 212, 0.5)", "rgba(115, 115, 115, 0.5)"] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <motion.div
                                    className="w-1.5 h-1.5 rounded-full bg-teal-400"
                                    animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </motion.div>
                        </motion.div>
                    </Vortex>
                </div>
            </BackgroundGradientAnimation>
        </div>
    );
}
