"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { FloatingBubbles } from "@/components/ui/FloatingBubbles";
import { NarrativeProjectCard } from "@/components/ui/NarrativeProjectCard";

export function Projects() {
    const projects = [
        {
            title: "CAD-RAG Framework",
            description:
                "Research project at IIT Patna addressing the challenge of detecting hate speech in evolving online discourse. Proposed a novel Context-Aware Dynamic Rationale Generation (CAD-RAG) framework combining retrieval-augmented generation with socio-temporal context. Built a dynamic knowledge base integrating evolving slur lexicons and incident reports, with a multi-query retrieval mechanism for detecting emerging 'zero-day' hate speech patterns.",
            imageSrc: "/cad-rag-framework.jpg",
            imageAlt: "CAD-RAG Framework — IIT Patna Research",
            techStack: ["Python", "NLP", "RAG", "PyTorch", "Research"],
            highlight: "IIT Research",
            badge: "IIT Patna • IEEE Paper",
            projectLink: "https://github.com/Arnavpratap2004/HateSpeech_using_CAD-RAG",
        },
        {
            title: "Real-time Auction Platform",
            description:
                "Built and deployed a production-grade real-time auction platform for a college club event. Engineered WebSocket-based live bidding with instant notifications, handling 200+ concurrent users with zero downtime. Features include real-time bid updates, countdown timers, user authentication, bid history tracking, and admin dashboard for item management.",
            imageSrc: "/auction-platform.jpg",
            imageAlt: "Real-time Auction Platform",
            techStack: ["React", "WebSocket", "Node.js", "MongoDB", "Express"],
            highlight: "200+ Concurrent Users",
            projectLink: "https://github.com/Arnavpratap2004/Auction-Platform",
        },
        {
            title: "Mess Feedback System",
            description:
                "Designed and built a comprehensive feedback platform for hostel dining services, now used by 500+ students daily. Implemented dynamic reporting with real-time analytics dashboards showing meal-wise satisfaction trends, complaint categorization, and targeted insights that helped improve dining quality scores by 30%.",
            imageSrc: "/mess-feedback.jpg",
            imageAlt: "Mess Feedback System",
            techStack: ["HTML", "CSS", "JavaScript", "Analytics"],
            highlight: "500+ Daily Users",
            projectLink: "https://github.com/Arnavpratap2004/Mess_Feedback_System",
        },
        {
            title: "Smart Study Material Organizer",
            description:
                "Engineered an AI-driven document intelligence pipeline using AWS cloud services. Automated text extraction via Textract, intelligent document categorization with Comprehend, and semantic indexing through Lambda functions — achieving 95% classification accuracy. Enables lightning-fast retrieval of study materials across thousands of uploaded documents.",
            imageSrc: "/smart-study-organizer.jpg",
            imageAlt: "Smart Study Material Organizer",
            techStack: ["AWS", "Textract", "Comprehend", "Lambda", "Python"],
            highlight: "95% Accuracy",
            badge: "AWS AI Pipeline",
            projectLink: "https://github.com/Arnavpratap2004/Study-Mate",
        },
        {
            title: "StockSense — Inventory Management",
            description:
                "Full-stack inventory management system with a premium 'Dark Industrial Precision' UI. Features real-time stock tracking, automated transaction logging, role-based access control, comprehensive reporting dashboards, and audit trail functionality. Built with a data-dense dark aesthetic optimized for warehouse operations.",
            imageSrc: "/smart-study-organizer.jpg",
            imageAlt: "StockSense Inventory Management System",
            techStack: ["Next.js", "Tailwind CSS", "PostgreSQL", "Prisma"],
            highlight: "Full-Stack App",
            projectLink: "https://github.com/Arnavpratap2004/StockSense",
        },
        {
            title: "Homelia — E-Commerce Platform",
            description:
                "Modern e-commerce platform for home decor and furnishings with complete shopping experience. Implemented user authentication with role-based access, shopping cart management, product search and filtering, order processing, and responsive mobile-first design. Comprehensive E2E test suite covering all critical user journeys.",
            imageSrc: "/mess-feedback.jpg",
            imageAlt: "Homelia E-Commerce Platform",
            techStack: ["React", "Prisma", "Node.js", "Tailwind CSS"],
            highlight: "Full E2E Tested",
            projectLink: "https://github.com/Arnavpratap2004/Homelia",
        },
        {
            title: "Nodebase — Workflow Automation",
            description:
                "Enterprise-grade workflow automation platform enabling users to build multi-step automated pipelines. Features Better Auth-based authentication, Polar.sh billing integration, encrypted credential management, database node integrations for PostgreSQL and MongoDB, and a visual workflow builder. Deployed on AWS EC2 with Aurora database.",
            imageSrc: "/auction-platform.jpg",
            imageAlt: "Nodebase Workflow Automation Platform",
            techStack: ["Next.js", "AWS EC2", "Aurora", "Better Auth"],
            highlight: "Enterprise SaaS",
            badge: "AWS Deployed",
            projectLink: "https://github.com/Arnavpratap2004/Nodebase",
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
                        From research frameworks to production systems — each project solves a real problem
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
                                badge={project.badge}
                                className={cn(
                                    index === 0 && "md:delay-0",
                                    index === 1 && "md:delay-100",
                                    index === 2 && "md:delay-200",
                                    index === 3 && "md:delay-300",
                                    index === 4 && "md:delay-400",
                                    index === 5 && "md:delay-500",
                                    index === 6 && "md:delay-600",
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
