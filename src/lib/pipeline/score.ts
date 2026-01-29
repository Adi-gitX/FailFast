/**
 * Pipeline Stage 4: Risk Scoring
 * Generates structured risk assessment with non-deterministic framing
 */

import {
    RiskScore,
    RiskLevel,
    Lever,
    Warning,
    FailureMode,
    Risk,
    Challenge
} from '../types';
import { SynthesisResult } from './synthesize';
import { IdeaDecomposition } from '../types';

export interface ScoringResult {
    riskScore: RiskScore;
    improvementLevers: Lever[];
    earlyWarnings: Warning[];
}

/**
 * Generate risk score and actionables from synthesis
 */
export function scoreRisks(
    decomposition: IdeaDecomposition,
    synthesis: SynthesisResult
): ScoringResult {
    // Calculate overall risk score
    const riskScore = calculateRiskScore(synthesis);

    // Generate improvement levers
    const improvementLevers = generateLevers(decomposition, synthesis);

    // Generate early warning signals
    const earlyWarnings = generateWarnings(synthesis);

    return {
        riskScore,
        improvementLevers,
        earlyWarnings,
    };
}

/**
 * Calculate composite risk score from all factors
 */
function calculateRiskScore(synthesis: SynthesisResult): RiskScore {
    // Calculate category scores
    const marketScore = calculateCategoryScore(synthesis.marketRisks);
    const timingScore = calculateCategoryScore(synthesis.timingRisks);
    const regulatoryScore = calculateCategoryScore(synthesis.regulatoryRisks);

    // Competition score based on failed comparables
    const competitionScore = calculateCompetitionScore(
        synthesis.failedComparables.length,
        synthesis.survivingComparables.length
    );

    // Execution score based on failure modes
    const executionScore = calculateExecutionScore(synthesis.failureModes);

    // Calculate overall (weighted average)
    const scores = [marketScore, timingScore, regulatoryScore, competitionScore, executionScore];
    const weights = [0.25, 0.15, 0.15, 0.25, 0.20];

    const weightedSum = scores.reduce((sum, score, i) => sum + riskLevelToNumber(score) * weights[i], 0);
    const overall = numberToRiskLevel(weightedSum);

    // Calculate confidence based on available evidence
    const evidenceCount =
        synthesis.marketRisks.length +
        synthesis.timingRisks.length +
        synthesis.regulatoryRisks.length +
        synthesis.failedComparables.length +
        synthesis.citations.length;

    const confidence = Math.min(85, 40 + evidenceCount * 3);

    return {
        overall,
        confidence,
        breakdown: {
            market: marketScore,
            timing: timingScore,
            regulatory: regulatoryScore,
            competition: competitionScore,
            execution: executionScore,
        },
        disclaimer: generateDisclaimer(overall, confidence),
    };
}

/**
 * Calculate score for a category of risks
 */
function calculateCategoryScore(risks: Risk[]): RiskLevel {
    if (risks.length === 0) return 'LOW';

    const criticalCount = risks.filter(r => r.level === 'CRITICAL').length;
    const elevatedCount = risks.filter(r => r.level === 'ELEVATED').length;

    if (criticalCount >= 2) return 'CRITICAL';
    if (criticalCount >= 1 || elevatedCount >= 2) return 'ELEVATED';
    if (elevatedCount >= 1) return 'MODERATE';
    return 'LOW';
}

/**
 * Calculate competition score
 */
function calculateCompetitionScore(failedCount: number, survivingCount: number): RiskLevel {
    const ratio = survivingCount > 0 ? failedCount / survivingCount : failedCount;

    if (ratio >= 3 || (failedCount >= 5 && survivingCount <= 1)) return 'CRITICAL';
    if (ratio >= 2 || failedCount >= 3) return 'ELEVATED';
    if (ratio >= 1 || failedCount >= 2) return 'MODERATE';
    return 'LOW';
}

/**
 * Calculate execution score from failure modes
 */
function calculateExecutionScore(failureModes: FailureMode[]): RiskLevel {
    const avgProbability = failureModes.length > 0
        ? failureModes.reduce((sum, fm) => sum + fm.probability, 0) / failureModes.length
        : 50;

    if (avgProbability >= 70) return 'CRITICAL';
    if (avgProbability >= 55) return 'ELEVATED';
    if (avgProbability >= 40) return 'MODERATE';
    return 'LOW';
}

/**
 * Convert risk level to numeric score
 */
function riskLevelToNumber(level: RiskLevel): number {
    switch (level) {
        case 'CRITICAL': return 4;
        case 'ELEVATED': return 3;
        case 'MODERATE': return 2;
        case 'LOW': return 1;
        default: return 2;
    }
}

/**
 * Convert numeric score to risk level
 */
function numberToRiskLevel(score: number): RiskLevel {
    if (score >= 3.5) return 'CRITICAL';
    if (score >= 2.5) return 'ELEVATED';
    if (score >= 1.5) return 'MODERATE';
    return 'LOW';
}

/**
 * Generate non-deterministic disclaimer
 */
function generateDisclaimer(overall: RiskLevel, confidence: number): string {
    const disclaimers = {
        CRITICAL: `This assessment reflects historical patterns suggesting elevated risk factors. ${confidence}% of similar ventures have encountered significant challenges. This is not a prediction of failure, but an indicator of areas requiring careful attention.`,
        ELEVATED: `Historical data indicates several risk factors common in this space. With ${confidence}% evidence coverage, we recommend addressing the highlighted concerns while recognizing that many successful startups have navigated similar challenges.`,
        MODERATE: `The risk profile shows a mix of historical patterns. At ${confidence}% confidence, some challenges are common while others are less prevalent. Success depends heavily on execution and market timing.`,
        LOW: `Fewer common failure patterns are present based on ${confidence}% of available evidence. However, this does not guarantee success—novel challenges may emerge that aren't reflected in historical data.`,
    };

    return disclaimers[overall];
}

/**
 * Generate actionable improvement levers
 */
function generateLevers(
    decomposition: IdeaDecomposition,
    synthesis: SynthesisResult
): Lever[] {
    const levers: Lever[] = [];

    // Based on failure modes
    for (const mode of synthesis.failureModes.slice(0, 3)) {
        if (mode.mitigations.length > 0) {
            levers.push({
                id: `lever-${Date.now()}-${levers.length}`,
                title: `Mitigate: ${mode.name}`,
                description: mode.mitigations[0],
                impact: mode.probability >= 60 ? 'high' : 'medium',
                effort: 'medium',
                category: 'product',
                steps: mode.mitigations,
            });
        }
    }

    // Based on market risks
    if (synthesis.marketRisks.some(r => r.category === 'Competition')) {
        levers.push({
            id: `lever-${Date.now()}-comp`,
            title: 'Differentiation Strategy',
            description: 'Develop unique positioning against identified competitors',
            impact: 'high',
            effort: 'high',
            category: 'market',
            steps: [
                'Identify underserved segments competitors ignore',
                'Build proprietary data or technology moat',
                'Focus on specific vertical before expanding',
                'Create switching costs through integrations',
            ],
        });
    }

    // Based on key assumptions
    if (decomposition.keyAssumptions.length > 0) {
        levers.push({
            id: `lever-${Date.now()}-validate`,
            title: 'Assumption Validation Sprint',
            description: 'Systematically test critical assumptions before full commitment',
            impact: 'high',
            effort: 'low',
            category: 'product',
            steps: decomposition.keyAssumptions.map(a => `Validate: ${a}`),
        });
    }

    // Testable hypotheses as actions
    if (decomposition.testableHypotheses.length > 0) {
        levers.push({
            id: `lever-${Date.now()}-test`,
            title: 'Hypothesis Testing Plan',
            description: 'Run experiments to validate or invalidate core hypotheses',
            impact: 'high',
            effort: 'medium',
            category: 'product',
            steps: decomposition.testableHypotheses.map(h => `Test: ${h}`),
        });
    }

    // Distribution challenges
    if (synthesis.distributionChallenges.length > 0) {
        levers.push({
            id: `lever-${Date.now()}-dist`,
            title: 'Distribution Strategy',
            description: 'Develop alternative channels to reduce distribution risk',
            impact: 'high',
            effort: 'high',
            category: 'market',
            steps: [
                'Identify organic/viral growth mechanisms',
                'Build partnership distribution channels',
                'Create content marketing engine',
                'Develop referral incentive programs',
            ],
        });
    }

    // Surviving comparable learnings
    if (synthesis.survivingComparables.length > 0) {
        levers.push({
            id: `lever-${Date.now()}-learn`,
            title: 'Competitive Intelligence',
            description: 'Study successful competitors for strategic insights',
            impact: 'medium',
            effort: 'low',
            category: 'market',
            steps: synthesis.survivingComparables.slice(0, 4).map(c =>
                `Analyze ${c.name}: ${c.differences[0] || 'strategy and positioning'}`
            ),
        });
    }

    return levers.slice(0, 6);
}

/**
 * Generate early warning signals
 */
function generateWarnings(synthesis: SynthesisResult): Warning[] {
    const warnings: Warning[] = [];

    // Failure mode warnings
    for (const mode of synthesis.failureModes.slice(0, 4)) {
        warnings.push({
            id: `warn-${Date.now()}-${warnings.length}`,
            signal: mode.triggers[0] || `Signs of ${mode.name}`,
            description: `Early indicator of ${mode.name.toLowerCase()}`,
            threshold: mode.triggers.length > 1 ? mode.triggers[1] : 'When pattern becomes consistent',
            monitoringMethod: `Track metrics related to ${mode.name.toLowerCase().split(' ')[0]}`,
            urgency: mode.probability >= 60 ? 'ELEVATED' : 'MODERATE',
        });
    }

    // Market risk warnings
    for (const risk of synthesis.marketRisks.slice(0, 2)) {
        warnings.push({
            id: `warn-${Date.now()}-mr-${warnings.length}`,
            signal: `${risk.category} deterioration`,
            description: risk.description.slice(0, 100),
            threshold: risk.evidence[0] || 'Significant change in market conditions',
            monitoringMethod: 'Monthly market analysis and competitor tracking',
            urgency: risk.level,
        });
    }

    // Universal warnings
    warnings.push({
        id: `warn-${Date.now()}-runway`,
        signal: 'Runway dropping below 6 months',
        description: 'Cash runway insufficient for next fundraise or pivot',
        threshold: 'Less than 6 months of operating capital',
        monitoringMethod: 'Weekly cash flow monitoring',
        urgency: 'CRITICAL',
    });

    warnings.push({
        id: `warn-${Date.now()}-retention`,
        signal: 'Retention rate decline',
        description: 'User/customer retention dropping below industry benchmarks',
        threshold: 'Month-over-month retention drops below 80%',
        monitoringMethod: 'Cohort analysis dashboard',
        urgency: 'ELEVATED',
    });

    return warnings.slice(0, 8);
}
