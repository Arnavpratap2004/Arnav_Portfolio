"use client";
import React, { useId } from "react";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";

type SparklesProps = {
    id?: string;
    className?: string;
    background?: string;
    minSize?: number;
    maxSize?: number;
    speed?: number;
    particleColor?: string;
    particleDensity?: number;
};

export const SparklesCore = (props: SparklesProps) => {
    const {
        id,
        className,
        background,
        minSize,
        maxSize,
        speed,
        particleColor,
        particleDensity,
    } = props;
    const [init, setInit] = useState(false);
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);
    const controls = useAnimation();

    const particlesLoaded = async (container?: Container) => {
        if (container) {
            console.log(container);
            controls.start({
                opacity: 1,
                transition: {
                    duration: 1,
                },
            });
        }
    };

    const generatedId = useId();

    return (
        <motion.div animate={controls} className={cn("opacity-0", className)}>
            {init && (
                <Particles
                    id={id || generatedId}
                    className={cn("h-full w-full")}
                    particlesLoaded={particlesLoaded}
                    options={{
                        background: {
                            color: {
                                value: background || "transparent",
                            },
                        },
                        fullScreen: {
                            enable: false,
                            zIndex: 1,
                        },
                        fpsLimit: 120,
                        interactivity: {
                            events: {
                                onClick: {
                                    enable: true,
                                    mode: "push",
                                },
                                onHover: {
                                    enable: false,
                                    mode: "repulse",
                                },
                                resize: true as any,
                            },
                            modes: {
                                push: {
                                    quantity: 4,
                                },
                                repulse: {
                                    distance: 200,
                                    duration: 0.4,
                                },
                            },
                        },
                        particles: {
                            bounce: {
                                horizontal: {
                                    value: 1,
                                },
                                vertical: {
                                    value: 1,
                                },
                            },
                            collisions: {
                                absorb: {
                                    speed: 2,
                                },
                                bounce: {
                                    horizontal: {
                                        value: 1,
                                    },
                                    vertical: {
                                        value: 1,
                                    },
                                },
                                enable: false,
                                maxSpeed: 50,
                                mode: "bounce",
                                overlap: {
                                    enable: true,
                                    retries: 0,
                                },
                            },
                            color: {
                                value: particleColor || "#ffffff",
                            },
                            move: {
                                direction: "none",
                                enable: true,
                                outModes: {
                                    default: "out",
                                },
                                random: false,
                                speed: speed || 4,
                                straight: false,
                            },
                            number: {
                                density: {
                                    enable: true,
                                    width: 400,
                                    height: 400,
                                },
                                limit: {
                                    mode: "delete",
                                    value: 0,
                                },
                                value: particleDensity || 120,
                            },
                            opacity: {
                                value: {
                                    min: 0.1,
                                    max: 1,
                                },
                                animation: {
                                    count: 0,
                                    enable: true,
                                    speed: 1,
                                    decay: 0,
                                    delay: 0,
                                    sync: false,
                                    mode: "auto",
                                    startValue: "random",
                                    destroy: "none",
                                },
                            },
                            shape: {
                                type: "circle",
                            },
                            size: {
                                value: {
                                    min: minSize || 1,
                                    max: maxSize || 3,
                                },
                                animation: {
                                    count: 0,
                                    enable: false,
                                    speed: 5,
                                    decay: 0,
                                    delay: 0,
                                    sync: false,
                                    mode: "auto",
                                    startValue: "random",
                                    destroy: "none",
                                },
                            },
                        },
                        detectRetina: true,
                    }}
                />
            )}
        </motion.div>
    );
};

import { motion, useAnimation } from "framer-motion";
