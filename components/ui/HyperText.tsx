"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HyperTextProps {
    text: string;
    duration?: number;
    className?: string;
    animateOnLoad?: boolean;
}

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function HyperText({
    text,
    duration = 800,
    className,
    animateOnLoad = true,
}: HyperTextProps) {
    const [displayText, setDisplayText] = useState(text.split(""));
    const [trigger, setTrigger] = useState(false);
    const iterations = useRef(0);
    const isFirstRender = useRef(true);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!animateOnLoad && isFirstRender.current) {
                clearInterval(interval);
                isFirstRender.current = false;
                return;
            }
            if (iterations.current < text.length) {
                setDisplayText((t) =>
                    t.map((l, i) =>
                        l === " "
                            ? l
                            : i <= iterations.current
                                ? text[i]
                                : alphabets[Math.floor(Math.random() * alphabets.length)]
                    )
                );
                iterations.current = iterations.current + 0.1;
            } else {
                setTrigger(false);
                clearInterval(interval);
            }
        }, duration / (text.length * 10));

        return () => clearInterval(interval);
    }, [text, duration, trigger, animateOnLoad]);

    return (
        <motion.div
            className="overflow-hidden py-2 flex cursor-default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
                willChange: "transform",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
            }}
        >
            {displayText.map((letter, i) => (
                <motion.span
                    key={i}
                    className={cn("font-mono", letter === " " ? "w-3" : "", className)}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.3,
                        delay: i * 0.02,
                        ease: "easeOut",
                    }}
                    style={{
                        willChange: "transform, opacity",
                        transform: "translateZ(0)",
                    }}
                >
                    {letter}
                </motion.span>
            ))}
        </motion.div>
    );
}
