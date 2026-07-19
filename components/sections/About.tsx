"use client";

import { useRef, useState } from "react";
import { m } from "framer-motion";
import { IconBrain, IconCloud, IconCode, IconDatabase, IconTerminal2, IconTool } from "@tabler/icons-react";
import { AnimatedSkillGrid } from "@/components/ui/AnimatedSkillGrid";
import { GlassBackground } from "@/components/ui/GlassBackground";
import CplusplusOriginal from "devicons-react/icons/CplusplusOriginal";
import PythonOriginal from "devicons-react/icons/PythonOriginal";
import JavaOriginal from "devicons-react/icons/JavaOriginal";
import Html5Original from "devicons-react/icons/Html5Original";
import Css3Original from "devicons-react/icons/Css3Original";
import JavascriptOriginal from "devicons-react/icons/JavascriptOriginal";
import TypescriptOriginal from "devicons-react/icons/TypescriptOriginal";
import NodejsOriginal from "devicons-react/icons/NodejsOriginal";
import ReactOriginal from "devicons-react/icons/ReactOriginal";
import NextjsOriginal from "devicons-react/icons/NextjsOriginal";
import ExpressOriginal from "devicons-react/icons/ExpressOriginal";
import TailwindcssOriginal from "devicons-react/icons/TailwindcssOriginal";
import MongodbOriginal from "devicons-react/icons/MongodbOriginal";
import MysqlOriginal from "devicons-react/icons/MysqlOriginal";
import PostgresqlOriginal from "devicons-react/icons/PostgresqlOriginal";
import AmazonwebservicesOriginalWordmark from "devicons-react/icons/AmazonwebservicesOriginalWordmark";
import DockerOriginal from "devicons-react/icons/DockerOriginal";
import LinuxOriginal from "devicons-react/icons/LinuxOriginal";
import TensorflowOriginal from "devicons-react/icons/TensorflowOriginal";
import PytorchOriginal from "devicons-react/icons/PytorchOriginal";
import PandasOriginal from "devicons-react/icons/PandasOriginal";
import NumpyOriginal from "devicons-react/icons/NumpyOriginal";
import GitOriginal from "devicons-react/icons/GitOriginal";
import GithubOriginal from "devicons-react/icons/GithubOriginal";
import PostmanOriginal from "devicons-react/icons/PostmanOriginal";
import VscodeOriginal from "devicons-react/icons/VscodeOriginal";

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
    icon: <IconCode className="h-6 w-6 text-blue-400" />,
    accent: "#60A5FA",
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
    icon: <IconTerminal2 className="h-6 w-6 text-green-400" />,
    accent: "#4ADE80",
  },
  {
    title: "Databases",
    skills: [
      { name: "MongoDB", icon: <MongodbOriginal size={40} /> },
      { name: "MySQL", icon: <MysqlOriginal size={40} /> },
      { name: "PostgreSQL", icon: <PostgresqlOriginal size={40} /> },
    ],
    icon: <IconDatabase className="h-6 w-6 text-yellow-400" />,
    accent: "#FACC15",
  },
  {
    title: "Cloud DevOps",
    skills: [
      { name: "AWS", icon: <AmazonwebservicesOriginalWordmark size={40} /> },
      { name: "Docker", icon: <DockerOriginal size={40} /> },
      { name: "Linux", icon: <LinuxOriginal size={40} /> },
    ],
    icon: <IconCloud className="h-6 w-6 text-orange-400" />,
    accent: "#FB923C",
  },
  {
    title: "AI/ML",
    skills: [
      { name: "TensorFlow", icon: <TensorflowOriginal size={40} /> },
      { name: "PyTorch", icon: <PytorchOriginal size={40} /> },
      { name: "Pandas", icon: <PandasOriginal size={40} /> },
      { name: "NumPy", icon: <NumpyOriginal size={40} /> },
    ],
    icon: <IconBrain className="h-6 w-6 text-purple-400" />,
    accent: "#C084FC",
  },
  {
    title: "Tools",
    skills: [
      { name: "Git", icon: <GitOriginal size={40} /> },
      { name: "GitHub", icon: <GithubOriginal size={40} className="invert" /> },
      { name: "Postman", icon: <PostmanOriginal size={40} /> },
      { name: "VS Code", icon: <VscodeOriginal size={40} /> },
    ],
    icon: <IconTool className="h-6 w-6 text-pink-400" />,
    accent: "#F472B6",
  },
];

const TOTAL_TECHNOLOGIES = skillCategories.reduce((sum, category) => sum + category.skills.length, 0);

/** One-shot ease-out count-up that starts when the chip scrolls into view. */
function StatCounter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);

  const start = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    const t0 = performance.now();
    const duration = 1000;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - t0) / duration);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return (
    <m.div
      onViewportEnter={start}
      viewport={{ once: true }}
      className="flex items-baseline gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2"
    >
      <span className="text-xl font-extrabold tabular-nums text-white md:text-2xl">
        {display}
        {suffix}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400 md:text-[11px]">{label}</span>
    </m.div>
  );
}

export function About() {
  return (
    <section className="relative h-auto min-h-screen w-full overflow-hidden bg-[#06090F] pb-12 pt-28 md:pb-20 md:pt-36">
      <GlassBackground className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-40 pointer-events-none bg-gradient-to-b from-[#06090F] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none bg-gradient-to-t from-[#06090F] to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pointer-events-auto">
        <div className="mb-10 text-center md:mb-14">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Technical </span>
            <span className="text-gradient-display drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">Arsenal</span>
          </h2>
          <p className="mx-auto max-w-lg text-sm font-medium uppercase tracking-[0.15em] text-neutral-400 md:text-base">
            <span className="text-purple-400/90">Tap to explore</span>
            <span className="mx-3 text-neutral-600">&bull;</span>
            My tools of the trade
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <StatCounter value={TOTAL_TECHNOLOGIES} label="Technologies" />
            <StatCounter value={skillCategories.length} label="Domains" />
            <StatCounter value={4} suffix="+" label="Years Building" />
          </div>
        </div>
        <AnimatedSkillGrid categories={skillCategories} />
      </div>
    </section>
  );
}
