"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center px-6">
      <div className="w-full max-w-2xl border border-black/10 rounded-2xl p-8 sm:p-12 shadow-sm">
        <p className="font-mono text-xs tracking-[0.2em] text-accent mb-4">ERROR::500</p>
        <h1 className="font-sans text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Something went wrong.
        </h1>
        <p className="text-gray-600 text-base sm:text-lg mb-8">
          An unexpected error occurred. You can try again or return home.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="bg-black text-white px-6 py-3 rounded font-mono font-bold hover:bg-accent transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-black px-6 py-3 rounded font-mono font-bold hover:border-accent hover:text-accent transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 font-mono text-[10px] text-gray-400 uppercase tracking-widest">
            Digest: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
