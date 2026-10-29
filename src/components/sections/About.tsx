"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, Code } from "lucide-react";

const perspectives = [
    {
        id: "general",
        label: "General",
        icon: User,
        text: "I'm a Computer Science undergrad hooked on technology since childhood. I love architecting clean, purposeful solutions that solve real-world problems. I prioritize clean code, proper formatting, and modern execution in everything I build.",
    },
    {
        id: "recruiters",
        label: "Recruiters",
        icon: Briefcase,
        text: "I'm a highly adaptable developer who thrives on the 'learn by doing' approach. Adept at full-stack development, with a strong interest in exploring new fields like ML and IoT. I consistently deliver disciplined, reliable, and scalable work that gets straight to the point.",
    },
    {
        id: "developers",
        label: "Developers",
        icon: Code,
        text: "I'm an engineer who values readable code, solid formatting, and robust architectures. I'm always open to collaborating on interesting projects, tackling hackathons, or geeking out over new tools and automation. Hit me up if you want to build something cool!",
    },
];

export default function About() {
    const [active, setActive] = useState(0);

    return (
        <section id="about" className="py-16 sm:py-24 bg-gray-50 border-y border-black/5">
            <div className="site-shell">
                <h2 className="section-title font-bold font-mono mb-10 sm:mb-16 flex items-center gap-3 sm:gap-4 text-black">
                    <span className="text-accent">01.</span> The Real Me
                </h2>
            </div>

            {/* Full-width tab bar with underline */}
            <div className="w-full border-b border-black/10 overflow-x-auto">
                <div className="site-shell">
                    <div className="flex gap-6 sm:gap-8 md:gap-12 relative min-w-max sm:min-w-0">
                        {perspectives.map((p, i) => {
                            const Icon = p.icon;
                            const isActive = active === i;
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => setActive(i)}
                                    className={`relative flex items-center gap-2 sm:gap-2.5 pb-4 text-xs sm:text-sm font-bold font-mono transition-colors duration-300 whitespace-nowrap ${isActive ? "text-black" : "text-black/30 hover:text-black/60"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {p.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeUnderline"
                                            className="absolute bottom-0 left-0 right-0 h-[3px] bg-black"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="site-shell pt-8 sm:pt-12">
                <div className="w-full min-h-[80px] sm:min-h-[100px]">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={perspectives[active].id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="text-gray-600 leading-relaxed text-base sm:text-lg md:text-2xl max-w-[1100px]"
                        >
                            {perspectives[active].text}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
