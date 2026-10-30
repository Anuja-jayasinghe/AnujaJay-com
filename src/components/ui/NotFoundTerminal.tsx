"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { runCommand, suggestSection } from "@/lib/not-found-commands";

interface Entry {
  id: number;
  kind: "input" | "output";
  text: string;
}

// One-tap versions of the commands, for phones and anyone who'd rather not type.
const CHIPS = ["help", "ls", "cd projects", "cat resume", "cowsay"];

const subscribeNothing = () => () => {};
// Client-only value read the hydration-safe way: "" on the server and during
// hydration, the real path afterwards.
const readPath = () => window.location.pathname;
const readNoPath = () => "";

/** A small playable terminal for the 404 page. Everything here is also reachable with the normal buttons. */
export default function NotFoundTerminal() {
  const router = useRouter();
  const path = useSyncExternalStore(subscribeNothing, readPath, readNoPath);
  const shownPath = (path || "/this-page").slice(0, 48);
  const suggestion = path ? suggestSection(path) : null;

  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState("");
  const nextId = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [entries]);

  const run = (text: string) => {
    const result = runCommand(text, shownPath);
    if (!text.trim()) return;
    setEntries((previous) => {
      if (result.clear) return [];
      return [
        ...previous,
        { id: nextId.current++, kind: "input", text },
        ...result.lines.map((line): Entry => ({ id: nextId.current++, kind: "output", text: line })),
      ];
    });
    if (result.navigateTo) router.push(result.navigateTo);
    if (result.openUrl) window.open(result.openUrl, "_blank", "noopener,noreferrer");
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    run(draft);
    setDraft("");
  };

  return (
    <div className="rounded border border-white/10 bg-black/40 p-4 text-sm leading-relaxed">
      <div className="space-y-1 text-green-400" aria-hidden="true">
        <p className="text-blue-300">$ cd {shownPath}</p>
        <p>bash: cd: {shownPath}: No such file or directory</p>
        {suggestion && (
          <p className="text-gray-300">
            Did you mean{" "}
            <Link
              href={suggestion.id === "home" ? "/" : `/#${suggestion.id}`}
              className="text-blue-300 underline underline-offset-2 hover:text-white"
            >
              {suggestion.name}
            </Link>
            ?
          </p>
        )}
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        className="mt-3 max-h-56 space-y-0.5 overflow-y-auto text-green-400"
      >
        {entries.map((entry) => (
          <p
            key={entry.id}
            className={`whitespace-pre-wrap break-words ${entry.kind === "input" ? "text-blue-300" : ""}`}
          >
            {entry.kind === "input" ? `$ ${entry.text}` : entry.text}
          </p>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-3 flex items-center gap-2">
        <label htmlFor="not-found-command" className="shrink-0 text-blue-300">
          <span aria-hidden="true">$</span>
          <span className="sr-only">Type a command</span>
        </label>
        <input
          id="not-found-command"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="type help, or tap a command below"
          className="min-w-0 flex-1 bg-transparent text-green-300 placeholder:text-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded border border-white/30 px-3 py-1 text-xs font-bold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Run
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => run(chip)}
            className="rounded border border-green-400/40 px-2.5 py-1 text-xs text-green-300 hover:bg-green-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
