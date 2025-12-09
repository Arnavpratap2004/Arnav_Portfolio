"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { FloatingBubbles } from "@/components/ui/FloatingBubbles";
import { NarrativeProjectCard } from "@/components/ui/NarrativeProjectCard";

export function Projects() {
    const projects = [
        {
            title: "Mess Feedback System",
            description: "Enhanced a comprehensive feedback system for hostel dining services using HTML, CSS, and JS. Implemented dynamic reporting with real-time analytics for targeted insights and improved dining experience.",
            imageSrc: "/mess-feedback.jpg",
            imageAlt: "Mess Feedback System",
            techStack: ["HTML", "CSS", "JavaScript", "Analytics"],
            highlight: "500+ Daily Users",
            projectLink: "https://github.com/Arnavpratap2004/Mess_Feedback_System",
        },
        {
            title: "Smart Study Material Organizer",
            description: "AI-driven document organization using AWS (Textract, Comprehend, Lambda). Automated text extraction, intelligent categorization, and semantic indexing for lightning-fast retrieval.",
            imageSrc: "/smart-study-organizer.jpg",
            imageAlt: "Smart Study Material Organizer",
            techStack: ["AWS", "Textract", "Lambda", "Python"],
            highlight: "95% Accuracy",
            projectLink: "https://github.com/Arnavpratap2004/Study-Mate",
        },
        {
            title: "CAD-RAG Framework",
            description: "Research project at IIT Patna. Proposed a Context-Aware Dynamic Rationale Generation framework for hate speech detection using advanced NLP and retrieval-augmented generation.",
            imageSrc: "/cad-rag-framework.jpg",
            imageAlt: "CAD-RAG Framework",
            techStack: ["Python", "NLP", "RAG", "Research"],
            highlight: "IIT Research",
            projectLink: "https://github.com/Arnavpratap2004/HateSpeech_using_CAD-RAG",
        },
        {
            title: "Real-time Auction Platform",
            description: "Developed and deployed a real-time auction platform for a college club event, handling 200+ concurrent users with WebSocket-based live bidding and instant notifications.",
            imageSrc: "/auction-platform.jpg",
            imageAlt: "Real-time Auction Platform",
            techStack: ["React", "WebSocket", "Node.js", "MongoDB"],
            highlight: "200+ Concurrent Users",
            projectLink: "https://github.com/Arnavpratap2004/Auction-Platform",
        },
    ];

    return (
        <section className="py-32 w-screen relative overflow-hidden -mx-[calc((100vw-100%)/2)]">
            {/* Animated Background - Full viewport width */}
            <div className="absolute inset-0 w-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
            <FloatingBubbles className="absolute inset-0 w-screen h-full" />

            {/* Content */}
            <div className="relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white tracking-tight mb-4">Selected Projects</h2>
                    <p className="text-neutral-400 max-w-lg mx-auto">
                        Hover to discover • Scroll to reveal • Click to explore
                    </p>
                </div>

                {/* Project Grid with Narrative Cards */}
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.map((project, index) => (
                            <NarrativeProjectCard
                                key={index}
                                title={project.title}
                                description={project.description}
                                imageSrc={project.imageSrc}
                                imageAlt={project.imageAlt}
                                techStack={project.techStack}
                                highlight={project.highlight}
                                projectLink={project.projectLink}
                                className={cn(
                                    // Stagger animation delay
                                    index === 0 && "md:delay-0",
                                    index === 1 && "md:delay-100",
                                    index === 2 && "md:delay-200",
                                    index === 3 && "md:delay-300"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

