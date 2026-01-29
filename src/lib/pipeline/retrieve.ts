/**
 * Pipeline Stage 2: Evidence Retrieval
 * Fetches live market data, competitor info, and historical patterns
 */

import { queryPerplexity, PERPLEXITY_PROMPTS } from '../perplexity';
import { Citation, Risk, Comparable, Challenge } from '../types';
import { getFailedStartups, FailedStartup } from '../supabase';

export interface RetrievalResult {
    marketData: MarketData;
    competitors: CompetitorData[];
    regulations: RegulatoryData[];
    historicalFailures: FailedStartup[];
    citations: Citation[];
}

interface MarketData {
    size: string;
    growthRate: string;
    trends: string[];
    recentNews: string[];
}

interface CompetitorData {
    name: string;
    description: string;
    funding?: string;
    status: string;
    website?: string;
    strengths: string[];
    weaknesses: string[];
}

interface RegulatoryData {
    regulation: string;
    jurisdiction: string;
    impact: string;
    complianceCost: string;
}

/**
 * Retrieve evidence for a decomposed idea
 */
export async function retrieveEvidence(
    decomposition: {
        valueProposition: string;
        targetMarket: string;
        businessModel: string;
        keyAssumptions: string[];
    }
): Promise<RetrievalResult> {
    const allCitations: Citation[] = [];

    // Parallel queries for efficiency
    const [marketResult, competitorResult, regulatoryResult, historicalResult] = await Promise.all([
        retrieveMarketData(decomposition, allCitations),
        retrieveCompetitors(decomposition, allCitations),
        retrieveRegulations(decomposition, allCitations),
        retrieveHistoricalFailures(decomposition),
    ]);

    return {
        marketData: marketResult,
        competitors: competitorResult,
        regulations: regulatoryResult,
        historicalFailures: historicalResult,
        citations: allCitations,
    };
}

/**
 * Retrieve market data using Perplexity
 */
async function retrieveMarketData(
    decomposition: { valueProposition: string; targetMarket: string },
    citations: Citation[]
): Promise<MarketData> {
    try {
        const response = await queryPerplexity(
            PERPLEXITY_PROMPTS.EVIDENCE_RETRIEVAL,
            `Research the market for: ${decomposition.valueProposition}
      
      Target market: ${decomposition.targetMarket}
      
      Find and report:
      1. Total addressable market size
      2. Market growth rate
      3. Key trends in this space
      4. Recent news and developments
      
      Provide specific numbers and cite sources.`,
            { returnCitations: true }
        );

        citations.push(...response.citations);

        // Parse the response into structured data
        return parseMarketData(response.content);
    } catch (error) {
        console.error('Market data retrieval failed:', error);
        return {
            size: 'Unknown',
            growthRate: 'Unknown',
            trends: [],
            recentNews: [],
        };
    }
}

/**
 * Parse market data from LLM response
 */
function parseMarketData(content: string): MarketData {
    // Extract market size
    const sizeMatch = content.match(/\$[\d.]+\s*(billion|million|B|M)/i);
    const size = sizeMatch ? sizeMatch[0] : 'Not determined';

    // Extract growth rate
    const growthMatch = content.match(/(\d+(?:\.\d+)?)\s*%\s*(?:CAGR|growth|annually)/i);
    const growthRate = growthMatch ? `${growthMatch[1]}% annually` : 'Not determined';

    // Extract trends (look for numbered or bulleted lists)
    const trends: string[] = [];
    const trendMatches = content.match(/(?:trend|development|shift)[s]?[:\s]+([^\n]+)/gi);
    if (trendMatches) {
        trendMatches.slice(0, 5).forEach(match => {
            const cleaned = match.replace(/^(?:trend|development|shift)[s]?[:\s]+/i, '').trim();
            if (cleaned.length > 10) trends.push(cleaned);
        });
    }

    // Extract recent news
    const recentNews: string[] = [];
    const newsMatches = content.match(/(?:recent|2024|2025|January|February)[^\n.]+[.]/gi);
    if (newsMatches) {
        newsMatches.slice(0, 3).forEach(match => {
            if (match.length > 20) recentNews.push(match.trim());
        });
    }

    return { size, growthRate, trends, recentNews };
}

/**
 * Retrieve competitor information
 */
async function retrieveCompetitors(
    decomposition: { valueProposition: string; targetMarket: string; businessModel: string },
    citations: Citation[]
): Promise<CompetitorData[]> {
    try {
        const response = await queryPerplexity(
            PERPLEXITY_PROMPTS.COMPETITIVE_LANDSCAPE,
            `Find competitors for this startup concept:
      
      Value proposition: ${decomposition.valueProposition}
      Target market: ${decomposition.targetMarket}
      Business model: ${decomposition.businessModel}
      
      List the top 5-10 competitors with:
      - Company name
      - What they do
      - Funding raised
      - Current status (active, acquired, struggling, shut down)
      - Website URL
      - Their key strengths
      - Their key weaknesses`,
            { returnCitations: true }
        );

        citations.push(...response.citations);

        return parseCompetitorData(response.content);
    } catch (error) {
        console.error('Competitor retrieval failed:', error);
        return [];
    }
}

/**
 * Parse competitor data from LLM response
 */
function parseCompetitorData(content: string): CompetitorData[] {
    const competitors: CompetitorData[] = [];

    // Split by common patterns for competitor listings
    const sections = content.split(/(?:\d+\.|#{1,3}|\*\*[^*]+\*\*)/);

    for (const section of sections) {
        if (section.length < 30) continue;

        // Try to extract company name (bold or at start of section)
        const nameMatch = section.match(/^\s*([A-Z][a-zA-Z0-9\s&.]+?)(?:\s*[-–:(\[]|raised|\s+is)/);
        if (!nameMatch) continue;

        const name = nameMatch[1].trim();
        if (name.length < 2 || name.length > 50) continue;

        // Extract funding
        const fundingMatch = section.match(/\$[\d.]+\s*(?:billion|million|B|M)/i);
        const funding = fundingMatch ? fundingMatch[0] : undefined;

        // Extract website
        const websiteMatch = section.match(/https?:\/\/[^\s)]+/);
        const website = websiteMatch ? websiteMatch[0] : undefined;

        // Determine status
        let status = 'Active';
        if (/shut\s*down|failed|defunct|closed/i.test(section)) {
            status = 'Shut down';
        } else if (/acquired|bought/i.test(section)) {
            status = 'Acquired';
        } else if (/struggling|pivot|layoff/i.test(section)) {
            status = 'Struggling';
        }

        // Extract description (first sentence after name)
        const descMatch = section.match(/(?:is|provides|offers|builds)\s+([^.]+)/i);
        const description = descMatch ? descMatch[1].trim() : section.slice(0, 150).trim();

        competitors.push({
            name,
            description,
            funding,
            status,
            website,
            strengths: [],
            weaknesses: [],
        });
    }

    return competitors.slice(0, 10);
}

/**
 * Retrieve regulatory information
 */
async function retrieveRegulations(
    decomposition: { valueProposition: string; targetMarket: string },
    citations: Citation[]
): Promise<RegulatoryData[]> {
    try {
        const response = await queryPerplexity(
            PERPLEXITY_PROMPTS.REGULATORY_CHECK,
            `What regulations apply to this business:
      
      Business: ${decomposition.valueProposition}
      Market: ${decomposition.targetMarket}
      
      Identify:
      1. Relevant regulations (GDPR, HIPAA, SEC, etc.)
      2. Which jurisdictions they apply in
      3. Impact on business operations
      4. Estimated compliance costs`,
            { returnCitations: true }
        );

        citations.push(...response.citations);

        return parseRegulatoryData(response.content);
    } catch (error) {
        console.error('Regulatory retrieval failed:', error);
        return [];
    }
}

/**
 * Parse regulatory data from LLM response
 */
function parseRegulatoryData(content: string): RegulatoryData[] {
    const regulations: RegulatoryData[] = [];

    // Look for common regulation acronyms
    const regulationPatterns = [
        { pattern: /GDPR/gi, name: 'GDPR', jurisdiction: 'European Union' },
        { pattern: /HIPAA/gi, name: 'HIPAA', jurisdiction: 'United States (Healthcare)' },
        { pattern: /SOC\s*2/gi, name: 'SOC 2', jurisdiction: 'United States' },
        { pattern: /PCI[\s-]*DSS/gi, name: 'PCI-DSS', jurisdiction: 'Global (Payment Cards)' },
        { pattern: /CCPA/gi, name: 'CCPA', jurisdiction: 'California, USA' },
        { pattern: /SEC/gi, name: 'SEC Regulations', jurisdiction: 'United States (Finance)' },
        { pattern: /FTC/gi, name: 'FTC Guidelines', jurisdiction: 'United States' },
        { pattern: /FDA/gi, name: 'FDA Regulations', jurisdiction: 'United States (Health/Food)' },
    ];

    for (const { pattern, name, jurisdiction } of regulationPatterns) {
        if (pattern.test(content)) {
            // Find context around the match
            const contextMatch = content.match(new RegExp(`.{0,100}${pattern.source}.{0,200}`, 'i'));
            const context = contextMatch ? contextMatch[0] : '';

            // Try to extract cost information
            const costMatch = context.match(/\$[\d,]+(?:\s*-\s*\$[\d,]+)?|\d+(?:,\d+)?\s*(?:dollar|per|annually)/i);

            regulations.push({
                regulation: name,
                jurisdiction,
                impact: context.slice(0, 150).trim(),
                complianceCost: costMatch ? costMatch[0] : 'Variable',
            });
        }
    }

    return regulations;
}

/**
 * Retrieve historical failures from Supabase
 */
async function retrieveHistoricalFailures(
    decomposition: { valueProposition: string; targetMarket: string; businessModel: string }
): Promise<FailedStartup[]> {
    try {
        // Get all failed startups
        const allStartups = await getFailedStartups(100, 0, null);

        // Score relevance to current idea
        const ideaKeywords = extractKeywords(
            `${decomposition.valueProposition} ${decomposition.targetMarket} ${decomposition.businessModel}`
        );

        const scoredStartups = allStartups.map(startup => {
            const startupKeywords = extractKeywords(
                `${startup.name} ${startup.description} ${startup.category || ''} ${startup.sector || ''}`
            );

            // Count keyword matches
            let score = 0;
            for (const keyword of ideaKeywords) {
                if (startupKeywords.some(sk => sk.includes(keyword) || keyword.includes(sk))) {
                    score += 1;
                }
            }

            return { startup, score };
        });

        // Return top 10 most relevant failures
        return scoredStartups
            .filter(s => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map(s => s.startup);
    } catch (error) {
        console.error('Historical failures retrieval failed:', error);
        return [];
    }
}

/**
 * Extract keywords from text for matching
 */
function extractKeywords(text: string): string[] {
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
        'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'must', 'that', 'which', 'who',
        'whom', 'this', 'these', 'those', 'it', 'its', 'they', 'their', 'them',
    ]);

    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word));
}
