import type { Metadata } from "next";
import SplashScreen from "@/components/layout/SplashScreen";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Portfolio from "@/components/sections/Portfolio";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export function generateMetadata(): Metadata {
  return {
    title: {
      absolute: "Anuja Jayasinghe | Software Engineer",
    },
    description:
      "Explore Anuja Jayasinghe's portfolio featuring software projects, technical skills, and professional achievements.",
    alternates: {
      canonical: "/",
    },
  };
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white w-full overflow-x-hidden relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded focus:bg-black focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to content
      </a>
      <SplashScreen />
      <noscript><style>{".splash-screen{display:none}"}</style></noscript>
      <Navbar />
      {/* Skip-link target: after the navbar, so keyboard users bypass it. */}
      <div id="main-content" tabIndex={-1} className="w-full overflow-x-hidden relative focus:outline-none">
        <Hero />
        <About />
        <Portfolio />
        <Skills />
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
