"use client";
import React from "react";
import { GridBackground } from "@/components/ui/GridBackground";
import { AnimatedTimeline, TimelineStyles } from "@/components/ui/AnimatedTimeline";

export function Experience() {
    const timelineItems = [
        {
            type: "experience" as const,
            title: "Research Intern",
            organization: "Indian Institute of Technology, Patna (IITP)",
            location: "Hybrid",
            period: "June 2025 – August 2025",
            year: "2025",
            achievements: [
                "Proposed a novel framework, Context-Aware Dynamic Rationale Generation (CAD-RAG), for hate speech detection.",
                "Designed a dynamic knowledge base integrating evolving slur lexicons and incident reports.",
                "Developed a multi-query retrieval mechanism for detecting emerging \"zero-day\" hate speech.",
                "Built a RAG pipeline combining socio-temporal context with input text for interpretable outputs."
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
            grade: "CGPA: 9.16 / 10",
            achievements: [
                "Achieved Dean's List recognition for academic excellence",
                "Led technical projects in AI/ML and Web Development",
                "Active member of coding clubs and hackathon teams"
            ],
            gradientFrom: "from-emerald-500",
            gradientTo: "to-cyan-500",
        },
        {
            type: "education" as const,
            title: "12th Standard (CBSE)",
            organization: "St. Karen's Secondary School",
            location: "Patna",
            period: "2020 – 2022",
            year: "2022",
            grade: "Percentage: 86%",
            achievements: [
                "Optimized study techniques for competitive exam preparation",
                "Developed strong foundation in Mathematics and Computer Science"
            ],
            gradientFrom: "from-orange-500",
            gradientTo: "to-yellow-500",
        },
    ];

    return (
        <section className="py-20 w-screen relative overflow-hidden -mx-[calc((100vw-100%)/2)]">
            <TimelineStyles />

            {/* Animated Background - Full viewport width */}
            <div className="absolute inset-0 w-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
            <GridBackground className="absolute inset-0 w-screen h-full" />

            {/* Content */}
            <div className="relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white tracking-tight mb-4">
                        Experience & Education
                    </h2>
                    <p className="text-neutral-400 max-w-lg mx-auto">
                        Scroll through my journey • Hover to explore achievements
                    </p>
                </div>

                <div className="max-w-5xl mx-auto px-4">
                    <AnimatedTimeline items={timelineItems} />
                </div>
            </div>
        </section>
    );
}


