"use client";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import { motion } from "framer-motion";
import Image from "next/image";
import { SparklesCore } from "@/components/ui/Sparkles";
import { HyperText } from "@/components/ui/HyperText";
import { NoiseButton } from "@/components/ui/NoiseButton";

import { BackgroundGradientAnimation } from "@/components/ui/BackgroundGradientAnimation";
import { Vortex } from "@/components/ui/Vortex";

export function Hero() {
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
                        {/* Content Container - pointer-events-auto to allow interaction with buttons */}
                        <div className="relative z-20 max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between w-full h-full pt-20 pointer-events-auto">
                            {/* Left Content */}
                            <div className="flex flex-col items-start text-left max-w-2xl">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="text-red-500 font-bold tracking-widest text-lg mb-2"
                                >
                                    HELLO!
                                </motion.h2>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-4xl md:text-6xl font-bold text-white tracking-tight">I Am</span>
                                        <HyperText
                                            text="Arnav Pratap"
                                            className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg"
                                        />
                                    </div>
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                                    className="mt-6 text-neutral-200 text-base md:text-lg leading-relaxed max-w-lg drop-shadow-md"
                                >
                                    I'm a Web Developer with extensive experience for over 5 years. My expertise is to create and Websites design, graphic design and many more...
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                                    className="mt-10 flex gap-6"
                                >
                                    <NoiseButton href="#projects">
                                        View Work
                                    </NoiseButton>
                                    <NoiseButton href="#contact">
                                        Hire Me
                                    </NoiseButton>
                                </motion.div>
                            </div>

                            {/* Right Image Placeholder */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                                className="hidden md:block relative w-[400px] h-[500px]"
                            >
                                {/* Placeholder for user image */}
                                <div className="w-full h-full bg-neutral-800/50 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center justify-center">
                                    <span className="text-neutral-400">User Image Placeholder</span>
                                </div>
                            </motion.div>
                        </div>
                    </Vortex>
                </div>
            </BackgroundGradientAnimation>
        </div>
    );
}
