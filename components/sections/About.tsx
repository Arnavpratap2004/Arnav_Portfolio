"use client";
import React from "react";
import { m } from "framer-motion";
import { IconCode, IconDatabase, IconCloud, IconBrain, IconTool, IconTerminal2 } from "@tabler/icons-react";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { AnimatedSkillGrid, SkillGridStyles } from "@/components/ui/AnimatedSkillGrid";

import {
    CplusplusOriginal,
    PythonOriginal,
    JavaOriginal,
    Html5Original,
    Css3Original,
    JavascriptOriginal,
    TypescriptOriginal,
    NodejsOriginal,
    ReactOriginal,
    NextjsOriginal,
    ExpressOriginal,
    TailwindcssOriginal,
    MongodbOriginal,
    MysqlOriginal,
    PostgresqlOriginal,
    AmazonwebservicesOriginalWordmark,
    DockerOriginal,
    LinuxOriginal,
    TensorflowOriginal,
    PytorchOriginal,
    PandasOriginal,
    NumpyOriginal,
    GitOriginal,
    GithubOriginal,
    PostmanOriginal,
    VscodeOriginal
} from "devicons-react";

const stats = [
    { value: "9.16", label: "CGPA", suffix: "" },
    { value: "6", label: "Projects", suffix: "+" },
    { value: "500", label: "Users", suffix: "+" },
    { value: "1", label: "IEEE Paper", suffix: "" },
];

export function About() {
    const skillCategories = [
        {
            title: "Languages",
            skills: [
                { name: "C++", icon: <CplusplusOriginal size={40} /> },
                { name: "Python", icon: <PythonOriginal size={40} /> },
                { name: "Java", icon: <JavaOriginal size={40} /> },
                { name: "HTML5", icon: <Html5Original size={40} /> },
                { name: "CSS3", icon: <Css3Original size={40} /> },
                { name: "JavaScript", icon: <JavascriptOriginal size={40} /> },
                { name: "TypeScript", icon: <TypescriptOriginal size={40} /> },
            ],
            icon: <IconCode className="w-6 h-6 text-blue-400" />
        },
        {
            title: "Frameworks",
            skills: [
                { name: "Node.js", icon: <NodejsOriginal size={40} /> },
                { name: "React", icon: <ReactOriginal size={40} /> },
                { name: "Next.js", icon: <NextjsOriginal size={40} /> },
                { name: "Express", icon: <ExpressOriginal size={40} className="invert" /> },
                { name: "Tailwind", icon: <TailwindcssOriginal size={40} /> },
            ],
            icon: <IconTerminal2 className="w-6 h-6 text-green-400" />
        },
        {
            title: "Databases",
            skills: [
                { name: "MongoDB", icon: <MongodbOriginal size={40} /> },
                { name: "MySQL", icon: <MysqlOriginal size={40} /> },
                { name: "PostgreSQL", icon: <PostgresqlOriginal size={40} /> },
            ],
            icon: <IconDatabase className="w-6 h-6 text-yellow-400" />
        },
        {
            title: "Cloud DevOps",
            skills: [
                { name: "AWS", icon: <AmazonwebservicesOriginalWordmark size={40} /> },
                { name: "Docker", icon: <DockerOriginal size={40} /> },
                { name: "Linux", icon: <LinuxOriginal size={40} /> },
            ],
            icon: <IconCloud className="w-6 h-6 text-orange-400" />
        },
        {
            title: "AI/ML",
            skills: [
                { name: "TensorFlow", icon: <TensorflowOriginal size={40} /> },
                { name: "PyTorch", icon: <PytorchOriginal size={40} /> },
                { name: "Pandas", icon: <PandasOriginal size={40} /> },
                { name: "NumPy", icon: <NumpyOriginal size={40} /> },
            ],
            icon: <IconBrain className="w-6 h-6 text-purple-400" />
        },
        {
            title: "Tools",
            skills: [
                { name: "Git", icon: <GitOriginal size={40} /> },
                { name: "GitHub", icon: <GithubOriginal size={40} className="invert" /> },
                { name: "Postman", icon: <PostmanOriginal size={40} /> },
                { name: "VS Code", icon: <VscodeOriginal size={40} /> },
            ],
            icon: <IconTool className="w-6 h-6 text-pink-400" />
        }
    ];

    return (
        <AuroraBackground className="h-auto min-h-screen pt-28 md:pt-36 pb-12 md:pb-20 w-full relative">
            <SkillGridStyles />
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4">

                {/* Personal Narrative Section */}
                <m.div
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
                                I&apos;ve gone from a VIT lab to an IIT research floor in
                                two years. The thread connecting everything I build: real
                                users, real deployment, real feedback loops.
                            </p>
                        </div>

                        {/* Right - Stats */}
                        <div className="md:col-span-2">
                            <div className="grid grid-cols-2 gap-4">
                                {stats.map((stat, i) => (
                                    <m.div
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 150, damping: 15 }}
                                        className="relative p-4 md:p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-center group hover:border-teal-500/30 hover:bg-white/10 transition-[border-color,background-color,transform] duration-300"
                                    >
                                        <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                                            {stat.value}{stat.suffix}
                                        </div>
                                        <div className="text-xs text-neutral-400 mt-1 font-medium tracking-wide uppercase">
                                            {stat.label}
                                        </div>
                                    </m.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </m.div>

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
