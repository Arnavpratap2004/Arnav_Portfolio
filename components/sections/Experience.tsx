"use client";
import React from "react";
import { m } from "framer-motion";
import { IconTrophy, IconSchool, IconFileText, IconCode } from "@tabler/icons-react";
import LineWaves from "@/components/ui/LineWaves";
import { AnimatedTimeline, TimelineStyles } from "@/components/ui/AnimatedTimeline";

const HIGHLIGHTS = [
    { icon: IconTrophy, label: "Cisco CSR Hackathon — National Finalist", color: "#FACC15" },
    { icon: IconSchool, label: "Amazon ML Summer School '26", color: "#FB923C" },
    { icon: IconFileText, label: "IEEE Paper — CAD-RAG", color: "#60A5FA" },
    { icon: IconCode, label: "300+ DSA Problems", color: "#4ADE80" },
];

export function Experience() {
    const timelineItems = [
        {
            type: "experience" as const,
            title: "Research Intern — Multi-Agent LLM Systems",
            organization: "Indian Institute of Technology, Patna (IITP)",
            location: "Hybrid",
            period: "June 2026 – July 2026",
            year: "2026",
            achievements: [
                "Architected a cost-aware Multi-Agent Debate (MAD) pipeline with Llama 3 (8B) for Hindi–Hinglish hate-speech detection",
                "Engineered efficiency modules — Debate Necessity Predictor, Contrastive Precedent Injection, and Intra-Debate Entropy Early Exit — cutting token cost by up to 74.28%",
                "Raised accuracy from a 66.7% zero-shot baseline to 77.22%, approaching the 79.8% full-debate ceiling"
            ],
            gradientFrom: "from-purple-500",
            gradientTo: "to-pink-500",
        },
        {
            type: "experience" as const,
            title: "Research Intern — NLP & RAG",
            organization: "Indian Institute of Technology, Patna (IITP)",
            location: "Hybrid",
            period: "June 2025 – August 2025",
            year: "2025",
            achievements: [
                "Published CAD-RAG framework (IEEE paper) for zero-day hate speech detection using dynamic RAG pipelines",
                "Built a dynamic knowledge base integrating real-time slur lexicons and incident reports for evolving hate speech",
                "Developed multi-query retrieval mechanism detecting emerging zero-day hate speech patterns",
                "Engineered interpretable RAG pipeline combining socio-temporal context with input text"
            ],
            gradientFrom: "from-blue-500",
            gradientTo: "to-purple-500",
        },
        {
            type: "education" as const,
            title: "B.Tech in Computer Science & Engineering",
            organization: "Vellore Institute of Technology",
            location: "Vellore",
            period: "2023 – 2027",
            year: "2023",
            grade: "CGPA: 9.00 / 10",
            achievements: [
                "Achieved Dean's List recognition for academic excellence",
                "Led technical projects in AI/ML and Web Development",
                "Active member of coding clubs and hackathon teams"
            ],
            gradientFrom: "from-emerald-500",
            gradientTo: "to-cyan-500",
        },
    ];

    return (
        // `overflow-x-clip`, deliberately not `overflow-hidden`. Hidden makes this section the scroll
        // container for the timeline's `sticky` year pill, and since the section never scrolls
        // internally the pill never stuck — it rode 1166px off-screen. `clip` still contains the
        // cards' horizontal entrance slide but does not establish a scroll container, so sticky works.
        <section className="pt-20 md:pt-36 pb-12 md:pb-20 w-full relative overflow-x-clip">
            <TimelineStyles />

            {/* Animated Background */}
            <div className="absolute inset-0 bg-[#06090F]" />
            <div className="absolute inset-0 z-0 overflow-hidden">
                <LineWaves
                    rotation={-38}
                    speed={0.35}
                    warpIntensity={0.3}
                    innerLineCount={40}
                    outerLineCount={15}
                    edgeFadeWidth={0}
                    colorCycleSpeed={0.5}
                    brightness={0.35}
                    color1="#A855F7" // Purple
                    color2="#EC4899" // Pink
                    color3="#06090F" // Dark background
                    enableMouseInteraction
                    mouseInfluence={1.6}
                />
            </div>

            {/* Melt the wave field into the neighbouring sections. Without these the diagonal lines
                stop dead at both section edges — the same hard seam the hero had. About already
                carries its own fades; this section had none. */}
            <div className="absolute inset-x-0 top-0 z-[1] h-28 md:h-40 pointer-events-none bg-gradient-to-b from-[#06090F] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-[1] h-28 md:h-40 pointer-events-none bg-gradient-to-t from-[#06090F] to-transparent" />

            {/* Content */}
            <div className="relative z-10">
                <div className="text-center mb-12 md:mb-20 px-4 relative">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                        <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase">
                            My Timeline
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 drop-shadow-[0_0_25px_rgba(168,85,247,0.3)]">
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">Experience & </span>
                        <span className="text-gradient-display">Education</span>
                    </h2>
                    <p className="text-neutral-400 max-w-lg mx-auto text-balance text-xs sm:text-sm md:text-base font-medium tracking-[0.12em] sm:tracking-[0.15em] uppercase">
                        <span className="text-pink-400/90">Scroll to explore</span>
                        <span className="mx-2 sm:mx-3 text-neutral-600">•</span>
                        My journey
                    </p>

                    {/* Resume highlights */}
                    <m.div
                        // 2-up grid on mobile. Centre-wrapped, these four wrapped to one row each at
                        // widths 287/235/189/171 — a ragged staircase costing 184px. Equal cells
                        // halve that and actually line up.
                        className="mt-6 grid grid-cols-2 items-stretch gap-2 sm:mt-7 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {HIGHLIGHTS.map(({ icon: Icon, label, color }) => (
                            <span
                                key={label}
                                // PERF: backdrop-blur dropped — these sit directly over the animating
                                // LineWaves canvas and re-filtered it every frame, the same tradeoff
                                // already made for the skill/timeline cards. A more opaque tint reads
                                // identically over this dark background.
                                className="inline-flex items-center gap-2 rounded-2xl sm:rounded-full border border-white/10 bg-[#0d1322]/75 px-3 py-2 sm:px-4 text-left text-[11px] sm:text-xs font-medium text-white/85"
                            >
                                <Icon size={15} strokeWidth={1.8} style={{ color }} className="flex-shrink-0" />
                                {label}
                            </span>
                        ))}
                    </m.div>
                </div>

                <div className="max-w-5xl mx-auto px-4">
                    <AnimatedTimeline items={timelineItems} />
                </div>
            </div>
        </section>
    );
}


