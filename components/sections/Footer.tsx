"use client";
import React from "react";
import { cn } from "@/lib/utils";

const GITHUB_URL = "https://github.com/Arnavpratap2004";
const LINKEDIN_URL = "https://www.linkedin.com/in/arnavpratap2004/";
const RESUME_URL =
    "https://drive.google.com/file/d/1vmWpALCPCccujC0YsqJK0LZgpsu9aFDi/view?usp=sharing";

const footerLinks = [
    {
        label: "GitHub",
        href: GITHUB_URL,
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
        ),
    },
    {
        label: "LinkedIn",
        href: LINKEDIN_URL,
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        label: "Email",
        href: "mailto:arnavpratap2003@gmail.com",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        label: "Resume",
        href: RESUME_URL,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
];

export function Footer() {
    return (
        <footer className="relative w-full">
            {/* Gradient Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

            <div className="bg-neutral-950/80 backdrop-blur-sm py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Left — Branding */}
                        <div className="text-center md:text-left">
                            <p className="text-sm text-neutral-400">
                                Built with{" "}
                                <span className="text-neutral-300 font-medium">Next.js</span>
                                {" "}&amp;{" "}
                                <span className="text-neutral-300 font-medium">Framer Motion</span>
                            </p>
                            <p className="text-xs text-neutral-500 mt-1">
                                &copy; 2025–2026 Arnav Pratap. All rights reserved.
                            </p>
                        </div>

                        {/* Right — Social Links */}
                        <div className="flex items-center gap-3">
                            {footerLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target={link.href.startsWith("mailto") ? undefined : "_blank"}
                                    rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                        "border border-white/10 bg-white/5 text-neutral-400",
                                        "hover:text-white hover:border-teal-500/40 hover:bg-white/10",
                                        "transition-all duration-300 hover:scale-110"
                                    )}
                                    aria-label={link.label}
                                    title={link.label}
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
