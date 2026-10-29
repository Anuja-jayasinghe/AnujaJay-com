"use client";

import { useEffect } from "react";

// Module-level so React strict-mode's double effect run prints it once.
let printed = false;

/** A hello for anyone who opens DevTools. Renders nothing. */
export default function ConsoleBanner() {
  useEffect(() => {
    if (printed) return;
    printed = true;

    console.log(
      "%c  A N U J A  J A Y  ",
      "background:#000075;color:#fff;font:700 14px monospace;padding:6px 10px;border-radius:4px",
    );
    console.log(
      "%cLooking under the hood? Good habit.\n%cThis site is Next.js + TypeScript + Tailwind. Say hi: anujajayasinhe@gmail.com\nSource: https://github.com/Anuja-jayasinghe/AnujaJay-com",
      "font:600 13px monospace;color:#000075",
      "font:12px monospace;color:#555",
    );
  }, []);

  return null;
}
