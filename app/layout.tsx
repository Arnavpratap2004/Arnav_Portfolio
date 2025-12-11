
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arnav's Portfolio",
  description: "Modern Portfolio built with Next.js",
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon-192.png',
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
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}

