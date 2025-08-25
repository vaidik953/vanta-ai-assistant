import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AIProvider } from "../contexts/AIContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vanta - Your Smart Academic & Creative Helper",
  description: "AI-powered assistant for academic writing, mathematical equations, and diagram creation with Physics and PE specialization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AIProvider>
          {children}
        </AIProvider>
      </body>
    </html>
  );
}
