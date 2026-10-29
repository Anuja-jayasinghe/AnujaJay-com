import { Suspense } from "react";
import {
  fetchGitHubContributions,
  fetchGitHubStats,
  getDefaultYears,
} from "@/lib/github-contributions";
import { GitHubTimeline } from "./GitHubTimeline";
import { GitHubTimelineSkeleton } from "../ui/GitHubTimelineSkeleton";

interface GitHubTimelineServerProps {
  username?: string;
  years?: number[];
}

/**
 * Error display component. The real error is logged on the server; visitors
 * only see a generic message so configuration details never reach the page.
 */
function ErrorDisplay() {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
      <p className="text-sm font-semibold">GitHub activity is unavailable right now</p>
      <p className="text-xs">
        Please check back later, or see my profile on GitHub directly.
      </p>
    </div>
  );
}

/**
 * Empty state component
 */
function EmptyState() {
  return (
    <div className="rounded-lg border border-gray-200 bg-yellow-50 p-4 text-yellow-800">
      <p className="text-sm">
        No GitHub activity to show yet. Please check back later.
      </p>
    </div>
  );
}

/**
 * Async component that fetches contributions and renders timeline
 */
async function GitHubTimelineContent({
  username = "Anuja-jayasinghe",
  years = getDefaultYears(),
}: GitHubTimelineServerProps) {
  let contributions;
  let stats;
  let error: Error | null = null;

  try {
    [contributions, stats] = await Promise.all([
      fetchGitHubContributions(username, years),
      fetchGitHubStats(username),
    ]);
  } catch (err) {
    error = err instanceof Error ? err : new Error(String(err));
  }

  if (error) {
    console.error("GitHub timeline failed to load:", error);
    return <ErrorDisplay />;
  }

  if (!contributions || !contributions.length) {
    return <EmptyState />;
  }

  return (
    <GitHubTimeline
      contributions={contributions}
      totalStars={stats?.totalStars}
    />
  );
}

/**
 * Server Component wrapper with Suspense boundary
 */
export function GitHubTimelineServer({
  username = "Anuja-jayasinghe",
  years,
}: GitHubTimelineServerProps) {
  return (
    <Suspense fallback={<GitHubTimelineSkeleton />}>
      <GitHubTimelineContent username={username} years={years} />
    </Suspense>
  );
}
