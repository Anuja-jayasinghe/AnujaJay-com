import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { GitHubTimeline } from "./GitHubTimeline";

// A run of days crossing a year boundary, with some activity.
function makeDays(start: string, count: number) {
  const first = Date.parse(`${start}T00:00:00Z`);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(first + i * 86_400_000);
    return {
      date: d.toISOString().slice(0, 10),
      contributionCount: (i * 7) % 13,
      weekday: d.getUTCDay(),
    };
  });
}

const days = makeDays("2025-12-14", 60);
const originalTz = process.env.TZ;

function render(today: string) {
  return renderToStaticMarkup(createElement(GitHubTimeline, { contributions: days, today, totalStars: 3 }));
}

afterEach(() => {
  if (originalTz === undefined) delete process.env.TZ;
  else process.env.TZ = originalTz;
});

describe("GitHubTimeline", () => {
  it("renders identical markup in any timezone (hydration safety)", () => {
    const outputs = ["UTC", "Asia/Colombo", "America/Los_Angeles", "Pacific/Kiritimati"].map((tz) => {
      process.env.TZ = tz;
      return render("2026-01-20");
    });
    for (const output of outputs) expect(output).toBe(outputs[0]);
  });

  it("only shows days up to the supplied 'today'", () => {
    const early = render("2025-12-31");
    const late = render("2026-01-20");
    expect(early).not.toContain("Jan 5, 2026");
    expect(late).toContain("Jan 5, 2026");
  });
});
