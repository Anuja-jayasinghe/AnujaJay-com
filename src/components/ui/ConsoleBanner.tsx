"use client";

import { useEffect } from "react";
import { NAME_ART } from "@/lib/ascii-art";

// Module-level so React strict-mode's double effect run prints it once.
let printed = false;

/**
 * A hidden bio for anyone who opens DevTools: the name in big ASCII lettering,
 * a congratulations, and a two-line intro. Renders nothing.
 */
export default function ConsoleBanner() {
  useEffect(() => {
    if (printed) return;
    printed = true;

    // A mid-blue that stays readable in both light and dark DevTools themes.
    const blue = "#4c6fff";

    console.log(`%c${NAME_ART.join("\n")}`, `color:${blue};font:700 12px/1.15 monospace`);
    console.log("%c🎉 Congratulations, you found the hidden bio!", `color:${blue};font:700 14px monospace`);
    console.log(
      "%cI'm Anuja, a Computer Science undergrad who builds clean, purposeful software across web, IoT and a homelab.\nBuilding something interesting? Say hi → anujajayasinhe@gmail.com",
      "font:13px/1.5 monospace",
    );
    console.log("%cSource: https://github.com/Anuja-jayasinghe/AnujaJay-com", "font:12px monospace;color:#888");
  }, []);

  return null;
}
