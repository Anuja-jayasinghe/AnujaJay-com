/**
 * GitHub Contributions Fetcher
 * Fetches contribution history for multiple years using GitHub GraphQL API
 */

interface ContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
}

interface GitHubContributionResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{
            date: string;
            contributionCount: number;
            weekday: number;
          }>;
        }>;
      };
    };
  };
}

const GITHUB_API_URL = "https://api.github.com/graphql";

/**
 * Gets GitHub token from environment, throws if not found
 */
function getGitHubToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "GITHUB_TOKEN environment variable is not set. Please add it to .env.local"
    );
  }
  return token;
}

/**
 * Constructs GraphQL query for fetching contributions for a specific year
 */
function buildContributionQuery(year: number, username: string): string {
  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  return `
    query {
      user(login: "${username}") {
        contributionsCollection(from: "${from}", to: "${to}") {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                weekday
              }
            }
          }
        }
      }
    }
  `;
}

/**
 * Fetches contributions for a specific year
 */
async function fetchYearContributions(
  year: number,
  username: string
): Promise<ContributionDay[]> {
  const query = buildContributionQuery(year, username);
  const token = getGitHubToken();

  const response = await fetch(GITHUB_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as {
    data?: GitHubContributionResponse;
    errors?: Array<{ message: string }>;
  };

  if (data.errors) {
    throw new Error(`GraphQL error: ${data.errors[0]?.message}`);
  }

  if (!data.data?.user?.contributionsCollection?.contributionCalendar?.weeks) {
    throw new Error("Unexpected GitHub API response structure");
  }

  // Flatten weeks into individual days
  const days: ContributionDay[] = [];
  data.data.user.contributionsCollection.contributionCalendar.weeks.forEach(
    (week) => {
      week.contributionDays.forEach((day) => {
        days.push({
          date: day.date,
          contributionCount: day.contributionCount,
          weekday: day.weekday,
        });
      });
    }
  );

  return days;
}

/**
 * Fetches contributions for multiple years and merges them
 * @param username GitHub username
 * @param years Array of years to fetch (e.g., [2024, 2025, 2026])
 */
export async function fetchGitHubContributions(
  username: string,
  years: number[] = [2024, 2025, 2026]
): Promise<ContributionDay[]> {
  try {
    const allContributions: ContributionDay[] = [];

    // Fetch contributions for each year sequentially
    for (const year of years) {
      const yearData = await fetchYearContributions(year, username);
      allContributions.push(...yearData);
    }

    // Sort by date (ascending - oldest first)
    allContributions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return allContributions;
  } catch (error) {
    console.error("Failed to fetch GitHub contributions:", error);
    throw error;
  }
}

/**
 * Fetches total stars across the user's non-fork repositories
 */
export async function fetchGitHubStats(username: string): Promise<{
  totalStars: number;
}> {
  const query = `
    query {
      user(login: "${username}") {
        repositories(first: 100, isFork: false) {
          nodes {
            stargazerCount
          }
        }
      }
    }
  `;

  const token = getGitHubToken();
  const response = await fetch(GITHUB_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as {
    data?: {
      user: {
        repositories: { nodes: Array<{ stargazerCount: number }> };
      };
    };
    errors?: Array<{ message: string }>;
  };

  if (data.errors) {
    throw new Error(`GitHub GraphQL error: ${data.errors[0]?.message}`);
  }

  const user = data.data?.user;
  if (!user) {
    throw new Error("User not found");
  }

  const totalStars = user.repositories.nodes.reduce(
    (sum, repo) => sum + repo.stargazerCount,
    0
  );

  return { totalStars };
}

/**
 * Get contribution intensity level (0-4) for color coding
 */
export function getContributionLevel(count: number): number {
  if (count === 0) return 0;
  if (count < 5) return 1;
  if (count < 10) return 2;
  if (count < 20) return 3;
  return 4;
}
