import { describe, it, expect } from "vitest";
import { describeDaysAgo, summarizeActivity } from "./github-activity";

const now = new Date("2026-10-29T10:00:00Z");

describe("summarizeActivity", () => {
  it("finds the last active day and sums the current year", () => {
    const result = summarizeActivity(
      [
        { date: "2025-12-31", contributionCount: 9 },
        { date: "2026-10-25", contributionCount: 3 },
        { date: "2026-10-27", contributionCount: 2 },
        { date: "2026-10-28", contributionCount: 0 },
        { date: "2026-10-29", contributionCount: 0 },
      ],
      now,
    );
    expect(result).toEqual({ lastActiveDate: "2026-10-27", daysSinceActive: 2, yearTotal: 5 });
  });

  it("ignores days after today", () => {
    const result = summarizeActivity([{ date: "2026-11-02", contributionCount: 7 }], now);
    expect(result.lastActiveDate).toBeNull();
    expect(result.yearTotal).toBe(0);
  });

  it("returns nulls when there is no activity", () => {
    expect(summarizeActivity([], now)).toEqual({ lastActiveDate: null, daysSinceActive: null, yearTotal: 0 });
  });
});

describe("describeDaysAgo", () => {
  it("formats relative days", () => {
    expect(describeDaysAgo(0)).toBe("Today");
    expect(describeDaysAgo(1)).toBe("Yesterday");
    expect(describeDaysAgo(12)).toBe("12 days ago");
    expect(describeDaysAgo(95)).toBe("3 months ago");
  });
});
