import Link from "next/link";
import NotFoundTerminal from "@/components/ui/NotFoundTerminal";
import { FOUR_OH_FOUR_ART } from "@/lib/ascii-art";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center px-4 py-10 sm:px-8 sm:py-16">
      <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-black/10 shadow-2xl font-mono">
        {/* Window chrome */}
        <div className="flex items-center gap-2.5 border-b border-black/10 bg-gray-200 px-5 py-3" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-gray-400" />
          <span className="h-3 w-3 rounded-full bg-gray-400" />
          <span className="h-3 w-3 rounded-full bg-gray-400" />
          <span className="ml-3 text-xs font-bold uppercase tracking-widest text-gray-600">visitor@anujajay:~</span>
        </div>

        <div className="bg-gray-900 p-6 sm:p-12 lg:p-16">
          <pre
            className="overflow-x-auto text-lg leading-tight text-green-400 sm:text-3xl lg:text-4xl"
            aria-hidden="true"
          >
            {FOUR_OH_FOUR_ART.join("\n")}
          </pre>

          <h1 className="mt-8 font-sans text-4xl sm:text-6xl font-bold tracking-tight text-white">
            This page doesn&apos;t exist.
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-lg sm:text-2xl text-gray-300">
            The link may be old, or the address may have a typo. Let&apos;s get you back on track.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/"
              className="rounded bg-white px-8 py-4 text-lg font-bold text-black transition-colors hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Back to Home
            </Link>
            <Link
              href="/#contact"
              className="rounded border border-white/60 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Contact Me
            </Link>
          </div>

          <p className="mt-14 mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">
            Or poke around
          </p>
          <NotFoundTerminal />
        </div>
      </div>
    </main>
  );
}
