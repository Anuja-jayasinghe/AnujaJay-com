import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

type ContributionDay = { date: string; contributionCount: number; contributionLevel: string };
type ContributionWeek = { contributionDays: ContributionDay[] };

export async function GET() {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const username = 'Anuja-jayasinghe';

    if (!GITHUB_TOKEN) {
        return NextResponse.json({ error: 'GITHUB_TOKEN_NOT_FOUND' }, { status: 500 });
    }

    const query = `
        query($username: String!) {
            user(login: $username) {
                contributionsCollection {
                    contributionCalendar {
                        weeks {
                            contributionDays {
                                contributionCount
                                date
                                contributionLevel
                            }
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
            },
            body: JSON.stringify({
                query,
                variables: { username }
            }),
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            throw new Error(`GitHub API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.errors) {
            return NextResponse.json({ error: 'GRAPHQL_ERROR', details: data.errors }, { status: 500 });
        }

        const weeks: ContributionWeek[] = data.data.user.contributionsCollection.contributionCalendar.weeks;

        const flattenedDays = weeks.flatMap((week) =>
            week.contributionDays.map((day) => ({
                date: day.date,
                count: day.contributionCount,
                level: day.contributionLevel
            }))
        );

        return NextResponse.json(flattenedDays);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: 'UPLINK_INTERNAL_ERROR', message }, { status: 500 });
    }
}
