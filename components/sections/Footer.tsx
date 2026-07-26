"use client";

import { IconBrandGithub, IconBrandLinkedin, IconMail, IconFileText } from "@tabler/icons-react";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/Arnavpratap2004",
    icon: IconBrandGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/arnavpratap2004/",
    icon: IconBrandLinkedin,
  },
  {
    label: "Email",
    href: "mailto:arnavpratap2003@gmail.com",
    icon: IconMail,
  },
  {
    label: "Resume",
    href: "/Arnav_Resume.pdf",
    icon: IconFileText,
    download: "Arnav_Pratap_Resume.pdf",
  },
];

export function Footer() {
  return (
    // Auto height on mobile: the fixed h-14 could not contain the wrapped rows, so the
    // social icons were clipped by the footer's own bottom edge.
    // pb keeps the last row clear of the home-indicator bar on notched phones; env() resolves
    // to 0 everywhere else, so this costs nothing on ordinary devices.
    <footer className="w-full border-t border-cyan-200/[0.12] bg-[#040c1a]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] sm:h-14 sm:pb-0">
      <div className="mx-auto flex h-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:flex-wrap sm:py-0 sm:px-6 md:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:justify-start">
          <span className="text-[14px] font-medium tracking-tight text-white">
            Arnav Pratap
          </span>
          <span className="text-xs text-white/55">&copy; 2026-2027</span>
          <span className="inline-flex items-center gap-[6px] rounded-full border border-white/10 bg-white/[0.025] px-[10px] py-[3px] text-[11px] text-white/45">
            <span className="relative flex h-[6px] w-[6px] flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-green-400" />
            </span>
            Open to full-time roles
          </span>
        </div>

        <div className="flex items-center gap-2">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon, download }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              {...(download ? { download } : { target: "_blank", rel: "noopener noreferrer" })}
              className="flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-cyan-100/[0.14] text-white/50 transition-all duration-200 hover:border-cyan-300/40 hover:text-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <Icon size={16} strokeWidth={1.6} className="sm:size-3.5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
