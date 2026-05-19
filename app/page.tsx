import { Hero } from "@/components/sections/Hero";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import dynamic from "next/dynamic";

// Below-fold sections: loaded only when the user scrolls near them
const About = dynamic(() => import("@/components/sections/About").then(m => m.About), { ssr: true });
const Experience = dynamic(() => import("@/components/sections/Experience").then(m => m.Experience), { ssr: true });
const Projects = dynamic(() => import("@/components/sections/Projects").then(m => m.Projects), { ssr: true });
const Contact = dynamic(() => import("@/components/sections/Contact").then(m => m.Contact), { ssr: true });
const Footer = dynamic(() => import("@/components/sections/Footer").then(m => m.Footer), { ssr: true });

export default function Home() {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "#about" },
    { name: "Experience", link: "#experience" },
    { name: "Projects", link: "#projects" },
    { name: "Contact", link: "#contact" },
  ];

  return (
    <main className="min-h-screen bg-[#0A1428] antialiased bg-grid-white/[0.02] relative overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <FloatingNav navItems={navItems} />
      <Hero />
      <div id="about">
        <About />
      </div>
      <div id="experience">
        <Experience />
      </div>
      <div id="projects">
        <Projects />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
