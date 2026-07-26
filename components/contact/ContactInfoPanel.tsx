"use client";

import { Download, Mail } from "lucide-react";
import { m } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

const EMAIL = "arnavpratap2003@gmail.com";
const textPrimary = "#dce8f2";
const textMuted = "#7a90a8";
const cyan = "#48b8d8";
const frost = "#7dd3e8";
const green = "#22d3a0";

interface ContactInfoPanelProps {
  isInView: boolean;
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export function ContactInfoPanel({ isInView }: ContactInfoPanelProps) {
  const [copied, setCopied] = useState(false);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
    };
  }, []);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);

    if (copyResetRef.current) clearTimeout(copyResetRef.current);
    copyResetRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <m.div
      layout={false}
      // PERF: Entrance no longer animates filter:blur — blur animation re-rasters this large
      // backdrop-filtered card every frame (measured as a ~350ms hitch entering Contact).
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card info-card"
      style={{
        background: "rgba(8,18,45,0.55)",
        // PERF: blur(16px) reads the same as 28px over the video while shrinking the filter kernel.
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",
        border: "1px solid rgba(96,165,230,0.20)",
        borderRadius: 24,
        boxShadow: "0 4px 48px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.07), 0 0 80px rgba(8,40,100,0.20)",
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        animation: "card-float 7s ease-in-out infinite",
        willChange: "transform",
      }}
    >
      <m.div
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } } }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-col gap-4"
      >
        <m.div variants={itemVariants} className="relative flex w-fit items-center gap-[8px] rounded-full px-[12px] py-[5px] text-[10px] font-bold uppercase tracking-[0.11em]" style={{ background: "rgba(34,211,160,0.10)", border: "1px solid rgba(34,211,160,0.28)", color: green }}>
          <span className="status-dot h-[7px] w-[7px] flex-shrink-0 rounded-full" style={{ background: green, boxShadow: "0 0 8px rgba(34,211,160,0.70)", animation: "breathe 2.5s ease-in-out infinite" }} />
          <span className="status-ring absolute left-[12px] h-[7px] w-[7px] rounded-full" style={{ border: "1.5px solid rgba(34,211,160,0.60)", animation: "ring-expand 2.5s ease-out infinite" }} />
          CURRENTLY AVAILABLE
        </m.div>

        <m.h3 variants={itemVariants} className="m-0 text-[1.32rem] font-bold tracking-[-0.01em]" style={{ color: textPrimary }}>
          Let&apos;s Build Something
        </m.h3>

        <m.p variants={itemVariants} className="m-0 text-[0.84rem] leading-[1.55]" style={{ color: textMuted }}>
          I&apos;m always open to discussing new projects, research collaborations, or opportunities to work on something meaningful.
        </m.p>

        <m.div variants={itemVariants} className="glass-inner flex flex-col gap-2.5 p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(96,165,230,0.12)", borderRadius: 14 }}>
          {[
            "Full-Stack & AI/ML Engineering roles",
            "Research Collaboration — NLP / Hate Speech",
            "Graduating 2027 · Open to full-time roles",
          ].map((line) => (
            <div key={line} className="flex items-center gap-2.5 text-[0.82rem] font-medium" style={{ color: "#c0d0e0" }}>
              <span className="h-[5px] w-[5px] flex-shrink-0 rounded-full" style={{ background: cyan, boxShadow: "0 0 6px rgba(72,184,216,0.60)" }} />
              {line}
            </div>
          ))}
        </m.div>

        <m.div variants={itemVariants} className="glass-inner flex items-center gap-3 px-3.5 py-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(96,165,230,0.12)", borderRadius: 14 }}>
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px]" style={{ background: "rgba(72,184,216,0.12)", color: cyan }}>
            <Mail size={18} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.10em]" style={{ color: textMuted }}>EMAIL</span>
            <a href={"mailto:" + EMAIL} className="truncate text-[0.74rem] sm:text-[0.8rem] font-medium" style={{ color: "#c0d0e0" }}>{EMAIL}</a>
          </div>
          <button
            type="button"
            onClick={copyEmail}
            className="min-h-11 sm:min-h-0 whitespace-nowrap rounded-lg px-3 sm:px-[14px] py-[6px] text-[0.78rem] font-semibold transition-all duration-200"
            style={{
              color: copied ? green : cyan,
              background: copied ? "rgba(34,211,160,0.10)" : "rgba(72,184,216,0.10)",
              border: "1px solid " + (copied ? "rgba(34,211,160,0.45)" : "rgba(72,184,216,0.25)"),
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </m.div>

        <m.div variants={itemVariants} className="flex items-center gap-2.5">
          <SocialButton href="https://www.linkedin.com/in/arnavpratap2004/" label="LinkedIn">
            <LinkedInMark />
          </SocialButton>
          <SocialButton href="https://github.com/Arnavpratap2004" label="GitHub">
            <GitHubMark />
          </SocialButton>
          <a
            href="/Arnav_Resume.pdf"
            download
            className="ml-auto flex min-h-11 sm:min-h-0 items-center gap-[7px] rounded-[10px] px-3.5 py-2 text-[0.8rem] font-semibold no-underline transition-all duration-200 hover:-translate-y-0.5"
            style={{ color: textPrimary, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(96,165,230,0.22)" }}
          >
            <Download size={15} />
            Download CV
          </a>
        </m.div>
      </m.div>
    </m.div>
  );
}

interface SocialButtonProps {
  href: string;
  label: string;
  children: ReactNode;
}

function SocialButton({ href, label, children }: SocialButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-11 w-11 sm:h-9 sm:w-9 items-center justify-center rounded-[10px] no-underline transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(96,165,230,0.18)", color: textMuted }}
      onMouseEnter={(event) => {
        event.currentTarget.style.background = "rgba(72,184,216,0.12)";
        event.currentTarget.style.borderColor = "rgba(72,184,216,0.40)";
        event.currentTarget.style.color = frost;
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background = "rgba(255,255,255,0.05)";
        event.currentTarget.style.borderColor = "rgba(96,165,230,0.18)";
        event.currentTarget.style.color = textMuted;
      }}
    >
      {children}
    </a>
  );
}

function LinkedInMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M6.94 8.98H3.62V20h3.32V8.98ZM5.28 4a1.93 1.93 0 1 0 0 3.86A1.93 1.93 0 0 0 5.28 4Zm5.34 4.98H7.45V20h3.28v-5.78c0-1.52.29-2.99 2.17-2.99 1.85 0 1.87 1.73 1.87 3.08V20h3.29v-6.43c0-3.16-.67-5.59-4.37-5.59-1.78 0-2.97.98-3.46 1.9h-.05l.44-1.9Z" />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12.03 2C6.49 2 2 6.58 2 12.22c0 4.51 2.88 8.34 6.87 9.69.5.09.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.8.62-3.39-1.22-3.39-1.22-.46-1.19-1.12-1.51-1.12-1.51-.91-.64.07-.63.07-.63 1.01.07 1.55 1.06 1.55 1.06.9 1.56 2.36 1.11 2.94.85.09-.66.35-1.11.64-1.37-2.23-.26-4.58-1.14-4.58-5.06 0-1.12.39-2.03 1.04-2.75-.1-.26-.45-1.3.1-2.71 0 0 .85-.28 2.77 1.05.8-.23 1.66-.34 2.52-.34.85 0 1.71.12 2.52.34 1.92-1.33 2.76-1.05 2.76-1.05.55 1.41.2 2.45.1 2.71.65.72 1.04 1.63 1.04 2.75 0 3.93-2.35 4.79-4.59 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.19 10.19 0 0 0 22 12.22C22 6.58 17.53 2 12.03 2Z" />
    </svg>
  );
}
