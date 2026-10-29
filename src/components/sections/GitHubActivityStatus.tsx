import { Activity, CalendarDays } from "lucide-react";
import { fetchGitHubContributions } from "@/lib/github-contributions";
import { describeDaysAgo, summarizeActivity } from "@/lib/github-activity";

/**
 * Real GitHub numbers for the contact panel. It reuses the contributions
 * request the Skills timeline already makes (same Next data-cache entry), so
 * it adds no extra API traffic. If GitHub is unreachable the panel is simply
 * omitted rather than showing a placeholder.
 */
export async function GitHubActivityStatus({ username }: { username: string }) {
  let summary;
  try {
    summary = summarizeActivity(await fetchGitHubContributions(username));
  } catch (error) {
    console.error("GitHub activity status failed to load:", error);
    return null;
  }

  return (
    <div className="bg-gray-100/50 rounded border border-gray-200 p-4 space-y-4 shadow-inner">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold text-gray-600">GITHUB_ACTIVITY</span>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] font-bold text-blue-700 hover:underline"
        >
          LIVE FROM GITHUB
        </a>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white p-2 rounded border border-gray-100 flex flex-col gap-1">
          <Activity size={12} className="text-gray-500" aria-hidden="true" />
          <span className="font-mono text-[11px] text-gray-600 uppercase">Last active</span>
          <span className="font-mono text-[11px] font-bold text-gray-900 uppercase">
            {summary.daysSinceActive === null ? "—" : describeDaysAgo(summary.daysSinceActive)}
          </span>
        </div>
        <div className="bg-white p-2 rounded border border-gray-100 flex flex-col gap-1">
          <CalendarDays size={12} className="text-gray-500" aria-hidden="true" />
          <span className="font-mono text-[11px] text-gray-600 uppercase">This year</span>
          <span className="font-mono text-[11px] font-bold text-gray-900 uppercase">
            {summary.yearTotal.toLocaleString("en-US")} contributions
          </span>
        </div>
      </div>
    </div>
  );
}
