"use client"

import { IconBrandGithub, IconBrandLinkedin, IconMail, IconFileText } from "@tabler/icons-react"

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
]

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.07] bg-[#080c14]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-[18px] sm:px-10">

        {/* ── Left — name · copyright · availability ── */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">

          <span className="text-[15px] font-medium tracking-tight text-white">
            Arnav Pratap
          </span>

          <span className="text-xs text-white/35">© 2025–2026</span>

          {/* Availability badge */}
          <span className="inline-flex items-center gap-[6px] rounded-full border border-white/10 px-[10px] py-[3px] text-[11px] text-white/45">
            {/* Pulsing green dot */}
            <span className="relative flex h-[6px] w-[6px] flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-green-400" />
            </span>
            Available for internships
          </span>

        </div>

        {/* ── Right — icon buttons ── */}
        <div className="flex items-center gap-2">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon, download }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              {...(download ? { download } : { target: "_blank", rel: "noopener noreferrer" })}
              className="
                flex h-[34px] w-[34px] items-center justify-center
                rounded-full border border-white/[0.12] text-white/50
                transition-all duration-200
                hover:border-white/35 hover:text-white/85
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
              "
            >
              <Icon size={15} strokeWidth={1.6} />
            </a>
          ))}
        </div>

      </div>
    </footer>
  )
}
