
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";
import { LazyMotionProvider } from "@/components/ui/LazyMotionProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arnavpratap.tech"),
  title: "Arnav Pratap | Full-Stack & AI Engineer | IIT Patna Research",
  description:
    "Final-year CSE student at VIT with 9.16 CGPA. IIT Patna research on RAG-based hate speech detection. Full-stack projects with real users and production impact.",
  keywords: [
    "Arnav Pratap",
    "Full Stack Developer",
    "AI Engineer",
    "IIT Patna",
    "VIT",
    "React",
    "Next.js",
    "Machine Learning",
    "Portfolio",
  ],
  authors: [{ name: "Arnav Pratap" }],
  creator: "Arnav Pratap",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Arnav Pratap | Full-Stack & AI Engineer",
    description:
      "Final-year CSE student at VIT (9.16 CGPA). IIT Patna research on RAG-based hate speech detection. Full-stack projects with real users and production impact.",
    siteName: "Arnav Pratap — Portfolio",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Arnav Pratap — Full-Stack & AI Engineer | IIT Patna Research",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arnav Pratap | Full-Stack & AI Engineer",
    description:
      "IIT Patna research intern. VIT CSE 9.16 CGPA. Building production systems with React, Node.js, AWS & AI/ML.",
    images: ["/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon-192.png",
  },
  alternates: {
    canonical: "https://arnavpratap.tech",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Arnav Pratap",
  url: "https://arnavpratap.tech",
  jobTitle: "Full-Stack & AI Engineer",
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Vellore Institute of Technology" },
    { "@type": "CollegeOrUniversity", name: "Indian Institute of Technology, Patna" },
  ],
  sameAs: [
    "https://github.com/Arnavpratap2004",
    "https://www.linkedin.com/in/arnavpratap2004/",
  ],
  knowsAbout: ["React", "Next.js", "Machine Learning", "RAG", "NLP", "Python"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preconnect to external origins — saves 100-300ms per cold connection */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        {/* JSON-LD structured data for Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${inter.className}`}>
        {/* Skip-to-content for keyboard/screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <LazyMotionProvider>
          <SmoothScrollProvider>
            <ScrollProgress />
            {children}
          </SmoothScrollProvider>
        </LazyMotionProvider>
      </body>
    </html>
  );
}
