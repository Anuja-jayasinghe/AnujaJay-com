import dynamic from "next/dynamic";
import projectsData from "../../data/projects.json";
import PortfolioFeaturedCard from "./PortfolioFeaturedCard";

const TerminalOne = dynamic(() => import("../ui/TerminalOne"), {
    loading: () => (
        <div className="w-full max-w-[1400px] mx-auto h-[500px] rounded-lg bg-gray-100 border border-black/10 animate-pulse" />
    ),
});



// ─── Main Portfolio ──────────────────────────────────────────────────────────
export default function Portfolio() {
    const featuredProjects = projectsData.filter((p) => p.type === "featured");

    return (
        <section id="portfolio" className="py-16 sm:py-24 overflow-hidden">
            <div className="site-shell">
                <h2 className="section-title font-bold font-mono mb-12 sm:mb-20 flex items-center gap-3 sm:gap-4 text-black">
                    <span className="text-accent">02.</span> Selected Work
                </h2>

                {/* Featured Projects - Alternating Layout */}
                <div className="flex flex-col gap-16 sm:gap-24 md:gap-32 mb-16 sm:mb-28">
                    {featuredProjects.map((project, i) => (
                        <PortfolioFeaturedCard key={project.id} project={project} index={i} />
                    ))}
                </div>

                {/* Mini Projects Header */}
                <div className="mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold font-mono text-black mb-2 flex items-center gap-3">
                        <TerminalOneIcon />
                        Terminal One
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm font-mono max-w-xl">
                        A collection of smaller experiments, scripts, and utilities. Hover over a file in the explorer to execute its manifest.
                    </p>
                </div>
            </div>

            {/* Terminal One Container - full width on mobile, constrained on desktop */}
            <div id="mini-projects" className="site-shell pb-8">
                <TerminalOne />
            </div>
        </section>
    );
}

function TerminalOneIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-terminal">
            <polyline points="4 17 10 11 4 5"/>
            <line x1="12" x2="20" y1="19" y2="19"/>
        </svg>
    );
}
