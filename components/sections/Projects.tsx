import React from "react";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { cn } from "@/lib/utils";
import { IconClipboardCopy, IconFileBroken, IconSignature, IconTableColumn } from "@tabler/icons-react";
import Image from "next/image";

export function Projects() {
    const projects = [
        {
            title: "Mess Feedback System",
            description: "Enhanced a comprehensive feedback system for hostel dining services using HTML, CSS, and JS. Implemented dynamic reporting for targeted insights.",
            header: (
                <Image
                    src="/mess-feedback.jpg"
                    alt="Mess Feedback System"
                    height="1000"
                    width="1000"
                    className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                />
            ),
            icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
        },
        {
            title: "Smart Study Material Organizer",
            description: "AI-driven document organization using AWS (Textract, Comprehend, Lambda). Automated text extraction and indexing for efficient retrieval.",
            header: (
                <Image
                    src="/smart-study-organizer.jpg"
                    alt="Smart Study Material Organizer"
                    height="1000"
                    width="1000"
                    className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                />
            ),
            icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
        },
        {
            title: "CAD-RAG Framework",
            description: "Research project at IIT Patna. Proposed a Context-Aware Dynamic Rationale Generation framework for hate speech detection.",
            header: (
                <Image
                    src="/cad-rag-framework.jpg"
                    alt="CAD-RAG Framework"
                    height="1000"
                    width="1000"
                    className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                />
            ),
            icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
        },
        {
            title: "Real-time Auction Platform",
            description: "Developed and deployed a real-time auction platform for a college club event, handling concurrent users and live bidding.",
            header: (
                <Image
                    src="/auction-platform.jpg"
                    alt="Real-time Auction Platform"
                    height="1000"
                    width="1000"
                    className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                />
            ),
            icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
        },
    ];

    return (
        <section className="py-32 w-full">
            <h2 className="text-4xl font-bold text-center mb-16 text-white tracking-tight">Selected Projects</h2>
            <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[30rem]">
                {projects.map((item, i) => (
                    <CardContainer
                        key={i}
                        containerClassName={cn(
                            "py-0 w-full h-full",
                            i === 3 || i === 6 ? "md:col-span-2" : ""
                        )}
                        className="w-full h-full"
                    >
                        <CardBody className="bg-white dark:bg-black border border-transparent dark:border-white/[0.2] w-full h-full rounded-xl p-6 relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] flex flex-col justify-between">
                            <CardItem translateZ="50" className="w-full h-40 mb-4">
                                {item.header}
                            </CardItem>

                            <div className="flex flex-col gap-2">
                                <CardItem
                                    translateZ="60"
                                    className="text-xl font-bold text-neutral-600 dark:text-white"
                                >
                                    {item.title}
                                </CardItem>
                                <CardItem
                                    as="p"
                                    translateZ="40"
                                    className="text-neutral-500 text-sm max-w-sm dark:text-neutral-300"
                                >
                                    {item.description}
                                </CardItem>
                            </div>

                            <CardItem translateZ="30" className="mt-4">
                                {item.icon}
                            </CardItem>
                        </CardBody>
                    </CardContainer>
                ))}
            </BentoGrid>
        </section>
    );
}
