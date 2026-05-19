"use client";
import React from "react";
import { motion } from "framer-motion";
import { IconCode, IconDatabase, IconCloud, IconBrain, IconTool, IconTerminal2 } from "@tabler/icons-react";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { AnimatedSkillGrid, SkillGridStyles } from "@/components/ui/AnimatedSkillGrid";

const stats = [
    { value: "9.16", label: "CGPA", suffix: "" },
    { value: "6", label: "Projects", suffix: "+" },
    { value: "500", label: "Users", suffix: "+" },
    { value: "1", label: "Research Paper", suffix: "" },
];

export function About() {
    const skillCategories = [
        {
            title: "Languages",
            skills: [
                { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
                { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
                { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
                { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
                { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
                { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
                { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
            ],
            icon: <IconCode className="w-6 h-6 text-blue-400" />
        },
        {
            title: "Frameworks",
            skills: [
                { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
                { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
                { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
                { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", className: "invert" },
                { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
            ],
            icon: <IconTerminal2 className="w-6 h-6 text-green-400" />
        },
        {
            title: "Databases",
            skills: [
                { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
                { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
                { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
            ],
            icon: <IconDatabase className="w-6 h-6 text-yellow-400" />
        },
        {
            title: "Cloud DevOps",
            skills: [
                { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
                { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
                { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
            ],
            icon: <IconCloud className="w-6 h-6 text-orange-400" />
        },
        {
            title: "AI/ML",
            skills: [
                { name: "TensorFlow", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
                { name: "PyTorch", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
                { name: "Pandas", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
                { name: "NumPy", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
            ],
            icon: <IconBrain className="w-6 h-6 text-purple-400" />
        },
        {
            title: "Tools",
            skills: [
                { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
                { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", className: "invert" },
                { name: "Postman", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
                { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
            ],
            icon: <IconTool className="w-6 h-6 text-pink-400" />
        }
    ];

    return (
        <AuroraBackground className="h-auto min-h-screen py-12 md:py-20 w-full relative">
            <SkillGridStyles />
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4">

                {/* Personal Narrative Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="mb-20"
                >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10 items-center">
                        {/* Left - Story */}
                        <div className="md:col-span-3 space-y-4 md:space-y-5">
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                About Me
                            </h2>
                            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400" />
                            <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
                                Final-year B.Tech CSE student at VIT (9.16 CGPA) with research
                                experience at IIT Patna on Context-Aware Dynamic RAG for
                                hate-speech detection. I build end-to-end systems that solve
                                real problems — from hostel-scale feedback platforms serving
                                500+ daily users to real-time auction engines handling 200+
                                concurrent connections.
                            </p>
                            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                                My sweet spot is the intersection of full-stack engineering
                                and AI/ML — designing systems that are both technically robust
                                and genuinely useful. Whether it&apos;s building a RAG pipeline for
                                interpretable hate speech detection or deploying AWS-powered
                                document intelligence, I care deeply about shipping software
                                that creates measurable impact.
                            </p>
                        </div>

                        {/* Right - Stats */}
                        <div className="md:col-span-2">
                            <div className="grid grid-cols-2 gap-4">
                                {stats.map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 150, damping: 15 }}
                                        className="relative p-4 md:p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-center group hover:border-teal-500/30 hover:bg-white/10 transition-all duration-300"
                                    >
                                        <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                                            {stat.value}{stat.suffix}
                                        </div>
                                        <div className="text-xs text-neutral-400 mt-1 font-medium tracking-wide uppercase">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Skills Section */}
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3 md:mb-4">Technical Arsenal</h2>
                    <p className="text-neutral-400 max-w-lg mx-auto text-sm md:text-base">
                        Tap to explore • My tools of the trade
                    </p>
                </div>
                <AnimatedSkillGrid categories={skillCategories} />
            </div>
        </AuroraBackground>
    );
}
