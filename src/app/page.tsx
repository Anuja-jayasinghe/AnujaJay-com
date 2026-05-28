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
      <SplashScreen />
      <Navbar />
      <div className="w-full overflow-x-hidden relative">
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
