
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arnavpratap.dev"),
  title: "Arnav Pratap | Full-Stack & AI Engineer | IIT Research • VIT 2027",
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
        alt: "Arnav Pratap — Full-Stack & AI Engineer | IIT Patna Research • VIT 2027",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SmoothScrollProvider>
          <ScrollProgress />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
