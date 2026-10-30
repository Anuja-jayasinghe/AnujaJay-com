/** Pure logic for the 404 page's mini terminal, kept apart from the UI so it can be tested. */

export interface Section {
  name: string; // what you type after `cd`
  id: string; // anchor id on the home page
  keywords: string[]; // words in a mistyped URL that point here
}

export const SECTIONS: Section[] = [
  { name: "home", id: "home", keywords: ["home", "index", "main"] },
  { name: "about", id: "about", keywords: ["about", "bio", "me"] },
  { name: "projects", id: "portfolio", keywords: ["project", "work", "portfolio", "app", "case"] },
  { name: "terminal-one", id: "mini-projects", keywords: ["terminal", "mini", "lab", "experiment"] },
  { name: "skills", id: "resume", keywords: ["skill", "stack", "tech", "github"] },
  { name: "certifications", id: "certifications", keywords: ["cert", "course", "badge"] },
  { name: "contact", id: "contact", keywords: ["contact", "mail", "email", "hire", "reach", "message"] },
];

export interface CommandResult {
  lines: string[];
  /** Path (with optional #hash) to open in this tab. */
  navigateTo?: string;
  /** URL to open in a new tab. */
  openUrl?: string;
  clear?: boolean;
}

export const COMMANDS = ["help", "ls", "cd", "pwd", "whoami", "cat", "sudo", "cowsay", "clear"] as const;

const COW = [
  " _____",
  "< 404 >",
  " -----",
  "        \\   ^__^",
  "         \\  (oo)\\_______",
  "            (__)\\       )\\/\\",
  "                ||----w |",
  "                ||     ||",
];

/** Best guess at which section a mistyped path was aiming for. */
export function suggestSection(pathname: string): Section | null {
  const words = pathname.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  if (words.length === 0) return null;
  return (
    SECTIONS.find((section) => words.some((word) => section.keywords.some((k) => word.includes(k)))) ?? null
  );
}

function findSection(arg: string): Section | undefined {
  const target = arg.replace(/\/+$/, "").replace(/^\/+/, "").toLowerCase();
  if (target === "" || target === "~") return SECTIONS[0];
  return SECTIONS.find((s) => s.name === target || s.id === target);
}

export function runCommand(input: string, pathname: string): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };

  const [command, ...rest] = trimmed.split(/\s+/);
  const arg = rest.join(" ");

  switch (command.toLowerCase()) {
    case "help":
      return {
        lines: [
          "Available commands:",
          "  ls          list where you can go",
          "  cd <place>  go there (try: cd projects)",
          "  cat resume  open my resume",
          "  pwd         where am I?",
          "  whoami      who am I?",
          "  cowsay      a cow has something to say",
          "  clear       tidy up",
        ],
      };
    case "ls":
      return {
        lines: [SECTIONS.map((s) => `${s.name}/`).join("  "), "resume.pdf"],
      };
    case "cd": {
      const section = findSection(arg);
      if (!section) return { lines: [`bash: cd: ${arg}: No such file or directory (just like this page)`] };
      return {
        lines: [`Heading to ${section.name}...`],
        navigateTo: section.id === "home" ? "/" : `/#${section.id}`,
      };
    }
    case "pwd":
      return { lines: [pathname] };
    case "whoami":
      return { lines: ["visitor (a little lost, but very welcome)"] };
    case "cat":
      if (/^resume(\.pdf)?$/i.test(arg)) {
        return { lines: ["Opening resume.pdf in a new tab..."], openUrl: "/Anuja_CV.pdf" };
      }
      return { lines: [arg ? `cat: ${arg}: No such file or directory` : "cat: missing file (try: cat resume)"] };
    case "sudo":
      return { lines: ["Nice try. This incident will be reported to nobody."] };
    case "cowsay":
      return { lines: COW };
    case "clear":
      return { lines: [], clear: true };
    default:
      return { lines: [`bash: ${command}: command not found. Type 'help' to see what works.`] };
  }
}
