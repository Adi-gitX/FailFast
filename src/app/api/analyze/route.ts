import { NextRequest, NextResponse } from 'next/server';
import { runPipeline, generateQuickPreview } from '@/lib/pipeline';
import { PremortemReport } from '@/lib/types';

/**
 * Premortem Analysis API
 * Runs the multi-stage analysis pipeline on a startup idea
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { idea, quickPreview = false } = body;

        if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
            return NextResponse.json(
                { error: 'Idea is required and must be a non-empty string' },
                { status: 400 }
            );
        }

        const ideaText = idea.trim();

        // Quick preview mode - just decompose the idea
        if (quickPreview) {
            const decomposition = await generateQuickPreview(ideaText);
            return NextResponse.json({ decomposition });
        }

        // Full analysis pipeline
        const report: PremortemReport = await runPipeline(ideaText);

        // Format response
        const response = {
            success: report.status === 'complete',
            report: {
                id: report.id,
                version: report.version,
                createdAt: report.createdAt,

                // Idea breakdown
                originalIdea: report.originalIdea,
                decomposition: report.decomposition,

                // Risk assessment
                riskScore: report.riskScore,

                // Failure analysis
                failureModes: report.failureModes,
                marketRisks: report.marketRisks,
                timingRisks: report.timingRisks,
                regulatoryRisks: report.regulatoryRisks,
                distributionChallenges: report.distributionChallenges,

                // Comparables
                failedStartups: report.failedStartups,
                survivingStartups: report.survivingStartups,

                // Actionables
                improvementLevers: report.improvementLevers,
                earlyWarnings: report.earlyWarnings,

                // Sources
                citations: report.citations,
            },
            error: report.error,
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Analysis pipeline error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Analysis failed',
                report: null,
            },
            { status: 500 }
        );
    }
}

/**
 * Health check endpoint
 */
export async function GET() {
    return NextResponse.json({
        service: 'Premortem Analysis API',
        status: 'healthy',
        version: '2.0.0',
        endpoints: {
            POST: {
                description: 'Run premortem analysis on a startup idea',
                body: {
                    idea: 'string (required) - The startup idea to analyze',
                    quickPreview: 'boolean (optional) - Return only idea decomposition',
                },
            },
        },
    });
}
