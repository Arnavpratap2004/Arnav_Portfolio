"use client";
import React from "react";
import { IconCode, IconDatabase, IconCloud, IconBrain, IconTool, IconTerminal2 } from "@tabler/icons-react";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { AnimatedSkillGrid, SkillGridStyles } from "@/components/ui/AnimatedSkillGrid";

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
        <AuroraBackground className="h-auto min-h-screen py-20 w-screen relative left-1/2 -ml-[50vw]">
            <SkillGridStyles />
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white tracking-tight mb-4">Technical Arsenal</h2>
                    <p className="text-neutral-400 max-w-lg mx-auto">
                        Hover to explore • Click to discover • My tools of the trade
                    </p>
                </div>
                <AnimatedSkillGrid categories={skillCategories} />
            </div>
        </AuroraBackground>
    );
}

