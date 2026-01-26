export const SYSTEM_PROMPT = `You are StartupCheck, an unflinching startup analysis system designed to give founders the brutal truth about their ideas.

## Your Core Mission
Analyze startup ideas against historical failure patterns, current market data, and success factors. Never sugarcoat. Never encourage blindly. Always explain why.

## Analysis Framework
When analyzing a startup idea, you MUST evaluate across these dimensions:

### 1. 🔴 BRUTAL REALITY CHECK
- Direct comparison to failed startups with similar models
- Specific patterns that led to failure
- Market timing issues
- Competitive landscape threats
- Unit economics challenges

### 2. 🟡 UNIQUENESS ASSESSMENT
- How this compares to existing solutions
- What competitors are doing better
- Patent/IP landscape
- Moat potential (or lack thereof)

### 3. 🟢 SUCCESS PATHWAYS
- What would need to be true for this to work
- Which specific niches might work
- Timing considerations
- Resource requirements

### 4. 🔄 PIVOT SUGGESTIONS
- Alternative approaches that might work better
- Adjacent markets with better dynamics
- Different business models for the same core idea

### 5. 📊 PROBABILITY ASSESSMENT
Provide specific percentages based on:
- Failure Rate: Based on similar startup patterns
- Success Likelihood: Based on market conditions
- Time-to-Failure Estimate: If failure seems likely

## Output Format Rules
- NO hype language
- NO motivational phrases
- NO "you can do it" encouragement
- ALWAYS cite specific examples
- ALWAYS provide data-backed reasoning
- ALWAYS mention similar failed/successful startups
- Use clear section headers
- Be concise but thorough

## Key Data Points to Reference
- Failed startup patterns from our database
- YC companies in similar spaces
- Recent funding trends
- Market size indicators
- Regulatory challenges

Remember: A founder's greatest asset is knowing the truth early. Your job is to reveal it.`;

export const ANALYSIS_SECTIONS = [
    {
        id: 'reality',
        title: '🔴 Why This Will Likely Fail',
        description: 'Brutal truth about failure patterns',
        color: 'danger',
    },
    {
        id: 'uniqueness',
        title: '🟡 Why This Is Not Unique',
        description: 'Competitive landscape analysis',
        color: 'warning',
    },
    {
        id: 'success',
        title: '🟢 How This Could Succeed',
        description: 'Conditions for success',
        color: 'success',
    },
    {
        id: 'pivots',
        title: '🔄 Better Versions / Pivots',
        description: 'Alternative approaches',
        color: 'accent',
    },
    {
        id: 'probability',
        title: '📊 Probability Assessment',
        description: 'Data-driven likelihood analysis',
        color: 'accent',
    },
];

export function buildAnalysisPrompt(
    idea: string,
    failedStartups: Array<{ name: string; description: string; category: string; failure_reason?: string }>
): string {
    // Get relevant failed startups for context
    const relevantFailures = failedStartups
        .slice(0, 20)
        .map((s) => `- ${s.name} (${s.category}): ${s.description.slice(0, 100)}...`)
        .join('\n');

    return `
## STARTUP IDEA TO ANALYZE:
${idea}

## CONTEXT - RELEVANT FAILED STARTUPS:
${relevantFailures}

## YOUR TASK:
Provide a comprehensive analysis following the framework in your instructions. Be specific, cite examples, and don't hold back.

Focus on:
1. Which of these failed startups had similar models and why they failed
2. Current market conditions for this type of product
3. Specific competitor analysis
4. Realistic probability of success vs failure
5. Actionable pivot suggestions if the core idea is flawed

Remember: The founder needs truth, not comfort.
`;
}

export function extractProbabilityFromAnalysis(analysis: string): {
    successRate: number;
    failureRate: number;
    timeToFailure: string;
} {
    // Default values
    let successRate = 15;
    let failureRate = 85;
    let timeToFailure = '18-24 months';

    // Try to extract percentages from the analysis
    const successMatch = analysis.match(/success(?:\s+likelihood)?[:\s]+(\d+)%/i);
    const failureMatch = analysis.match(/failure(?:\s+rate)?[:\s]+(\d+)%/i);
    const timeMatch = analysis.match(/(\d+[-–]\d+\s+months)/i);

    if (successMatch) {
        successRate = parseInt(successMatch[1], 10);
        failureRate = 100 - successRate;
    } else if (failureMatch) {
        failureRate = parseInt(failureMatch[1], 10);
        successRate = 100 - failureRate;
    }

    if (timeMatch) {
        timeToFailure = timeMatch[1];
    }

    return { successRate, failureRate, timeToFailure };
}
