/**
 * Perplexity API Client
 * Implements round-robin key rotation for rate limiting
 */

import { Citation, PerplexityResponse } from './types';

// API key rotation state
let currentKeyIndex = 0;
const API_KEYS = [
    process.env.PERPLEXITY_API_KEY_1,
    process.env.PERPLEXITY_API_KEY_2,
    process.env.PERPLEXITY_API_KEY_3,
].filter(Boolean) as string[];

// Simple in-memory cache for responses
const responseCache = new Map<string, { response: PerplexityResponse; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

/**
 * Get the next API key in rotation
 */
function getNextApiKey(): string {
    if (API_KEYS.length === 0) {
        throw new Error('No Perplexity API keys configured');
    }
    const key = API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    return key;
}

/**
 * Generate a cache key from the request
 */
function generateCacheKey(prompt: string, model: string): string {
    return `${model}:${prompt.slice(0, 500)}`;
}

/**
 * Parse citations from Perplexity response
 */
function parseCitations(content: string, sources?: Array<{ url: string; title?: string }>): Citation[] {
    const citations: Citation[] = [];

    if (sources && Array.isArray(sources)) {
        sources.forEach((source, index) => {
            citations.push({
                id: `citation-${index + 1}`,
                source: new URL(source.url).hostname.replace('www.', ''),
                url: source.url,
                title: source.title || source.url,
                snippet: '',
                retrievedAt: new Date(),
            });
        });
    }

    // Also extract inline citations [1], [2], etc.
    const inlineCitationRegex = /\[(\d+)\]/g;
    let match;
    while ((match = inlineCitationRegex.exec(content)) !== null) {
        const citationNum = parseInt(match[1]);
        if (!citations.find(c => c.id === `citation-${citationNum}`)) {
            citations.push({
                id: `citation-${citationNum}`,
                source: 'inline',
                title: `Reference ${citationNum}`,
                snippet: '',
                retrievedAt: new Date(),
            });
        }
    }

    return citations;
}

/**
 * Query Perplexity API with automatic key rotation and caching
 */
export async function queryPerplexity(
    systemPrompt: string,
    userPrompt: string,
    options: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
        useCache?: boolean;
        searchDomainFilter?: string[];
        returnCitations?: boolean;
    } = {}
): Promise<PerplexityResponse> {
    const {
        model = 'sonar-pro',
        temperature = 0.2,
        maxTokens = 4000,
        useCache = true,
        searchDomainFilter,
        returnCitations = true,
    } = options;

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
    const cacheKey = generateCacheKey(fullPrompt, model);

    // Check cache
    if (useCache) {
        const cached = responseCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return cached.response;
        }
    }

    // Make API request with retry logic
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
        const apiKey = getNextApiKey();

        try {
            const requestBody: Record<string, unknown> = {
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature,
                max_tokens: maxTokens,
                return_citations: returnCitations,
            };

            if (searchDomainFilter && searchDomainFilter.length > 0) {
                requestBody.search_domain_filter = searchDomainFilter;
            }

            const response = await fetch('https://api.perplexity.ai/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();

                // Rate limit - try next key
                if (response.status === 429) {
                    lastError = new Error(`Rate limited: ${errorText}`);
                    continue;
                }

                throw new Error(`Perplexity API error (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '';
            const citations = parseCitations(content, data.citations);

            const result: PerplexityResponse = {
                content,
                citations,
                model: data.model || model,
                usage: {
                    promptTokens: data.usage?.prompt_tokens || 0,
                    completionTokens: data.usage?.completion_tokens || 0,
                },
            };

            // Cache successful response
            if (useCache) {
                responseCache.set(cacheKey, { response: result, timestamp: Date.now() });
            }

            return result;
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));

            // If not a rate limit, don't try other keys
            if (!lastError.message.includes('Rate limited')) {
                throw lastError;
            }
        }
    }

    throw lastError || new Error('All Perplexity API keys exhausted');
}

/**
 * Clear the response cache
 */
export function clearCache(): void {
    responseCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
    return {
        size: responseCache.size,
        keys: Array.from(responseCache.keys()),
    };
}

/**
 * Pre-defined system prompts for different pipeline stages
 */
export const PERPLEXITY_PROMPTS = {
    EVIDENCE_RETRIEVAL: `You are a research analyst gathering evidence about startup ideas and markets.
Your task is to find SPECIFIC, CURRENT data about:
1. Market size and trends
2. Existing competitors and their status
3. Regulatory landscape
4. Recent news and developments
5. Similar startups that failed or succeeded

Always cite your sources. Be factual and specific.`,

    FAILURE_PATTERNS: `You are a startup failure analyst studying historical patterns.
Your task is to identify:
1. Common failure modes for this type of startup
2. Specific companies that failed with similar models
3. The reasons they failed
4. Timeline patterns (when failures typically occur)
5. Warning signs that preceded failure

Frame findings as historical patterns, not predictions. Always cite sources.`,

    COMPETITIVE_LANDSCAPE: `You are a competitive intelligence analyst.
Your task is to map:
1. Direct competitors with funding and status
2. Indirect competitors and alternatives
3. Market positioning of each player
4. Their strengths and weaknesses
5. Recent strategic moves

Provide specific company names, funding amounts, and website URLs where possible.`,

    REGULATORY_CHECK: `You are a regulatory compliance researcher.
Your task is to identify:
1. Relevant regulations for this business type
2. Compliance requirements
3. Recent regulatory changes
4. Enforcement actions in this space
5. Geographic variations in regulation

Be specific about jurisdictions and citation of regulatory sources.`,
};
