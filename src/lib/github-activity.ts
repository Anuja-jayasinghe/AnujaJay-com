export interface ActivityDay {
  date: string; // YYYY-MM-DD
  contributionCount: number;
}

export interface ActivitySummary {
  lastActiveDate: string | null;
  daysSinceActive: number | null;
  yearTotal: number;
}

const DAY_MS = 86_400_000;

function utcDay(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Last day with any contribution, and the current year's total, from GitHub calendar days. */
export function summarizeActivity(days: ActivityDay[], now: Date = new Date()): ActivitySummary {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const yearPrefix = `${now.getUTCFullYear()}-`;

  let lastActiveDate: string | null = null;
  let yearTotal = 0;

  for (const day of days) {
    if (utcDay(day.date) > today) continue;
    if (day.date.startsWith(yearPrefix)) yearTotal += day.contributionCount;
    if (day.contributionCount > 0 && (lastActiveDate === null || day.date > lastActiveDate)) {
      lastActiveDate = day.date;
    }
  }

  return {
    lastActiveDate,
    daysSinceActive: lastActiveDate === null ? null : Math.round((today - utcDay(lastActiveDate)) / DAY_MS),
    yearTotal,
  };
}

/** "Today", "Yesterday", "5 days ago", "3 months ago". */
export function describeDaysAgo(days: number): string {
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 60) return `${days} days ago`;
  return `${Math.floor(days / 30)} months ago`;
}
