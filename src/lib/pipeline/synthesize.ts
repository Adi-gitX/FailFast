/**
 * Pipeline Stage 3: Failure Pattern Synthesis
 * Analyzes evidence to identify failure modes and risks
 */

import { queryPerplexity, PERPLEXITY_PROMPTS } from '../perplexity';
import {
    FailureMode,
    Risk,
    Challenge,
    Comparable,
    Citation,
    RiskLevel
} from '../types';
import { FailedStartup } from '../supabase';
import { RetrievalResult } from './retrieve';

export interface SynthesisResult {
    failureModes: FailureMode[];
    marketRisks: Risk[];
    timingRisks: Risk[];
    regulatoryRisks: Risk[];
    distributionChallenges: Challenge[];
    failedComparables: Comparable[];
    survivingComparables: Comparable[];
    citations: Citation[];
}

/**
 * Synthesize failure patterns from retrieved evidence
 */
export async function synthesizePatterns(
    decomposition: {
        valueProposition: string;
        targetMarket: string;
        businessModel: string;
        keyAssumptions: string[];
    },
    evidence: RetrievalResult
): Promise<SynthesisResult> {
    const allCitations: Citation[] = [...evidence.citations];

    // Analyze failure patterns
    const failureModes = await identifyFailureModes(decomposition, evidence, allCitations);

    // Categorize risks
    const marketRisks = identifyMarketRisks(decomposition, evidence);
    const timingRisks = identifyTimingRisks(decomposition, evidence);
    const regulatoryRisks = identifyRegulatoryRisks(evidence);

    // Identify distribution challenges
    const distributionChallenges = identifyDistributionChallenges(decomposition, evidence);

    // Transform historical failures into comparables
    const { failed, surviving } = categorizeComparables(evidence.historicalFailures, evidence.competitors);

    return {
        failureModes,
        marketRisks,
        timingRisks,
        regulatoryRisks,
        distributionChallenges,
        failedComparables: failed,
        survivingComparables: surviving,
        citations: allCitations,
    };
}

/**
 * Identify failure modes from patterns
 */
async function identifyFailureModes(
    decomposition: { valueProposition: string; businessModel: string; keyAssumptions: string[] },
    evidence: RetrievalResult,
    citations: Citation[]
): Promise<FailureMode[]> {
    const failureModes: FailureMode[] = [];

    // Common failure mode patterns
    const patterns = analyzeFailurePatterns(decomposition.businessModel, evidence);

    // Try to get more specific failure patterns from Perplexity
    try {
        const failedNames = evidence.historicalFailures.slice(0, 5).map(f => f.name).join(', ');

        const response = await queryPerplexity(
            PERPLEXITY_PROMPTS.FAILURE_PATTERNS,
            `Analyze failure patterns for startups similar to:
      
      Value proposition: ${decomposition.valueProposition}
      Business model: ${decomposition.businessModel}
      
      Similar failed startups: ${failedNames}
      
      Identify the top 3-5 most common failure modes with:
      - Name of the failure pattern
      - Description
      - How often it occurs
      - Warning signs
      - Mitigation strategies`,
            { returnCitations: true }
        );

        citations.push(...response.citations);

        // Parse additional failure modes from response
        const parsedModes = parseFailureModes(response.content);
        failureModes.push(...parsedModes);
    } catch (error) {
        console.error('Failure pattern retrieval failed:', error);
    }

    // Add pattern-based failure modes
    failureModes.push(...patterns);

    // Deduplicate by name
    const seen = new Set<string>();
    return failureModes.filter(mode => {
        const key = mode.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    }).slice(0, 7);
}

/**
 * Analyze failure patterns based on business model
 */
function analyzeFailurePatterns(businessModel: string, evidence: RetrievalResult): FailureMode[] {
    const modes: FailureMode[] = [];
    const model = businessModel.toLowerCase();

    // Marketplace failure modes
    if (model.includes('marketplace')) {
        modes.push({
            id: `fm-${Date.now()}-1`,
            name: 'Chicken-and-Egg Problem',
            description: 'Failure to achieve critical mass on both supply and demand sides simultaneously',
            probability: 70,
            timeframe: '6-18 months',
            triggers: ['Imbalanced growth between supply/demand', 'High churn on one side', 'Poor unit economics early on'],
            mitigations: ['Focus on one side first', 'Create artificial supply', 'Geographic concentration'],
            citations: [],
        });
    }

    // SaaS failure modes
    if (model.includes('saas') || model.includes('subscription')) {
        modes.push({
            id: `fm-${Date.now()}-2`,
            name: 'Churn Death Spiral',
            description: 'Customer churn rate exceeds acquisition rate, leading to inevitable decline',
            probability: 60,
            timeframe: '12-24 months',
            triggers: ['Monthly churn > 5%', 'Declining engagement metrics', 'Feature requests not addressed'],
            mitigations: ['Focus on activation and onboarding', 'Build switching costs', 'Customer success program'],
            citations: [],
        });

        modes.push({
            id: `fm-${Date.now()}-3`,
            name: 'CAC Blowout',
            description: 'Customer acquisition costs exceed lifetime value, making growth unprofitable',
            probability: 55,
            timeframe: '12-18 months',
            triggers: ['Rising ad costs', 'Declining conversion rates', 'LTV < 3x CAC'],
            mitigations: ['Organic growth channels', 'Product-led growth', 'Referral programs'],
            citations: [],
        });
    }

    // Consumer app failure modes
    if (model.includes('consumer') || model.includes('app')) {
        modes.push({
            id: `fm-${Date.now()}-4`,
            name: 'Viral Loop Failure',
            description: 'Product fails to achieve organic viral growth, requiring unsustainable paid acquisition',
            probability: 75,
            timeframe: '3-12 months',
            triggers: ['K-factor < 1', 'Low sharing/invite rate', 'Poor retention D1/D7/D30'],
            mitigations: ['Build sharing into core loop', 'Incentivize referrals', 'Community building'],
            citations: [],
        });
    }

    // AI/ML failure modes
    if (model.includes('ai') || model.includes('ml')) {
        modes.push({
            id: `fm-${Date.now()}-5`,
            name: 'AI Commoditization',
            description: 'Large incumbents release similar AI features, eliminating startup advantage',
            probability: 65,
            timeframe: '6-18 months',
            triggers: ['Foundation model improvements', 'Big tech feature announcements', 'Open source alternatives'],
            mitigations: ['Proprietary data moat', 'Vertical specialization', 'Workflow integration'],
            citations: [],
        });
    }

    // Universal failure modes
    modes.push({
        id: `fm-${Date.now()}-6`,
        name: 'Premature Scaling',
        description: 'Scaling operations before achieving product-market fit, burning capital inefficiently',
        probability: 50,
        timeframe: '12-24 months',
        triggers: ['Hiring ahead of revenue', 'Multiple market expansion', 'Feature bloat'],
        mitigations: ['Focus on one market segment', 'Validate before scaling', 'Lean operations'],
        citations: [],
    });

    return modes;
}

/**
 * Parse failure modes from LLM response
 */
function parseFailureModes(content: string): FailureMode[] {
    const modes: FailureMode[] = [];

    // Split by numbered items or headers
    const sections = content.split(/(?:\d+\.|#{1,3}\s)/);

    for (const section of sections) {
        if (section.length < 50) continue;

        // Extract name (bold text or first line)
        const nameMatch = section.match(/\*\*([^*]+)\*\*|^([A-Z][^:\n]+)/);
        if (!nameMatch) continue;

        const name = (nameMatch[1] || nameMatch[2]).trim();
        if (name.length < 5 || name.length > 100) continue;

        // Extract probability
        const probMatch = section.match(/(\d+)\s*%/);
        const probability = probMatch ? parseInt(probMatch[1]) : 50;

        // Extract timeframe
        const timeMatch = section.match(/(\d+[-–]\d+\s*(?:months?|years?))/i);
        const timeframe = timeMatch ? timeMatch[1] : '12-24 months';

        modes.push({
            id: `fm-${Date.now()}-${modes.length}`,
            name,
            description: section.slice(0, 200).replace(/\*\*/g, '').trim(),
            probability,
            timeframe,
            triggers: [],
            mitigations: [],
            citations: [],
        });
    }

    return modes.slice(0, 5);
}

/**
 * Identify market risks
 */
function identifyMarketRisks(
    decomposition: { targetMarket: string; keyAssumptions: string[] },
    evidence: RetrievalResult
): Risk[] {
    const risks: Risk[] = [];

    // Check market saturation
    if (evidence.competitors.length > 5) {
        risks.push({
            id: `mr-${Date.now()}-1`,
            category: 'Competition',
            title: 'High Market Saturation',
            description: `${evidence.competitors.length}+ competitors identified in this space, indicating potential commoditization`,
            level: evidence.competitors.length > 10 ? 'CRITICAL' : 'ELEVATED',
            evidence: [`${evidence.competitors.length} competitors found`],
            citations: [],
            historicalPrevalence: 70,
        });
    }

    // Check for failed competitors
    const failedCompetitors = evidence.competitors.filter(c =>
        c.status.toLowerCase().includes('shut') || c.status.toLowerCase().includes('failed')
    );
    if (failedCompetitors.length > 0) {
        risks.push({
            id: `mr-${Date.now()}-2`,
            category: 'Market Validation',
            title: 'Prior Market Failures',
            description: `${failedCompetitors.length} similar companies have failed in this market`,
            level: failedCompetitors.length > 2 ? 'CRITICAL' : 'ELEVATED',
            evidence: failedCompetitors.map(c => `${c.name} - ${c.status}`),
            citations: [],
            historicalPrevalence: 60,
        });
    }

    // Market size risk
    if (evidence.marketData.size === 'Unknown' || evidence.marketData.size.includes('million')) {
        risks.push({
            id: `mr-${Date.now()}-3`,
            category: 'Market Size',
            title: 'Limited Market Size',
            description: 'Market may be too small to support a venture-scale outcome',
            level: 'MODERATE',
            evidence: [`Market size: ${evidence.marketData.size}`],
            citations: [],
            historicalPrevalence: 40,
        });
    }

    return risks;
}

/**
 * Identify timing risks
 */
function identifyTimingRisks(
    decomposition: { valueProposition: string },
    evidence: RetrievalResult
): Risk[] {
    const risks: Risk[] = [];
    const valueProp = decomposition.valueProposition.toLowerCase();

    // AI timing considerations
    if (valueProp.includes('ai') || valueProp.includes('gpt') || valueProp.includes('llm')) {
        risks.push({
            id: `tr-${Date.now()}-1`,
            category: 'Technology Timing',
            title: 'AI Hype Cycle Risk',
            description: 'Entering AI market during peak hype - high competition, inflated expectations, potential correction',
            level: 'ELEVATED',
            evidence: ['2023-2025 AI funding boom', 'Rapid model commoditization'],
            citations: [],
            historicalPrevalence: 55,
        });
    }

    // Check for emerging vs mature market
    if (evidence.marketData.trends.length > 0) {
        const trendsText = evidence.marketData.trends.join(' ').toLowerCase();
        if (trendsText.includes('declining') || trendsText.includes('mature')) {
            risks.push({
                id: `tr-${Date.now()}-2`,
                category: 'Market Timing',
                title: 'Late Market Entry',
                description: 'Market shows signs of maturity or decline',
                level: 'ELEVATED',
                evidence: evidence.marketData.trends,
                citations: [],
                historicalPrevalence: 45,
            });
        }
    }

    return risks;
}

/**
 * Identify regulatory risks
 */
function identifyRegulatoryRisks(evidence: RetrievalResult): Risk[] {
    return evidence.regulations.map((reg, idx) => ({
        id: `rr-${Date.now()}-${idx}`,
        category: 'Regulatory',
        title: `${reg.regulation} Compliance Required`,
        description: `${reg.jurisdiction}: ${reg.impact.slice(0, 150)}`,
        level: reg.complianceCost.includes('$') && parseInt(reg.complianceCost.replace(/\D/g, '')) > 50000
            ? 'ELEVATED' as RiskLevel
            : 'MODERATE' as RiskLevel,
        evidence: [`Compliance cost: ${reg.complianceCost}`],
        citations: [],
        historicalPrevalence: 30,
    }));
}

/**
 * Identify distribution challenges
 */
function identifyDistributionChallenges(
    decomposition: { targetMarket: string; businessModel: string },
    evidence: RetrievalResult
): Challenge[] {
    const challenges: Challenge[] = [];
    const market = decomposition.targetMarket.toLowerCase();
    const model = decomposition.businessModel.toLowerCase();

    // Enterprise distribution challenge
    if (market.includes('enterprise') || market.includes('b2b')) {
        challenges.push({
            id: `dc-${Date.now()}-1`,
            type: 'distribution',
            title: 'Enterprise Sales Cycle',
            description: 'Long sales cycles (3-12 months), require dedicated sales team, high customer acquisition cost',
            severity: 'ELEVATED',
            citations: [],
        });
    }

    // Consumer app store challenges
    if (model.includes('app') || model.includes('consumer')) {
        challenges.push({
            id: `dc-${Date.now()}-2`,
            type: 'distribution',
            title: 'App Store Discovery',
            description: 'Extremely competitive app stores, high CAC, algorithm dependency for visibility',
            severity: 'CRITICAL',
            citations: [],
        });
    }

    // Platform dependency
    if (evidence.competitors.some(c => c.description?.toLowerCase().includes('platform'))) {
        challenges.push({
            id: `dc-${Date.now()}-3`,
            type: 'distribution',
            title: 'Platform Dependency Risk',
            description: 'Reliance on third-party platforms (Google, Apple, Meta) creates existential risk from policy changes',
            severity: 'ELEVATED',
            citations: [],
        });
    }

    return challenges;
}

/**
 * Categorize comparables into failed and surviving
 */
function categorizeComparables(
    failures: FailedStartup[],
    competitors: { name: string; description: string; funding?: string; status: string }[]
): { failed: Comparable[]; surviving: Comparable[] } {
    const failed: Comparable[] = failures.map(f => ({
        id: f.id,
        name: f.name,
        description: f.description,
        outcome: 'failed' as const,
        yearOutcome: f.year_died,
        moneyBurned: f.money_burned,
        failureReason: f.failure_reason,
        lessonsLearned: f.failure_reason ? [f.failure_reason] : [],
        similarities: [f.category || '', f.sector || ''].filter(Boolean),
        differences: [],
    }));

    const surviving: Comparable[] = competitors
        .filter(c => !c.status.toLowerCase().includes('shut') && !c.status.toLowerCase().includes('failed'))
        .map(c => ({
            id: `comp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name: c.name,
            description: c.description,
            outcome: c.status.toLowerCase().includes('acquired') ? 'acquired' as const : 'survived' as const,
            fundingRaised: c.funding,
            lessonsLearned: [],
            similarities: [],
            differences: [],
        }));

    return { failed: failed.slice(0, 5), surviving: surviving.slice(0, 5) };
}
