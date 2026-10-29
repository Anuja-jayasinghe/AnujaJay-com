"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const LINES = [
  "$ sudo ./unlock-secret.sh",
  "[sudo] password for visitor: ********",
  "Authenticating... OK",
  "Access granted.",
  "",
  "$ cat welcome.txt",
  "You found the secret terminal. Nice.",
  "Thanks for poking around: I like building things that reward curiosity.",
  "If you're working on something interesting, say hi: anujajayasinhe@gmail.com",
  "",
  "$ _",
];

const LINE_DELAY_MS = 380;

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
}

/**
 * Hidden: entering the Konami code (↑ ↑ ↓ ↓ ← → ← → B A) opens a fake
 * terminal. Nothing in the UI points at it.
 */
export default function KonamiTerminal() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(0);
  const progress = useRef(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Watch for the sequence.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === SEQUENCE[progress.current]) {
        progress.current += 1;
        if (progress.current === SEQUENCE.length) {
          progress.current = 0;
          setShown(0);
          setOpen(true);
        }
      } else {
        progress.current = key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // While open: type the lines out, handle Escape/Tab, and restore focus on close.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer: number | undefined;
    if (reduced) {
      timer = window.setTimeout(() => setShown(LINES.length), 0);
    } else {
      timer = window.setInterval(() => {
        setShown((count) => {
          if (count >= LINES.length) {
            window.clearInterval(timer);
            return count;
          }
          return count + 1;
        });
      }, LINE_DELAY_MS);
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("a[href], button"));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Secret terminal"
      className="fixed inset-0 z-[260] flex items-center justify-center bg-black/85 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-white/15 bg-gray-950 font-mono shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 bg-gray-900 px-4 py-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">secret@anujajay:~</span>
          <button
            type="button"
            onClick={close}
            className="rounded px-2 py-1 text-[11px] font-bold uppercase tracking-widest text-gray-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Close (Esc)
          </button>
        </div>
        <div className="min-h-[18rem] space-y-1 p-5 text-sm leading-relaxed text-green-400">
          {/* Screen readers get the whole message at once rather than line by line. */}
          <p className="sr-only">{LINES.filter((line) => line && !line.startsWith("$") && !line.startsWith("[")).join(" ")}</p>
          <div aria-hidden="true">
            {LINES.slice(0, shown).map((line, i) => (
              <p
                key={i}
                className={`whitespace-pre-wrap break-words ${line.startsWith("$") ? "text-blue-300" : ""}`}
              >
                {line || " "}
              </p>
            ))}
          </div>
          {shown >= LINES.length && (
            <a
              href="mailto:anujajayasinhe@gmail.com"
              className="mt-4 inline-block rounded border border-green-400/50 px-3 py-1.5 text-xs font-bold text-green-300 hover:bg-green-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Say hi →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
