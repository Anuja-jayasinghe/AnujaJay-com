import Image from "next/image";
import ServerRack from "../ui/ServerRack";
import { GitHubTimelineServer } from "./GitHubTimelineServer";
const row1 = [
    "react/react-original", "nextjs/nextjs-original", "tailwindcss/tailwindcss-original",
    "html5/html5-original", "css3/css3-original", "javascript/javascript-original",
    "typescript/typescript-original", "nodejs/nodejs-original", "python/python-original"
];

const row2 = [
    "java/java-original", "mysql/mysql-original", "firebase/firebase-plain",
    "supabase/supabase-original", "docker/docker-original", "bash/bash-original",
    "git/git-original", "github/github-original", "arduino/arduino-original"
];

function MarqueeRow({ icons, reverse = false }: { icons: string[], reverse?: boolean }) {
    const content = (
        <div className={`flex gap-16 items-center justify-around min-w-full shrink-0 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
            {icons.map((icon, idx) => {
                const techName = icon.split('/')[0];
                const label = techName.charAt(0).toUpperCase() + techName.slice(1);
                return (
                <Image
                    key={idx}
                    src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${icon}.svg`}
                    alt={`${label} logo`}
                    width={80}
                    height={80}
                    className="w-16 h-16 md:w-20 md:h-20 object-contain filter grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
                );
            })}
        </div>
    );

    return (
        <div className="flex overflow-hidden w-full gap-16">
            {content}
            {content}
            {content}
        </div>
    );
}

export default function Skills() {
    return (
        <section id="resume" className="py-16 sm:py-24 border-y border-black/5 bg-white overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 mb-12 sm:mb-20 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono mb-3 sm:mb-4 flex items-center gap-3 sm:gap-4 text-black">
                            <span className="text-accent">03.</span> Core Arsenal
                        </h2>
                        <p className="text-gray-600 max-w-2xl font-sans text-base sm:text-lg">
                            A comprehensive stack spanning modern frontend frameworks to robust backend architectures and hardware integrations.
                        </p>
                    </div>

                    <a href="/Anuja_CV.pdf" target="_blank" rel="noopener noreferrer" className="bg-black text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded hover:bg-accent transition-colors font-bold font-mono whitespace-nowrap text-sm sm:text-base">
                        View Full Resume
                    </a>
                </div>
            </div>

            <div className="w-full flex flex-col gap-8 sm:gap-12 pointer-events-none md:pointer-events-auto">
                <MarqueeRow icons={row1} />
                <MarqueeRow icons={row2} reverse />
            </div>

            {/* GitHub Contribution Timeline */}
            <div className="mt-16 sm:mt-24 w-full px-4 sm:px-6">
                <div className="container mx-auto">
                    <GitHubTimelineServer username="Anuja-jayasinghe" years={[2024, 2025, 2026]} />
                </div>
            </div>

            {/* Certifications Server Rack */}
            <div id="certifications" className="mt-16 sm:mt-24 w-full flex justify-center">
                <ServerRack />
            </div>
        </section>
    );
}
