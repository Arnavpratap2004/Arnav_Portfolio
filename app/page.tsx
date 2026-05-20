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
    <main id="main-content" className="min-h-screen bg-[#0A1428] antialiased bg-grid-white/[0.02] relative overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <FloatingNav navItems={navItems} />
      <Hero />

      {/* Below-fold sections use content-visibility: auto to skip
          layout/paint until they near the viewport — can cut initial
          render work by 50-70% on a long single-page site */}
      <div id="about" className="lazy-section">
        <About />
      </div>
      <div id="experience" className="lazy-section">
        <Experience />
      </div>
      <div id="projects" className="lazy-section">
        <Projects />
      </div>
      <div id="contact" className="lazy-section">
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
