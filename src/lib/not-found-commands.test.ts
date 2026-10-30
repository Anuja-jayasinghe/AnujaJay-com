import { describe, expect, it } from "vitest";
import { runCommand, suggestSection } from "./not-found-commands";

describe("suggestSection", () => {
  it("guesses the section a mistyped path was aiming for", () => {
    expect(suggestSection("/my-projects")?.id).toBe("portfolio");
    expect(suggestSection("/Contact-Us")?.id).toBe("contact");
    expect(suggestSection("/skillset")?.id).toBe("resume");
  });

  it("returns null when nothing matches", () => {
    expect(suggestSection("/zzz")).toBeNull();
    expect(suggestSection("/")).toBeNull();
  });
});

describe("runCommand", () => {
  it("ignores empty input", () => {
    expect(runCommand("   ", "/x").lines).toEqual([]);
  });

  it("navigates with cd, to the right anchor", () => {
    expect(runCommand("cd projects", "/x").navigateTo).toBe("/#portfolio");
    expect(runCommand("cd contact/", "/x").navigateTo).toBe("/#contact");
    expect(runCommand("cd ~", "/x").navigateTo).toBe("/");
    expect(runCommand("cd", "/x").navigateTo).toBe("/");
  });

  it("reports unknown directories and commands without navigating", () => {
    const missing = runCommand("cd nowhere", "/x");
    expect(missing.navigateTo).toBeUndefined();
    expect(missing.lines[0]).toContain("No such file or directory");
    expect(runCommand("rm -rf /", "/x").lines[0]).toContain("command not found");
  });

  it("opens the resume in a new tab", () => {
    expect(runCommand("cat resume", "/x").openUrl).toBe("/Anuja_CV.pdf");
    expect(runCommand("cat nothing", "/x").openUrl).toBeUndefined();
  });

  it("supports pwd, clear and the easter-egg commands", () => {
    expect(runCommand("pwd", "/lost/page").lines).toEqual(["/lost/page"]);
    expect(runCommand("clear", "/x").clear).toBe(true);
    expect(runCommand("sudo anything", "/x").lines[0]).toContain("Nice try");
    expect(runCommand("cowsay", "/x").lines.join("\n")).toContain("404");
  });
});
