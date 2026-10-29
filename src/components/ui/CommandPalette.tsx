"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const EMAIL = "anujajayasinhe@gmail.com";

interface Command {
  id: string;
  label: string;
  hint: string;
  keywords: string;
  run: () => void | Promise<void>;
}

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
}

function goToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) {
    // Not on the home page (e.g. the 404 page): go there.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `/#${id}`;
    return;
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

/**
 * Ctrl/Cmd+K (or "/") opens a quick-jump palette: sections, résumé, email,
 * profiles. It only duplicates what the menu already offers.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const commands = useMemo<Command[]>(() => {
    const section = (id: string, label: string, keywords: string): Command => ({
      id: `go-${id}`,
      label,
      hint: "Go to section",
      keywords,
      run: () => {
        setOpen(false);
        goToSection(id);
      },
    });
    const external = (id: string, label: string, url: string, keywords: string): Command => ({
      id,
      label,
      hint: "Opens in a new tab",
      keywords,
      run: () => {
        setOpen(false);
        window.open(url, "_blank", "noopener,noreferrer");
      },
    });
    return [
      section("home", "Home", "top start hero"),
      section("about", "About me", "real me bio who"),
      section("portfolio", "Selected work", "projects portfolio featured"),
      section("mini-projects", "Terminal One (mini projects)", "mini projects terminal experiments scripts"),
      section("resume", "Skills", "skills stack tech arsenal github activity"),
      section("certifications", "Certifications", "certificates courses rack"),
      section("contact", "Contact", "email message hire reach"),
      external("resume-pdf", "Open résumé (PDF)", "/Anuja_CV.pdf", "cv resume pdf download"),
      {
        id: "copy-email",
        label: "Copy email address",
        hint: EMAIL,
        keywords: "email mail copy address",
        run: async () => {
          try {
            await navigator.clipboard.writeText(EMAIL);
            setStatus("Email address copied");
          } catch {
            setStatus(`Copy failed. My email is ${EMAIL}`);
          }
        },
      },
      external("github", "GitHub profile", "https://github.com/Anuja-jayasinghe", "github code repos source"),
      external("linkedin", "LinkedIn profile", "https://linkedin.com/in/anuja-jayasinghe", "linkedin work career"),
      {
        id: "replay-intro",
        label: "Replay the intro animation",
        hint: "Reloads the page",
        keywords: "intro splash signature animation replay",
        run: () => {
          // Full reload on purpose: the splash reads ?intro=replay only on mount.
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/?intro=replay";
        },
      },
    ];
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.keywords}`.toLowerCase().includes(q));
  }, [commands, query]);

  // Open with Ctrl/Cmd+K or "/".
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const isSlash = event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingTarget(event.target);
      if (!isShortcut && !isSlash) return;
      // Don't stack on top of another dialog (menu, secret terminal).
      if (!open && document.querySelector('[role="dialog"]')) return;
      event.preventDefault();
      setQuery("");
      setActive(0);
      setStatus("");
      setOpen((wasOpen) => !wasOpen);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // While open: focus the input, lock scroll, restore focus on close.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [open]);

  // Keep the highlighted option in view.
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active, results]);

  if (!open) return null;

  const onInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      void results[active]?.run();
    } else if (event.key === "Tab") {
      // One focusable control: keep focus in the dialog.
      event.preventDefault();
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Quick jump"
      className="fixed inset-0 z-[270] flex items-start justify-center bg-black/60 px-4 pt-[12vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-lg border border-black/10 bg-white font-mono shadow-2xl">
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setStatus("");
          }}
          onKeyDown={onInputKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-controls="quick-jump-list"
          aria-activedescendant={results[active] ? `quick-jump-${results[active].id}` : undefined}
          aria-label="Search sections and actions"
          placeholder="Jump to… (type to filter)"
          autoComplete="off"
          spellCheck={false}
          className="w-full border-b border-black/10 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-600 focus:outline-none"
        />
        <ul id="quick-jump-list" ref={listRef} role="listbox" aria-label="Results" className="max-h-72 overflow-y-auto py-1">
          {results.map((command, i) => (
            <li
              key={command.id}
              id={`quick-jump-${command.id}`}
              role="option"
              aria-selected={i === active}
              onMouseMove={() => setActive(i)}
              onClick={() => void command.run()}
              className={`flex cursor-pointer items-center justify-between gap-4 px-4 py-2.5 text-sm ${
                i === active ? "bg-black text-white" : "text-black"
              }`}
            >
              <span className="font-bold">{command.label}</span>
              <span className={`truncate text-[11px] ${i === active ? "text-gray-300" : "text-gray-600"}`}>{command.hint}</span>
            </li>
          ))}
          {results.length === 0 && <li className="px-4 py-3 text-sm text-gray-600">Nothing matches “{query}”.</li>}
        </ul>
        <div className="flex items-center justify-between border-t border-black/10 bg-gray-50 px-4 py-2 text-[11px] text-gray-600">
          <span>↑↓ to move · Enter to select · Esc to close</span>
          <span role="status" aria-live="polite" className="font-bold text-blue-700">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
