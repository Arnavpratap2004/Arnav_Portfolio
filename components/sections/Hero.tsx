"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { HyperText } from "@/components/ui/HyperText";
import { BackgroundGradientAnimation } from "@/components/ui/BackgroundGradientAnimation";
import { Vortex } from "@/components/ui/Vortex";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function Hero() {
    const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
    const [isSkillVisible, setIsSkillVisible] = useState(true);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isPhotoHovered, setIsPhotoHovered] = useState(false);
    const photoRef = useRef<HTMLDivElement>(null);

    const skills = [
        "Full Stack Developer",
        "UI/UX Enthusiast",
        "Problem Solver",
        "AI/ML Explorer",
        "Backend Specialist"
    ];

    // Skill loop animation - cycles every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsSkillVisible(false);
            setTimeout(() => {
                setCurrentSkillIndex((prev) => (prev + 1) % skills.length);
                setIsSkillVisible(true);
            }, 150);
        }, 2000);

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
                gradientBackgroundStart="rgb(15, 23, 42)"
                gradientBackgroundEnd="rgb(10, 10, 15)"
                firstColor="18, 113, 255"
                secondColor="221, 74, 255"
                thirdColor="100, 220, 255"
                fourthColor="200, 50, 50"
                fifthColor="180, 180, 50"
                pointerColor="140, 100, 255"
                size="80%"
                blendingValue="hard-light"
            >
                <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
                    <Vortex
                        backgroundColor="transparent"
                        rangeY={800}
                        particleCount={500}
                        baseHue={20}
                        rangeHue={30}
                        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
                    >
                        {/* Content Container */}
                        <div className="relative z-20 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between w-full h-full pt-20 pointer-events-auto">

                            {/* Left Side Vertical Accent Line */}
                            <motion.div
                                className="absolute left-8 top-1/4 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-500 rounded-full"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 200, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            />

                            {/* Left Content */}
                            <div className="flex flex-col items-start text-left max-w-2xl ml-8">
                                {/* Greeting */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="text-purple-400 font-bold tracking-widest text-lg mb-2"
                                >
                                    HELLO, I'M
                                </motion.h2>

                                {/* Name - Micro Reveal */}
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                                >
                                    <HyperText
                                        text="Arnav Pratap"
                                        className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg"
                                    />
                                </motion.div>

                                {/* Skill Loop - Auto-swapping */}
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                                    className="mt-3 h-8 flex items-center"
                                >
                                    <span className="text-neutral-400 mr-2">{">"}</span>
                                    <span
                                        className={cn(
                                            "text-xl md:text-2xl font-medium bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent transition-all duration-150",
                                            isSkillVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                                        )}
                                    >
                                        {skills[currentSkillIndex]}
                                    </span>
                                    <motion.span
                                        className="ml-1 w-0.5 h-6 bg-purple-400"
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                </motion.div>

                                {/* Bio - Fades in with opacity animation */}
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                                    className="mt-6 text-neutral-300 text-base md:text-lg leading-relaxed max-w-lg drop-shadow-md"
                                >
                                    Passionate about crafting elegant solutions and building impactful digital experiences.
                                    Turning complex ideas into beautiful, functional applications.
                                </motion.p>

                                {/* Single CTA Button - With pulse animation */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                                    className="mt-10"
                                >
                                    <motion.a
                                        href="#projects"
                                        className={cn(
                                            "relative inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white",
                                            "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500",
                                            "hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300",
                                            "group overflow-hidden"
                                        )}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        animate={{
                                            boxShadow: [
                                                "0 0 0 0 rgba(168, 85, 247, 0)",
                                                "0 0 20px 4px rgba(168, 85, 247, 0.3)",
                                                "0 0 0 0 rgba(168, 85, 247, 0)"
                                            ]
                                        }}
                                        transition={{
                                            boxShadow: { duration: 2, repeat: Infinity, delay: 1 }
                                        }}
                                    >
                                        <span className="relative z-10">Explore My Work</span>
                                        <svg
                                            className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                        {/* Hover gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </motion.a>
                                </motion.div>
                            </div>

                            {/* Right Photo with Presence Animation */}
                            <motion.div
                                ref={photoRef}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
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
                                    {/* Glowing rim that brightens on load */}
                                    <motion.div
                                        className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 blur-md"
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
                                                background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
                                                filter: "blur(20px)",
                                            }}
                                        />
                                    )}

                                    {/* Photo container */}
                                    <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-white/20">
                                        {/* Placeholder - Replace with actual photo */}
                                        <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-6xl mb-2">👨‍💻</div>
                                                <span className="text-neutral-400 text-sm">Your Photo</span>
                                            </div>
                                        </div>

                                        {/* Gradient overlay on hover */}
                                        <div className={cn(
                                            "absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent transition-opacity duration-300",
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
                                animate={{ borderColor: ["rgba(115, 115, 115, 0.5)", "rgba(168, 85, 247, 0.5)", "rgba(115, 115, 115, 0.5)"] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <motion.div
                                    className="w-1.5 h-1.5 rounded-full bg-purple-400"
                                    animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </motion.div>
                        </motion.div>
                    </Vortex>
                </div>
            </BackgroundGradientAnimation>

            {/* Animation Styles */}
            <style jsx global>{`
                @keyframes breathing {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.01); }
                }
            `}</style>
        </div>
    );
}

