"use client";
import React, { useRef, useState, useEffect } from "react";
import { m, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ParticleNebula } from "@/components/ui/ParticleNebula";
import { NarrativeProjectCard } from "@/components/ui/NarrativeProjectCard";

type Project = {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    techStack: string[];
    highlight: string;
    badge?: string;
    projectLink: string;
};

type OrbitalProjectWrapperProps = {
    project: Project;
    index: number;
    total: number;
    progress: MotionValue<number>;
};

function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const handleChange = () => setMatches(mediaQuery.matches);

        handleChange();
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [query]);

    return matches;
}

export const OrbitalProjectWrapper = React.memo(function OrbitalProjectWrapper({ project, index, total, progress }: OrbitalProjectWrapperProps) {
    // Radius of the orbit and vertical spiral factor
    const [radius, setRadius] = useState(400); 
    const [yFactor, setYFactor] = useState(150);
    
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const updateLayout = () => {
            const isMobile = window.innerWidth < 768;
            setRadius(isMobile ? 200 : 450);
            setYFactor(isMobile ? 80 : 150);
        };

        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(updateLayout, 150);
        };

        updateLayout();
        window.addEventListener('resize', handleResize, { passive: true });
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeout);
        };
    }, []);

    // Base angle for this specific card
    const baseAngle = (index / total) * Math.PI * 2;
    
    // End the rotation exactly when the last card reaches the center so the section doesn't switch while empty
    const maxRotation = -((total - 1) / total) * Math.PI * 2;
    const rotation = useTransform(progress, [0, 1], [0, maxRotation]);
    const angle = useTransform(rotation, (r) => r + baseAngle);

    // Calculate Fake-3D Coordinates (X, Y, Z)
    const x = useTransform(angle, (a) => Math.sin(a) * radius);
    const z = useTransform(angle, (a) => Math.cos(a) * radius);
    
    // Bounded Y coordinate: normalizes angle to [-PI, PI] to create a continuous closed tornado loop.
    // This stops cards from flying off the top of the screen!
    const y = useTransform(angle, (a) => {
        let normalized = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        if (normalized > Math.PI) normalized -= Math.PI * 2;
        return normalized * yFactor;
    }); 

    // Depth sorting: fade heavily in the back
    // We also make sure ONLY the first card is visible at the very beginning of the scroll
    const opacity = useTransform(progress, (p: number) => {
        const a = p * maxRotation + baseAngle;
        const currentZ = Math.cos(a) * radius;
        
        let o = 1.0;
        // Keep cards 100% solid in the front half of the orbit.
        // Only fade them as they move into the back half.
        if (currentZ < 0) {
            const t = (currentZ + radius) / radius; // 0 at back, 1 at sides
            o = 0.2 + 0.8 * t; // 0.2 at back to 1.0 at sides
        }

        // Hide other cards initially so only CAD-RAG is visible
        if (index !== 0) {
            if (p < 0.01) return 0;
            if (p < 0.05) return o * ((p - 0.01) / 0.04);
        }
        
        return o;
    });

    const scale = useTransform(z, [-radius, radius], [0.4, 1]);
    
    // Crucial for true 3D Orbit: zIndex goes from 10 (back) to 100 (front)
    const zIndexRaw = useTransform(z, [-radius, radius], [10, 100]);
    const zIndex = useTransform(zIndexRaw, Math.round);

    // True 3D Billboarding: cards rotate to face tangentially/outward from the orbit
    // Convert radians to degrees for CSS rotateY
    const rotateY = useTransform(angle, (a) => `${a * (180 / Math.PI)}deg`);

    return (
        <div className="absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2 z-10">
            <m.div
                layout={false}
                className="w-[85vw] md:w-[500px]"
                style={{
                    x,
                    y,
                    rotateY,
                    scale,
                    opacity,
                    zIndex,
                    willChange: 'transform, opacity',
                }}
            >
                <NarrativeProjectCard {...project} />
            </m.div>
        </div>
    );
});

// PERF: Module-level constant — 6 project objects not re-allocated on every render.
const projects: Project[] = [
    {
        title: "CAD-RAG Framework",
        description:
            "Research project at IIT Patna addressing the challenge of detecting hate speech in evolving online discourse. Proposed a novel Context-Aware Dynamic Rationale Generation (CAD-RAG) framework combining retrieval-augmented generation with socio-temporal context. Built a dynamic knowledge base integrating evolving slur lexicons and incident reports, with a multi-query retrieval mechanism for detecting emerging 'zero-day' hate speech patterns.",
        imageSrc: "/cad-rag-framework.webp",
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
        imageSrc: "/auction-platform.webp",
        imageAlt: "Real-time Auction Platform",
        techStack: ["React", "WebSocket", "Node.js", "MongoDB", "Express"],
        highlight: "200+ Concurrent Users",
        projectLink: "https://github.com/Arnavpratap2004/Auction-Platform",
    },
    {
        title: "Mess Feedback System",
        description:
            "Designed and built a comprehensive feedback platform for hostel dining services, now used by 500+ students daily. Implemented dynamic reporting with real-time analytics dashboards showing meal-wise satisfaction trends, complaint categorization, and targeted insights that helped improve dining quality scores by 30%.",
        imageSrc: "/mess-feedback.webp",
        imageAlt: "Mess Feedback System",
        techStack: ["HTML", "CSS", "JavaScript", "Analytics"],
        highlight: "500+ Daily Users",
        projectLink: "https://github.com/Arnavpratap2004/Mess_Feedback_System",
    },
    {
        title: "Smart Study Material Organizer",
        description:
            "Engineered an AI-driven document intelligence pipeline using AWS cloud services. Automated text extraction via Textract, intelligent document categorization with Comprehend, and semantic indexing through Lambda functions — achieving 95% classification accuracy. Enables lightning-fast retrieval of study materials across thousands of uploaded documents.",
        imageSrc: "/smart-study-organizer.webp",
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
        imageSrc: "/stocksense.webp",
        imageAlt: "StockSense Inventory Management System",
        techStack: ["Next.js", "Tailwind CSS", "PostgreSQL", "Prisma"],
        highlight: "Full-Stack App",
        projectLink: "https://github.com/Arnavpratap2004/StockSense",
    },
    {
        title: "Homelia — E-Commerce Platform",
        description:
            "Modern e-commerce platform for home decor and furnishings with complete shopping experience. Implemented user authentication with role-based access, shopping cart management, product search and filtering, order processing, and responsive mobile-first design. Comprehensive E2E test suite covering all critical user journeys.",
        imageSrc: "/homelia.webp",
        imageAlt: "Homelia E-Commerce Platform",
        techStack: ["React", "Prisma", "Node.js", "Tailwind CSS"],
        highlight: "Full E2E Tested",
        projectLink: "https://github.com/Arnavpratap2004/Homelia",
    },
];

export function Projects() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isMobileLayout = useMediaQuery("(max-width: 767px)");
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // PERF: scrollYProgress updates on every scroll frame anywhere on the page, not just while
    // this section is on screen. Bound straight to the cards it meant that scrolling through
    // About re-wrote all six orbital cards' transform, opacity AND z-index every frame — ~600
    // style writes for content nobody could see, and the z-index churn forced the compositor to
    // re-sort paint order (traced as 338ms of Layerize). This mirror only tracks while the
    // section is near the viewport, so off-screen the cards' motion values go quiet.
    const gatedProgress = useMotionValue(0);
    const isNearRef = useRef(false);

    useMotionValueEvent(scrollYProgress, "change", (value) => {
        if (isNearRef.current) gatedProgress.set(value);
    });

    useEffect(() => {
        const element = containerRef.current;
        if (!element || isMobileLayout) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isNearRef.current = entry.isIntersecting;
                // Resync on entry so the orbit never animates in from a stale position.
                if (entry.isIntersecting) gatedProgress.set(scrollYProgress.get());
            },
            { rootMargin: "600px 0px" }
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, [gatedProgress, scrollYProgress, isMobileLayout]);

    if (isMobileLayout) {
        return (
            <section ref={containerRef} className="w-full relative bg-[#06090F] min-h-screen py-20 sm:py-28 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                    <ParticleNebula />
                </div>

                <div className="relative z-10 text-center w-full px-4 mb-10 pointer-events-none">
                    <h2 className="text-4xl font-bold text-white tracking-tight mb-3 drop-shadow-[0_0_30px_rgba(217,70,239,0.5)]">
                        Selected <span className="text-gradient-display">Projects</span>
                    </h2>
                    {/* "Scroll to orbit the archive" describes the md+ orbital carousel. This branch
                        is a plain stacked list — nothing orbits — so it says what is actually here. */}
                    <p className="text-neutral-400 max-w-lg mx-auto text-sm">
                        Things I&apos;ve designed, built and shipped
                    </p>
                </div>

                <div className="relative z-10 max-w-2xl mx-auto px-4 space-y-6">
                    {projects.map((project, index) => (
                        <NarrativeProjectCard key={index} {...project} />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section ref={containerRef} className="w-full relative bg-[#06090F] h-[400vh]">
            {/* The Sticky Viewport */}
            <div className="sticky [position:-webkit-sticky] top-0 h-screen w-full overflow-hidden perspective-[2000px]">
                
                {/* Holographic Particle Background (zIndex 0 so it stays perfectly behind all cards) */}
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                    <ParticleNebula />
                </div>

                {/* Section Title (Always visible, orbits behind, zIndex 110) */}
                <div className="absolute top-8 md:top-12 left-1/2 -translate-x-1/2 text-center w-full px-4 pointer-events-none" style={{ zIndex: 110 }}>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 drop-shadow-[0_0_30px_rgba(217,70,239,0.5)]">
                        Selected <span className="text-gradient-display">Projects</span>
                    </h2>
                    <p className="text-neutral-400 max-w-lg mx-auto text-sm md:text-base">
                        Scroll to orbit the archive
                    </p>
                </div>

                {/* Orbiting Carousel Container (No explicit zIndex here so children use global zIndex) */}
                <div className="absolute inset-0 w-full h-full">
                    {projects.map((project, index) => (
                        <OrbitalProjectWrapper 
                            key={index} 
                            project={project} 
                            index={index} 
                            total={projects.length} 
                            progress={gatedProgress}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
