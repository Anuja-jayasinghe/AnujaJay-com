"use client";

import { useRef, useEffect } from "react";
import { getContributionLevel } from "@/lib/github-contributions";

interface ContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
}

interface GitHubTimelineProps {
  contributions: ContributionDay[];
  totalStars?: number;
}

/**
 * Color palette based on contribution intensity
 * Level 0 (no contrib) -> Level 4 (many contribs)
 */
const CONTRIBUTION_COLORS = [
  "bg-gray-100", // 0 contributions
  "bg-blue-200", // 1-4 contributions
  "bg-blue-400", // 5-9 contributions
  "bg-blue-600", // 10-19 contributions
  "bg-accent", // 20+ contributions (#000075 - deep blue)
];

const ACCENT_COLORS = {
  0: "#f3f4f6",
  1: "#bfdbfe",
  2: "#60a5fa",
  3: "#2563eb",
  4: "#000075",
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface WeekWithMeta {
  days: ContributionDay[];
  monthLabel?: string;
  yearLabel?: string;
  isFirstWeekOfYear?: boolean;
}

/**
 * Organizes contributions into weeks (Sunday-Saturday)
 */
function organizeIntoWeeks(contributions: ContributionDay[]): WeekWithMeta[] {
  if (!contributions.length) return [];

  const weeks: WeekWithMeta[] = [];
  let currentWeek: ContributionDay[] = [];
  let lastWeekKey: string | null = null;
  let lastSeenMonth = -1;
  let lastSeenYear = -1;

  const flush = (monthLabel?: string, yearLabel?: string, isFirstWeekOfYear?: boolean) => {
    if (currentWeek.length > 0) {
      weeks.push({ days: currentWeek, monthLabel, yearLabel, isFirstWeekOfYear });
      currentWeek = [];
    }
  };

  contributions.forEach((day) => {
    const date = new Date(day.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const startOfYear = new Date(year, 0, 1);
    const weekNum = Math.ceil(
      ((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
    );
    const weekKey = `${year}-${weekNum}`;

    if (lastWeekKey === null) {
      lastWeekKey = weekKey;
      lastSeenMonth = month;
      lastSeenYear = year;
    }

    if (weekKey !== lastWeekKey) {
      const firstDay = currentWeek[0] ? new Date(currentWeek[0].date) : null;
      let monthLabel: string | undefined;
      let yearLabel: string | undefined;
      let isFirstWeekOfYear: boolean | undefined;

      if (firstDay) {
        const fm = firstDay.getMonth();
        const fy = firstDay.getFullYear();
        if (fy !== lastSeenYear) {
          yearLabel = String(fy);
          isFirstWeekOfYear = true;
          lastSeenYear = fy;
          lastSeenMonth = fm;
          monthLabel = MONTH_NAMES[fm];
        } else if (fm !== lastSeenMonth) {
          monthLabel = MONTH_NAMES[fm];
          lastSeenMonth = fm;
        }
      }

      flush(monthLabel, yearLabel, isFirstWeekOfYear);
      lastWeekKey = weekKey;
    }

    currentWeek.push(day);
  });

  if (currentWeek.length > 0) {
    const firstDay = new Date(currentWeek[0]!.date);
    const fm = firstDay.getMonth();
    const fy = firstDay.getFullYear();
    let monthLabel: string | undefined;
    let yearLabel: string | undefined;
    let isFirstWeekOfYear: boolean | undefined;
    if (fy !== lastSeenYear) {
      yearLabel = String(fy);
      isFirstWeekOfYear = true;
      monthLabel = MONTH_NAMES[fm];
    } else if (fm !== lastSeenMonth) {
      monthLabel = MONTH_NAMES[fm];
    }
    flush(monthLabel, yearLabel, isFirstWeekOfYear);
  }

  return weeks;
}

/**
 * Contribution square component with tooltip
 */
function ContributionSquare({ day }: { day?: ContributionDay }) {
  if (!day) {
    return <div className="h-[10px] w-[10px] rounded-[2px] bg-gray-50" />;
  }

  const level = getContributionLevel(day.contributionCount);
  const color = CONTRIBUTION_COLORS[level];
  const hoverColor =
    level === 0 ? "hover:bg-gray-200" : "hover:opacity-80 transition-opacity";

  const dateObj = new Date(day.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`group relative h-[10px] w-[10px] cursor-pointer rounded-[2px] ${color} ${hoverColor} hover:z-50`}
      title={`${day.contributionCount} contributions on ${formattedDate}`}
    >
      {/* Tooltip */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100 z-10 shadow-lg">
        {day.contributionCount} {day.contributionCount === 1 ? "contribution" : "contributions"}
        <br />
        <span className="text-gray-300">{formattedDate}</span>
      </div>
    </div>
  );
}

/**
 * Main GitHubTimeline component with draggable x-axis
 */
export function GitHubTimeline({
  contributions,
  totalStars: passedTotalStars,
}: GitHubTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Filter out future contributions
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const nonFutureContributions = contributions.filter(
    (d) => new Date(d.date) <= today
  );
  const weeks = organizeIntoWeeks(nonFutureContributions);

  // Calculate stats
  const totalContributions = contributions.reduce(
    (sum, day) => sum + day.contributionCount,
    0
  );
  const maxStreak = calculateMaxStreak(contributions);
  const totalStars = passedTotalStars ?? 0;

  // Scroll to the right (most recent) on mount
  useEffect(() => {
    if (containerRef.current && innerRef.current) {
      // Use setTimeout to ensure DOM is fully painted
      setTimeout(() => {
        if (containerRef.current && innerRef.current) {
          containerRef.current.scrollLeft = innerRef.current.scrollWidth;
        }
      }, 0);
    }
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-foreground">
          Development Activity
        </h3>
        <p className="text-sm text-gray-600">
          {new Date(contributions[0]?.date).getFullYear()} - today{" "}
          — Contribution heatmap showing my GitHub activity
        </p>
      </div>

      {/* Contribution grid */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white px-4 pb-4 pt-2 contribution-scrollbar"
      >
        <div
          ref={innerRef}
          className="inline-flex gap-[3px]"
        >
          {/* Day labels column */}
          <div className="flex flex-col pr-1 select-none">
            <div className="h-3.5" /> {/* Month label row spacer */}
            <div className="flex flex-col gap-[3px] text-[8px] text-gray-400">
              <span className="h-[10px] flex items-center"></span> {/* Sun */}
              <span className="h-[10px] flex items-center">Mon</span>
              <span className="h-[10px] flex items-center"></span> {/* Tue */}
              <span className="h-[10px] flex items-center">Wed</span>
              <span className="h-[10px] flex items-center"></span> {/* Thu */}
              <span className="h-[10px] flex items-center">Fri</span>
              <span className="h-[10px] flex items-center"></span> {/* Sat */}
            </div>
          </div>

          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col relative" style={{ gap: "3px" }}>
              {/* Month / Year label row */}
              <div className="h-3.5 flex items-end pb-0.5">
                {week.yearLabel ? (
                  <span className="text-[9px] font-bold text-blue-700 tracking-wide leading-none whitespace-nowrap">
                    {week.yearLabel}
                  </span>
                ) : week.monthLabel ? (
                  <span className="text-[9px] font-semibold text-gray-500 leading-none whitespace-nowrap">
                    {week.monthLabel}
                  </span>
                ) : null}
              </div>

              {/* Year divider line */}
              {week.isFirstWeekOfYear && weekIdx !== 0 && (
                <div
                  className="absolute"
                  style={{
                    width: 1,
                    height: 7 * 10 + 6 * 3 + 14,
                    backgroundColor: "#93c5fd",
                    opacity: 0.6,
                    marginTop: 14,
                  }}
                />
              )}

              {/* Day squares */}
              <div className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, dayIdx) => (
                  <ContributionSquare
                    key={`${weekIdx}-${dayIdx}`}
                    day={week.days[dayIdx]}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-3 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase text-gray-600 tracking-wide">
            Total Contributions
          </p>
          <p className="text-2xl font-bold text-accent">
            {totalContributions.toLocaleString()}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase text-gray-600 tracking-wide">
            Max Streak
          </p>
          <p className="text-2xl font-bold text-accent">{maxStreak}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase text-gray-600 tracking-wide">
            Total Stars
          </p>
          <p className="text-2xl font-bold text-accent">{totalStars}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <span className="font-semibold">Less</span>
        <div className="flex gap-1">
          {Object.values(ACCENT_COLORS).map((color, idx) => (
            <div
              key={idx}
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="font-semibold">More</span>
      </div>
    </div>
  );
}

/**
 * Calculate maximum consecutive contribution streak
 */
function calculateMaxStreak(contributions: ContributionDay[]): number {
  let maxStreak = 0;
  let currentStreak = 0;

  contributions.forEach((day) => {
    if (day.contributionCount > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  return maxStreak;
}
