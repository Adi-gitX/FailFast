/**
 * Premortem Analysis Pipeline Orchestrator
 * Coordinates the 4-stage analysis process
 */

import { PremortemReport, PipelineProgress, IdeaDecomposition } from '../types';
import { decomposeIdea, decomposeIdeaWithLLM } from './decompose';
import { retrieveEvidence, RetrievalResult } from './retrieve';
import { synthesizePatterns, SynthesisResult } from './synthesize';
import { scoreRisks, ScoringResult } from './score';
import { queryPerplexity } from '../perplexity';

export type PipelineStage = 'decomposition' | 'retrieval' | 'synthesis' | 'scoring';

export interface PipelineCallback {
    onProgress: (progress: PipelineProgress) => void;
}

/**
 * Run the complete Premortem analysis pipeline
 */
export async function runPipeline(
    ideaText: string,
    callbacks?: PipelineCallback
): Promise<PremortemReport> {
    const reportId = `report-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const ideaId = `idea-${Date.now()}`;

    const report: Partial<PremortemReport> = {
        id: reportId,
        ideaId,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        originalIdea: ideaText,
        status: 'generating',
        citations: [],
    };

    try {
        // Stage 1: Decomposition
        updateProgress(callbacks, 'decomposition', 0, 'Analyzing idea structure...');

        let decomposition: IdeaDecomposition;
        try {
            // Try LLM-powered decomposition first
            decomposition = await decomposeIdeaWithLLM(
                ideaText,
                async (system, user) => queryPerplexity(system, user, { maxTokens: 1000 })
            );
        } catch {
            // Fallback to local analysis
            decomposition = await decomposeIdea(ideaText);
        }

        report.decomposition = decomposition;
        updateProgress(callbacks, 'decomposition', 100, 'Idea decomposition complete');

        // Stage 2: Evidence Retrieval
        updateProgress(callbacks, 'retrieval', 0, 'Gathering market intelligence...');

        const evidence: RetrievalResult = await retrieveEvidence(decomposition);
        report.citations = [...(report.citations || []), ...evidence.citations];

        updateProgress(callbacks, 'retrieval', 100, 'Evidence retrieval complete');

        // Stage 3: Synthesis
        updateProgress(callbacks, 'synthesis', 0, 'Synthesizing failure patterns...');

        const synthesis: SynthesisResult = await synthesizePatterns(decomposition, evidence);

        report.failureModes = synthesis.failureModes;
        report.marketRisks = synthesis.marketRisks;
        report.timingRisks = synthesis.timingRisks;
        report.regulatoryRisks = synthesis.regulatoryRisks;
        report.distributionChallenges = synthesis.distributionChallenges;
        report.failedStartups = synthesis.failedComparables;
        report.survivingStartups = synthesis.survivingComparables;
        report.citations = [...(report.citations || []), ...synthesis.citations];

        updateProgress(callbacks, 'synthesis', 100, 'Pattern synthesis complete');

        // Stage 4: Risk Scoring
        updateProgress(callbacks, 'scoring', 0, 'Calculating risk assessment...');

        const scoring: ScoringResult = scoreRisks(decomposition, synthesis);

        report.riskScore = scoring.riskScore;
        report.improvementLevers = scoring.improvementLevers;
        report.earlyWarnings = scoring.earlyWarnings;

        updateProgress(callbacks, 'scoring', 100, 'Risk assessment complete');

        // Finalize
        report.status = 'complete';
        report.updatedAt = new Date();

        // Deduplicate citations
        const seenCitations = new Set<string>();
        report.citations = (report.citations || []).filter(c => {
            const key = c.url || c.title;
            if (seenCitations.has(key)) return false;
            seenCitations.add(key);
            return true;
        });

        return report as PremortemReport;

    } catch (error) {
        report.status = 'error';
        report.error = error instanceof Error ? error.message : 'An unknown error occurred';
        report.updatedAt = new Date();

        // Return partial report with error
        return report as PremortemReport;
    }
}

/**
 * Update progress callback
 */
function updateProgress(
    callbacks: PipelineCallback | undefined,
    stage: PipelineStage,
    progress: number,
    message: string
): void {
    if (!callbacks?.onProgress) return;

    const stageOrder: PipelineStage[] = ['decomposition', 'retrieval', 'synthesis', 'scoring'];
    const currentIndex = stageOrder.indexOf(stage);
    const completedStages = stageOrder.slice(0, currentIndex);

    callbacks.onProgress({
        currentStage: stage,
        stageProgress: progress,
        stageMessage: message,
        completedStages,
    });
}

/**
 * Generate a quick preview (decomposition only)
 */
export async function generateQuickPreview(ideaText: string): Promise<IdeaDecomposition> {
    try {
        return await decomposeIdeaWithLLM(
            ideaText,
            async (system, user) => queryPerplexity(system, user, { maxTokens: 800 })
        );
    } catch {
        return await decomposeIdea(ideaText);
    }
}

/**
 * Re-run specific stages with updated inputs
 */
export async function rerunFromStage(
    existingReport: PremortemReport,
    fromStage: PipelineStage,
    callbacks?: PipelineCallback
): Promise<PremortemReport> {
    const report = { ...existingReport };
    report.version += 1;
    report.updatedAt = new Date();
    report.status = 'generating';

    try {
        const stageOrder: PipelineStage[] = ['decomposition', 'retrieval', 'synthesis', 'scoring'];
        const startIndex = stageOrder.indexOf(fromStage);

        if (startIndex <= 0) {
            // Re-run from beginning
            return runPipeline(report.originalIdea, callbacks);
        }

        // Re-run from specified stage
        if (startIndex <= 1 && report.decomposition) {
            updateProgress(callbacks, 'retrieval', 0, 'Re-gathering evidence...');
            const evidence = await retrieveEvidence(report.decomposition);
            report.citations = evidence.citations;

            updateProgress(callbacks, 'synthesis', 0, 'Re-synthesizing patterns...');
            const synthesis = await synthesizePatterns(report.decomposition, evidence);
            report.failureModes = synthesis.failureModes;
            report.marketRisks = synthesis.marketRisks;
            report.timingRisks = synthesis.timingRisks;
            report.regulatoryRisks = synthesis.regulatoryRisks;
            report.distributionChallenges = synthesis.distributionChallenges;
            report.failedStartups = synthesis.failedComparables;
            report.survivingStartups = synthesis.survivingComparables;

            updateProgress(callbacks, 'scoring', 0, 'Re-calculating risks...');
            const scoring = scoreRisks(report.decomposition, synthesis);
            report.riskScore = scoring.riskScore;
            report.improvementLevers = scoring.improvementLevers;
            report.earlyWarnings = scoring.earlyWarnings;
        }

        report.status = 'complete';
        return report;

    } catch (error) {
        report.status = 'error';
        report.error = error instanceof Error ? error.message : 'Re-run failed';
        return report;
    }
}

// Re-export pipeline components
export { decomposeIdea, decomposeIdeaWithLLM } from './decompose';
export { retrieveEvidence } from './retrieve';
export { synthesizePatterns } from './synthesize';
export { scoreRisks } from './score';
export type { RetrievalResult } from './retrieve';
export type { SynthesisResult } from './synthesize';
export type { ScoringResult } from './score';
