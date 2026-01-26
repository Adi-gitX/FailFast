import { createClient } from '@supabase/supabase-js';

// Failed Startups API configuration
const FAILED_STARTUPS_URL = 'https://lentxykytbylpxytluic.supabase.co';
const FAILED_STARTUPS_KEY = 'sb_publishable_W5UgIXv8SGHeo43duatMCw_0h8GbgCY';

export const failedStartupsClient = createClient(FAILED_STARTUPS_URL, FAILED_STARTUPS_KEY);

// Types for failed startups
export interface FailedStartup {
    id: string;
    name: string;
    description: string;
    category: string;
    year_died: number;
    money_burned: string;
    money_burned_raw: number;
    failure_reason?: string;
    sector?: string;
    difficulty?: string;
    scalability?: string;
    market?: string;
    tags?: string[];
    city?: string;
}

export interface StartupIdea {
    id: string;
    name: string;
    description: string;
    tags: string[];
    model: string;
    effort: string;
    monetization: string;
    industry: string;
    votes: number;
    author?: string;
}

// Fetch failed startups from API
export async function getFailedStartups(
    limit: number = 100,
    offset: number = 0,
    sector: string | null = null
): Promise<FailedStartup[]> {
    try {
        const response = await fetch(
            `${FAILED_STARTUPS_URL}/rest/v1/rpc/get_startups_list`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': FAILED_STARTUPS_KEY,
                    'Authorization': `Bearer ${FAILED_STARTUPS_KEY}`,
                    'Content-Profile': 'public',
                },
                body: JSON.stringify({
                    p_limit: limit,
                    p_offset: offset,
                    p_sector: sector,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch startups: ${response.statusText}`);
        }

        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Error fetching failed startups:', error);
        return [];
    }
}

// Search failed startups
export async function searchFailedStartups(
    query: string,
    startups: FailedStartup[]
): Promise<FailedStartup[]> {
    const lowerQuery = query.toLowerCase();
    return startups.filter(
        (startup) =>
            startup.name.toLowerCase().includes(lowerQuery) ||
            startup.description.toLowerCase().includes(lowerQuery) ||
            startup.category?.toLowerCase().includes(lowerQuery) ||
            startup.sector?.toLowerCase().includes(lowerQuery)
    );
}

// Get startup categories
export function getCategories(startups: FailedStartup[]): string[] {
    const categories = new Set<string>();
    startups.forEach((s) => {
        if (s.category) categories.add(s.category);
        if (s.sector) categories.add(s.sector);
    });
    return Array.from(categories).sort();
}

// Calculate total money burned
export function calculateTotalBurned(startups: FailedStartup[]): number {
    return startups.reduce((total, startup) => {
        return total + (startup.money_burned_raw || 0);
    }, 0);
}

// Format money amount
export function formatMoney(amount: number): string {
    if (amount >= 1_000_000_000) {
        return `$${(amount / 1_000_000_000).toFixed(1)}B`;
    }
    if (amount >= 1_000_000) {
        return `$${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (amount >= 1_000) {
        return `$${(amount / 1_000).toFixed(0)}K`;
    }
    return `$${amount}`;
}
