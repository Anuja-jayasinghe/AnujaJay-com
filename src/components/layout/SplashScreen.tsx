"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedLogo from "./AnimatedLogo";

type IntroMode = "full" | "mobile" | "short" | "reduced";

const SESSION_KEY = "anuja-signature-intro-v2-seen";
const HOLD_MS = { full: 3100, mobile: 1300, short: 320, reduced: 300 };

export default function SplashScreen() {
  const [mode, setMode] = useState<IntroMode>("full");
  const [visible, setVisible] = useState(true);
  const initialSeen = useRef<boolean | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 639px)").matches;
    const replay = new URLSearchParams(window.location.search).get("intro") === "replay";
    if (initialSeen.current === null) {
      try {
        initialSeen.current = sessionStorage.getItem(SESSION_KEY) === "1";
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // The intro still works when storage is unavailable.
        initialSeen.current = false;
      }
    }

    let nextMode: IntroMode = mobile ? "mobile" : "full";
    if (initialSeen.current && !replay) nextMode = "short";
    if (reduced) nextMode = "reduced";
    let active = true;
    queueMicrotask(() => {
      if (active) setMode(nextMode);
    });

    const timer = window.setTimeout(() => setVisible(false), HOLD_MS[nextMode]);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setVisible(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      active = false;
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`splash-screen splash-${mode} fixed inset-0 z-[150] flex items-center justify-center bg-[#00001A]`}
          exit={mode === "full" ? { y: "-100%" } : { opacity: 0 }}
          transition={{
            duration: mode === "full" ? 0.75 : 0.2,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <AnimatedLogo className="animated-signature block h-auto w-[84vw] max-w-[860px] sm:w-[clamp(400px,48vw,860px)]" />

          <div className={`${mode === "full" ? "" : "hidden"} absolute bottom-20 h-0.5 w-48 overflow-hidden rounded-full bg-white/20`} aria-hidden="true">
            <div className="splash-progress-bar h-full w-full origin-left bg-white/80" />
          </div>

          <button
            type="button"
            onClick={() => setVisible(false)}
            className="absolute bottom-8 left-1/2 flex min-h-11 -translate-x-1/2 items-center px-4 font-mono text-[10px] uppercase tracking-widest text-white/55 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Tap to skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
