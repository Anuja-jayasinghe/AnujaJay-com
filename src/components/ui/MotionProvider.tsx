"use client";

import { MotionConfig } from "framer-motion";

// Makes every framer-motion animation honour the visitor's OS-level
// "reduce motion" setting (transform/layout animations are skipped).
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
