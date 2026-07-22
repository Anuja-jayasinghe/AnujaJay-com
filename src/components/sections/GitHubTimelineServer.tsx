import { Suspense } from "react";
import { fetchGitHubContributions, fetchGitHubStats } from "@/lib/github-contributions";
import { GitHubTimeline } from "./GitHubTimeline";
import { GitHubTimelineSkeleton } from "../ui/GitHubTimelineSkeleton";

interface GitHubTimelineServerProps {
  username?: string;
  years?: number[];
}

/**
 * Error display component
 */
function ErrorDisplay({ error }: { error: Error }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
      <p className="text-sm font-semibold">Failed to load contributions</p>
      <p className="text-xs">
        {error.message ||
          "An unknown error occurred while fetching your GitHub data."}
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
        No contributions found for the specified years. Please check your
        username and try again.
      </p>
    </div>
  );
}

/**
 * Async component that fetches contributions and renders timeline
 */
async function GitHubTimelineContent({
  username = "Anuja-jayasinghe",
  years = [2024, 2025, 2026],
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
    return <ErrorDisplay error={error} />;
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
  years = [2024, 2025, 2026],
}: GitHubTimelineServerProps) {
  return (
    <Suspense fallback={<GitHubTimelineSkeleton />}>
      <GitHubTimelineContent username={username} years={years} />
    </Suspense>
  );
}
