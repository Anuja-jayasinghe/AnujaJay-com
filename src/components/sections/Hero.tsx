export default function Hero() {
    return (
        <section id="home" className="min-h-[75svh] sm:min-h-[85svh] lg:min-h-[90svh] flex items-center py-24 sm:py-32">
            <div className="site-shell">
                <div className="max-w-[1200px]">
                    <h2 className="text-[clamp(1rem,1.5vw,1.5rem)] font-mono text-accent mb-4 sm:mb-6">Hello, it&apos;s me</h2>
                    <h1 className="hero-title font-bold font-sans mb-6 sm:mb-8 text-black">
                        Anuja Jayasinghe.
                    </h1>
                    <p className="text-[clamp(1.125rem,1.9vw,1.75rem)] text-gray-600 mb-8 sm:mb-12 max-w-3xl leading-relaxed">
                        I build clean, purposeful solutions that solve real-world problems. Continuous learner.
                    </p>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                        <a href="#portfolio" className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded hover:bg-accent hover:text-white transition-colors font-bold font-mono">
                            View Work
                        </a>
                        <a href="/Anuja_CV.pdf" target="_blank" rel="noopener noreferrer" className="border border-black text-black px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded hover:border-accent hover:text-accent transition-colors font-bold font-mono">
                            Resume
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
