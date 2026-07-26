"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Hero } from "@/components/sections/Hero";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { IconBriefcase, IconHome, IconLayoutGrid, IconMail, IconUser } from "@tabler/icons-react";
import dynamic from "next/dynamic";



// Below-fold sections: client-only chunks keep their canvas/WebGL work out of the initial tree.
const sectionLoader = () => <div className="h-screen" />;
const About = dynamic(() => import("@/components/sections/About").then(m => m.About), { ssr: false, loading: sectionLoader });
const Experience = dynamic(() => import("@/components/sections/Experience").then(m => m.Experience), { ssr: false, loading: sectionLoader });
const Projects = dynamic(() => import("@/components/sections/Projects").then(m => m.Projects), { ssr: false, loading: sectionLoader });
const Contact = dynamic(() => import("@/components/contact/ContactSection"), { ssr: false, loading: sectionLoader });

const Footer = dynamic(() => import("@/components/sections/Footer").then(m => m.Footer), { ssr: true });

type DeferredSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  minHeight: string;
  preloadMargin?: string;
  premountDelay?: number;
};

function DeferredSection({ children, className, id, minHeight, preloadMargin = "0px", premountDelay }: DeferredSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;

    const element = ref.current;

    const reveal = () => setShouldRender(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        // PERF: Do not import below-fold chunks until the section actually enters view.
        if (entry.isIntersecting && entry.intersectionRatio > 0) reveal();
      },
      { threshold: 0.01, rootMargin: preloadMargin }
    );

    if (element) observer.observe(element);

    // PERF: Premount during post-load idle time (staggered per section) so chunk download,
    // shader compile, and WebGL init never land mid-scroll — first-mount during scroll was
    // producing 300–466ms frames. Off-screen sections stay cheap: their RAF loops are gated
    // by IntersectionObserver and content-visibility skips their layout/paint.
    let timerId: number | undefined;
    let idleId: number | undefined;
    if (premountDelay !== undefined) {
      timerId = window.setTimeout(() => {
        if (typeof window.requestIdleCallback === "function") {
          idleId = window.requestIdleCallback(reveal, { timeout: 2000 });
        } else {
          reveal();
        }
      }, premountDelay);
    }

    return () => {
      observer.disconnect();
      if (timerId !== undefined) window.clearTimeout(timerId);
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [preloadMargin, premountDelay, shouldRender]);

  useEffect(() => {
    if (!shouldRender) return;

    // PERF: After the section has mounted, promote it out of content-visibility:auto during idle.
    // Otherwise Chrome defers the subtree's first style/layout/paint until it scrolls near the
    // viewport — a single 300ms+ frame mid-scroll. Paying it during idle keeps scrolling clean.
    const element = ref.current;
    let idleId: number | undefined;
    const timerId = window.setTimeout(() => {
      const promote = () => {
        if (element) element.style.contentVisibility = "visible";
      };
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(promote, { timeout: 3000 });
      } else {
        promote();
      }
    }, 1200);

    return () => {
      window.clearTimeout(timerId);
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [shouldRender]);

  return (
    <div
      id={id}
      ref={ref}
      className={className}
      style={shouldRender ? undefined : { minHeight }}
    >
      {shouldRender ? children : null}
    </div>
  );
}

// PERF: Module-level constant — not re-allocated on every render.
// Icons are the mobile presentation of each item; the truncated 3-letter fallback
// ("Hom", "Abo", "Exp") read as broken text at 10px.
const navItems = [
  { name: "Home", link: "/", icon: <IconHome size={19} stroke={1.7} /> },
  { name: "About", link: "#about", icon: <IconUser size={19} stroke={1.7} /> },
  { name: "Experience", link: "#experience", icon: <IconBriefcase size={19} stroke={1.7} /> },
  { name: "Projects", link: "#projects", icon: <IconLayoutGrid size={19} stroke={1.7} /> },
  { name: "Contact", link: "#contact", icon: <IconMail size={19} stroke={1.7} /> },
];

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-[#06090F] antialiased relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <FloatingNav navItems={navItems} />
      <div className="relative w-full z-0 bg-[#06090F]">
        <Hero />
      </div>

      <DeferredSection id="about" className="lazy-section relative z-10 bg-[#06090F]" minHeight="100vh" preloadMargin="1400px 0px" premountDelay={1800}>
        <About />
      </DeferredSection>

      <DeferredSection id="experience" className="lazy-section relative z-10 bg-[#06090F]" minHeight="100vh" preloadMargin="1200px 0px" premountDelay={2600}>
        <Experience />
      </DeferredSection>

      <DeferredSection id="projects" className="lazy-section lazy-section-projects relative z-10 bg-[#06090F]" minHeight="400vh" preloadMargin="1200px 0px" premountDelay={3400}>
        <Projects />
      </DeferredSection>
      <DeferredSection id="contact" className="relative z-10 bg-[#06090F]" minHeight="100svh" preloadMargin="1200px 0px" premountDelay={4200}>
        <div className="min-h-[100svh] bg-[#040c1a]">
          <Contact />
          <Footer />
        </div>
      </DeferredSection>
    </main>
  );
}

