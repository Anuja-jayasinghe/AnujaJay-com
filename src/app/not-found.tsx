import Link from "next/link";
import NotFoundTerminal from "@/components/ui/NotFoundTerminal";
import { FOUR_OH_FOUR_ART } from "@/lib/ascii-art";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-black/10 shadow-2xl font-mono">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-black/10 bg-gray-200 px-4 py-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
          <span className="ml-3 text-[11px] font-bold uppercase tracking-widest text-gray-600">visitor@anujajay:~</span>
        </div>

        <div className="bg-gray-900 p-6 sm:p-10">
          <pre
            className="overflow-x-auto text-[11px] leading-tight text-green-400 sm:text-sm"
            aria-hidden="true"
          >
            {FOUR_OH_FOUR_ART.join("\n")}
          </pre>

          <h1 className="mt-6 font-sans text-3xl sm:text-4xl font-bold tracking-tight text-white">
            This page doesn&apos;t exist.
          </h1>
          <p className="mt-3 font-sans text-base sm:text-lg text-gray-300">
            The link may be old, or the address may have a typo. Let&apos;s get you back on track.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded bg-white px-6 py-3 font-bold text-black transition-colors hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Back to Home
            </Link>
            <Link
              href="/#contact"
              className="rounded border border-white/60 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Contact Me
            </Link>
          </div>

          <p className="mt-10 mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Or poke around
          </p>
          <NotFoundTerminal />
        </div>
      </div>
    </main>
  );
}
