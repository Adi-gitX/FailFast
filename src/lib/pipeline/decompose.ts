/**
 * Pipeline Stage 1: Idea Decomposition
 * Breaks down a startup idea into structured components
 */

import { IdeaDecomposition } from '../types';

/**
 * System prompt for idea decomposition
 */
const DECOMPOSITION_PROMPT = `You are a startup analyst specializing in deconstructing business ideas.

Given a startup idea, extract and return a JSON object with these fields:

{
  "valueProposition": "The core value being offered to customers (1-2 sentences)",
  "targetMarket": "The specific customer segment being targeted",
  "businessModel": "How the company intends to make money",
  "keyAssumptions": ["List of 3-5 critical assumptions the idea relies on"],
  "testableHypotheses": ["List of 3-5 specific hypotheses that can be validated"]
}

Be specific and concrete. Extract implicit assumptions that the founder may not have stated.

IMPORTANT: Return ONLY the JSON object, no other text.`;

/**
 * Decompose a startup idea into structured components
 */
export async function decomposeIdea(ideaText: string): Promise<IdeaDecomposition> {
    // For now, we'll use a local analysis. In production, this could call an LLM.
    const decomposition = analyzeIdeaLocally(ideaText);
    return decomposition;
}

/**
 * Local analysis of idea components
 * This provides a structured breakdown without API calls
 */
function analyzeIdeaLocally(ideaText: string): IdeaDecomposition {
    const lowerIdea = ideaText.toLowerCase();

    // Extract value proposition (first sentence or main clause)
    const sentences = ideaText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const valueProposition = sentences[0]?.trim() || ideaText.slice(0, 200);

    // Detect target market from keywords
    let targetMarket = 'General consumers';
    if (lowerIdea.includes('b2b') || lowerIdea.includes('enterprise') || lowerIdea.includes('business')) {
        targetMarket = 'B2B / Enterprise customers';
    } else if (lowerIdea.includes('developer') || lowerIdea.includes('engineer')) {
        targetMarket = 'Software developers and engineers';
    } else if (lowerIdea.includes('startup') || lowerIdea.includes('founder')) {
        targetMarket = 'Startups and founders';
    } else if (lowerIdea.includes('small business') || lowerIdea.includes('smb')) {
        targetMarket = 'Small and medium businesses';
    } else if (lowerIdea.includes('student') || lowerIdea.includes('education')) {
        targetMarket = 'Students and educational institutions';
    } else if (lowerIdea.includes('health') || lowerIdea.includes('patient')) {
        targetMarket = 'Healthcare consumers and patients';
    }

    // Detect business model
    let businessModel = 'Freemium SaaS';
    if (lowerIdea.includes('subscription') || lowerIdea.includes('monthly')) {
        businessModel = 'Subscription-based SaaS';
    } else if (lowerIdea.includes('marketplace') || lowerIdea.includes('commission')) {
        businessModel = 'Marketplace with transaction fees';
    } else if (lowerIdea.includes('api') || lowerIdea.includes('platform')) {
        businessModel = 'API/Platform with usage-based pricing';
    } else if (lowerIdea.includes('advertising') || lowerIdea.includes('ad-supported')) {
        businessModel = 'Advertising-supported free product';
    } else if (lowerIdea.includes('hardware') || lowerIdea.includes('device')) {
        businessModel = 'Hardware sales with software services';
    } else if (lowerIdea.includes('consulting') || lowerIdea.includes('service')) {
        businessModel = 'Professional services / Consulting';
    }

    // Generate key assumptions
    const keyAssumptions = generateAssumptions(lowerIdea, targetMarket, businessModel);

    // Generate testable hypotheses
    const testableHypotheses = generateHypotheses(lowerIdea, targetMarket, businessModel);

    return {
        valueProposition,
        targetMarket,
        businessModel,
        keyAssumptions,
        testableHypotheses,
    };
}

/**
 * Generate key assumptions based on idea characteristics
 */
function generateAssumptions(idea: string, market: string, model: string): string[] {
    const assumptions: string[] = [];

    // Market assumptions
    assumptions.push(`${market} actively seeks solutions in this problem space`);
    assumptions.push(`The target market has budget and willingness to pay for this solution`);

    // Product assumptions
    if (idea.includes('ai') || idea.includes('machine learning')) {
        assumptions.push('AI/ML technology can deliver meaningfully better results than existing solutions');
        assumptions.push('Users trust AI-generated outputs for this use case');
    }

    if (idea.includes('data') || idea.includes('analytics')) {
        assumptions.push('Users have access to or can provide the required data');
        assumptions.push('Data quality is sufficient for meaningful insights');
    }

    // Business model assumptions
    if (model.includes('SaaS') || model.includes('Subscription')) {
        assumptions.push('Users will pay recurring fees rather than seeking one-time alternatives');
        assumptions.push('Unit economics work at projected customer acquisition costs');
    }

    if (model.includes('Marketplace')) {
        assumptions.push('Can achieve critical mass on both sides of the marketplace');
        assumptions.push('Transaction value justifies the platform fee');
    }

    // Competitive assumptions
    assumptions.push('Incumbents will not quickly replicate core features');

    return assumptions.slice(0, 5);
}

/**
 * Generate testable hypotheses
 */
function generateHypotheses(idea: string, market: string, model: string): string[] {
    const hypotheses: string[] = [];

    // Customer validation hypotheses
    hypotheses.push(`At least 40% of interviewed ${market.toLowerCase()} express strong interest`);
    hypotheses.push('10+ potential customers commit to paying before product launch');

    // Product hypotheses
    if (idea.includes('ai') || idea.includes('automat')) {
        hypotheses.push('Automation reduces task completion time by at least 50%');
    }

    // Market hypotheses
    hypotheses.push('Customer acquisition cost can be kept under $50 per user');
    hypotheses.push('Monthly retention rate exceeds 80% after first 90 days');

    // Business model hypotheses
    if (model.includes('SaaS')) {
        hypotheses.push('Customers convert from free to paid at 5%+ rate');
    }

    if (model.includes('Marketplace')) {
        hypotheses.push('Supply-side users can be acquired at <$20 per active participant');
    }

    hypotheses.push('Net Promoter Score exceeds 40 within first 100 users');

    return hypotheses.slice(0, 5);
}

/**
 * Enhanced decomposition using LLM (when available)
 */
export async function decomposeIdeaWithLLM(
    ideaText: string,
    queryFn: (system: string, user: string) => Promise<{ content: string }>
): Promise<IdeaDecomposition> {
    try {
        const response = await queryFn(DECOMPOSITION_PROMPT, ideaText);

        // Try to parse JSON from response
        const jsonMatch = response.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                valueProposition: parsed.valueProposition || '',
                targetMarket: parsed.targetMarket || '',
                businessModel: parsed.businessModel || '',
                keyAssumptions: Array.isArray(parsed.keyAssumptions) ? parsed.keyAssumptions : [],
                testableHypotheses: Array.isArray(parsed.testableHypotheses) ? parsed.testableHypotheses : [],
            };
        }
    } catch (error) {
        console.error('LLM decomposition failed, using local analysis:', error);
    }

    // Fallback to local analysis
    return decomposeIdea(ideaText);
}
