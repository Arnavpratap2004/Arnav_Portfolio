"use client";
import React, { useState, useEffect, useRef } from "react";
import { MagneticPulse } from "@/components/ui/MagneticPulse";
import { cn } from "@/lib/utils";

export function Contact() {
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [messageFocused, setMessageFocused] = useState(false);
    const [emailValue, setEmailValue] = useState("");
    const [messageValue, setMessageValue] = useState("");
    const sectionRef = useRef<HTMLElement>(null);

    // Intersection Observer for warm invitation animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Handle form submission with confirmation animation
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);

            // Reset after 3 seconds
            setTimeout(() => {
                setIsSubmitted(false);
                setEmailValue("");
                setMessageValue("");
            }, 3000);
        }, 1000);
    };

    return (
        <section
            ref={sectionRef}
            className="py-32 w-screen relative overflow-hidden -mx-[calc((100vw-100%)/2)]"
        >
            {/* Animated Background - Full viewport width */}
            <div className="absolute inset-0 w-screen bg-gradient-to-b from-neutral-950 via-indigo-950/20 to-neutral-950" />
            <MagneticPulse className="absolute inset-0 w-screen h-full" />

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4">
                {/* Warm Invitation Animation - Headline */}
                <div className="text-center mb-16">
                    <h2 className={cn(
                        "text-4xl font-bold text-white tracking-tight mb-2 transition-all duration-700",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}>
                        Get in Touch
                    </h2>

                    {/* Animated underline that grows from center */}
                    <div className="flex justify-center mb-4">
                        <div className={cn(
                            "h-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 delay-200",
                            isVisible ? "w-24 opacity-100" : "w-0 opacity-0"
                        )} />
                    </div>

                    {/* Subtext appears 120ms later */}
                    <p className={cn(
                        "text-neutral-400 max-w-lg mx-auto transition-all duration-700 delay-300",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}>
                        Let's create something amazing together
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Left Side - Contact Info */}
                    <div className={cn(
                        "space-y-8 transition-all duration-700 delay-400",
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                    )}>
                        <h3 className="text-2xl font-semibold text-white">Let's collaborate</h3>
                        <p className="text-neutral-400 leading-relaxed">
                            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
                        </p>

                        <div className="space-y-4">
                            {/* Email with Presence Pulse */}
                            <a
                                href="mailto:arnavpratap2003@gmail.com"
                                className="flex items-center space-x-3 text-neutral-300 hover:text-white transition-colors group"
                            >
                                <ContactIcon pulseDelay={0}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </ContactIcon>
                                <span className="group-hover:translate-x-1 transition-transform">arnavpratap2003@gmail.com</span>
                            </a>

                            {/* Social Icons with Presence Pulse */}
                            <div className="flex gap-4 pt-4">
                                <SocialIcon
                                    href="https://www.linkedin.com/in/arnavpratap2004/"
                                    pulseDelay={1500}
                                    hoverColor="from-blue-500 to-blue-600"
                                >
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </SocialIcon>

                                <SocialIcon
                                    href="https://github.com/Arnavpratap2004"
                                    pulseDelay={3000}
                                    hoverColor="from-gray-600 to-gray-700"
                                >
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </SocialIcon>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form with Interactive Animations */}
                    <div className={cn(
                        "relative p-[2px] rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 delay-500",
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                    )}>
                        <div className="bg-neutral-900/95 rounded-3xl p-8 h-full backdrop-blur-md">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* Email Field with Floating Label */}
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        value={emailValue}
                                        onChange={(e) => setEmailValue(e.target.value)}
                                        onFocus={() => setEmailFocused(true)}
                                        onBlur={() => setEmailFocused(false)}
                                        className={cn(
                                            "peer w-full rounded-xl bg-black/50 text-white p-4 pt-6 transition-all duration-300 outline-none",
                                            "border-2",
                                            emailFocused
                                                ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                                                : "border-neutral-700 hover:border-neutral-600"
                                        )}
                                        placeholder=" "
                                        required
                                    />
                                    {/* Floating Label */}
                                    <label
                                        htmlFor="email"
                                        className={cn(
                                            "absolute left-4 transition-all duration-300 pointer-events-none",
                                            emailFocused || emailValue
                                                ? "top-2 text-xs text-indigo-400"
                                                : "top-5 text-sm text-neutral-400"
                                        )}
                                    >
                                        Email Address
                                    </label>
                                </div>

                                {/* Message Field with Floating Label */}
                                <div className="relative">
                                    <textarea
                                        id="message"
                                        rows={4}
                                        value={messageValue}
                                        onChange={(e) => setMessageValue(e.target.value)}
                                        onFocus={() => setMessageFocused(true)}
                                        onBlur={() => setMessageFocused(false)}
                                        className={cn(
                                            "peer w-full rounded-xl bg-black/50 text-white p-4 pt-6 transition-all duration-300 outline-none resize-none",
                                            "border-2",
                                            messageFocused
                                                ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                                                : "border-neutral-700 hover:border-neutral-600"
                                        )}
                                        placeholder=" "
                                        required
                                    />
                                    {/* Floating Label */}
                                    <label
                                        htmlFor="message"
                                        className={cn(
                                            "absolute left-4 transition-all duration-300 pointer-events-none",
                                            messageFocused || messageValue
                                                ? "top-2 text-xs text-indigo-400"
                                                : "top-5 text-sm text-neutral-400"
                                        )}
                                    >
                                        Your Message
                                    </label>
                                </div>

                                {/* Submit Button with Confirmation Animation */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isSubmitted}
                                    className={cn(
                                        "relative w-full py-4 px-6 rounded-full font-bold transition-all duration-300 overflow-hidden",
                                        isSubmitted
                                            ? "bg-green-500 text-white"
                                            : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white",
                                        !isSubmitting && !isSubmitted && "hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02]",
                                        isSubmitting && "scale-[0.98]"
                                    )}
                                >
                                    <span className={cn(
                                        "relative z-10 flex items-center justify-center gap-2 transition-all duration-300",
                                        (isSubmitting || isSubmitted) && "opacity-0"
                                    )}>
                                        Send Message
                                    </span>

                                    {/* Loading Spinner */}
                                    {isSubmitting && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}

                                    {/* Success Checkmark */}
                                    {isSubmitted && (
                                        <div className="absolute inset-0 flex items-center justify-center gap-2">
                                            <svg className="w-6 h-6 animate-bounce-once" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="animate-fade-in">Message Sent!</span>
                                        </div>
                                    )}

                                    {/* Hover Gradient */}
                                    <div className={cn(
                                        "absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-opacity",
                                        isSubmitted ? "opacity-0" : "opacity-0 hover:opacity-100"
                                    )} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animation Styles */}
            <style jsx global>{`
                @keyframes bounce-once {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
                .animate-bounce-once {
                    animation: bounce-once 0.5s ease-out;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
                @keyframes gentle-pulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
                    50% { transform: scale(1.02); box-shadow: 0 0 20px 2px rgba(139, 92, 246, 0.3); }
                }
                .animate-gentle-pulse {
                    animation: gentle-pulse 4s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}

// Contact Icon with Presence Pulse
interface ContactIconProps {
    children: React.ReactNode;
    pulseDelay: number;
}

const ContactIcon = ({ children, pulseDelay }: ContactIconProps) => {
    const [isPulsing, setIsPulsing] = useState(false);

    useEffect(() => {
        const startPulse = () => {
            setIsPulsing(true);
            setTimeout(() => setIsPulsing(false), 600);
        };

        // Initial delay then pulse every 4 seconds
        const initialTimeout = setTimeout(startPulse, pulseDelay);
        const interval = setInterval(startPulse, 4000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, [pulseDelay]);

    return (
        <span className={cn(
            "w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center transition-all duration-300",
            "group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/40",
            isPulsing && "scale-[1.05] shadow-lg shadow-purple-500/30"
        )}>
            {children}
        </span>
    );
};

// Social Icon with Presence Pulse
interface SocialIconProps {
    href: string;
    children: React.ReactNode;
    pulseDelay: number;
    hoverColor: string;
}

const SocialIcon = ({ href, children, pulseDelay, hoverColor }: SocialIconProps) => {
    const [isPulsing, setIsPulsing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const startPulse = () => {
            setIsPulsing(true);
            setTimeout(() => setIsPulsing(false), 600);
        };

        // Initial delay then pulse every 4-5 seconds
        const initialTimeout = setTimeout(startPulse, pulseDelay);
        const interval = setInterval(startPulse, 4500);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, [pulseDelay]);

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                isHovered
                    ? `bg-gradient-to-r ${hoverColor} scale-110 shadow-lg shadow-purple-500/30`
                    : "bg-neutral-800",
                isPulsing && !isHovered && "scale-[1.03] shadow-md shadow-purple-500/20"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </a>
    );
};


