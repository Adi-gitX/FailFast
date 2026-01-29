/**
 * Premortem Type Definitions
 * Core types for the failure-intelligence platform
 */

// ==========================================
// Citation & Source Types
// ==========================================

export interface Citation {
    id: string;
    source: string;
    url?: string;
    title: string;
    snippet: string;
    retrievedAt: Date;
    relevanceScore?: number;
}

// ==========================================
// Risk Analysis Types
// ==========================================

export type RiskLevel = 'CRITICAL' | 'ELEVATED' | 'MODERATE' | 'LOW';

export interface Risk {
    id: string;
    category: string;
    title: string;
    description: string;
    level: RiskLevel;
    evidence: string[];
    citations: string[]; // Citation IDs
    historicalPrevalence?: number; // 0-100, how common this pattern is
}

export interface FailureMode {
    id: string;
    name: string;
    description: string;
    probability: number; // Historical probability, 0-100
    timeframe: string; // e.g., "6-12 months"
    triggers: string[];
    mitigations: string[];
    citations: string[];
}

export interface Challenge {
    id: string;
    type: 'regulatory' | 'distribution' | 'technical' | 'market' | 'operational';
    title: string;
    description: string;
    severity: RiskLevel;
    citations: string[];
}

// ==========================================
// Comparable Startups
// ==========================================

export interface Comparable {
    id: string;
    name: string;
    description: string;
    outcome: 'failed' | 'pivoted' | 'survived' | 'acquired' | 'ipo';
    yearFounded?: number;
    yearOutcome?: number;
    fundingRaised?: string;
    moneyBurned?: string;
    failureReason?: string;
    lessonsLearned: string[];
    similarities: string[];
    differences: string[];
    source?: string;
    url?: string;
}

// ==========================================
// Actionable Insights
// ==========================================

export interface Lever {
    id: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'high' | 'medium' | 'low';
    category: 'product' | 'market' | 'business_model' | 'team' | 'timing';
    steps: string[];
}

export interface Warning {
    id: string;
    signal: string;
    description: string;
    threshold: string; // When to be concerned
    monitoringMethod: string;
    urgency: RiskLevel;
}

// ==========================================
// Risk Score (Non-Deterministic)
// ==========================================

export interface RiskScore {
    overall: RiskLevel;
    confidence: number; // 0-100, how confident in the assessment
    breakdown: {
        market: RiskLevel;
        timing: RiskLevel;
        regulatory: RiskLevel;
        competition: RiskLevel;
        execution: RiskLevel;
    };
    disclaimer: string; // Always include non-deterministic framing
}

// ==========================================
// Premortem Report
// ==========================================

export interface IdeaDecomposition {
    valueProposition: string;
    targetMarket: string;
    businessModel: string;
    keyAssumptions: string[];
    testableHypotheses: string[];
}

export interface PremortemReport {
    id: string;
    ideaId: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;

    // Original Input
    originalIdea: string;

    // Stage 1: Decomposition
    decomposition: IdeaDecomposition;

    // Stage 2 & 3: Analysis Results
    failureModes: FailureMode[];
    marketRisks: Risk[];
    timingRisks: Risk[];
    regulatoryRisks: Risk[];
    distributionChallenges: Challenge[];

    // Comparables
    failedStartups: Comparable[];
    survivingStartups: Comparable[];

    // Actionables
    improvementLevers: Lever[];
    earlyWarnings: Warning[];

    // Scoring
    riskScore: RiskScore;

    // Sources
    citations: Citation[];

    // Status
    status: 'generating' | 'complete' | 'error';
    currentStage?: 'decomposition' | 'retrieval' | 'synthesis' | 'scoring';
    error?: string;
}

// ==========================================
// Idea Management
// ==========================================

export interface Idea {
    id: string;
    userId: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    versions: IdeaVersion[];
    latestReportId?: string;
    isPublished: boolean;
    collaborators: Collaborator[];
}

export interface IdeaVersion {
    id: string;
    ideaId: string;
    version: number;
    description: string;
    createdAt: Date;
    reportId?: string;
    notes?: string;
}

// ==========================================
// Collaboration
// ==========================================

export type CollaborationRole =
    | 'cto' | 'cmo' | 'coo' | 'cfo'
    | 'design' | 'sales' | 'advisor' | 'investor';

export interface Collaborator {
    id: string;
    userId: string;
    displayName: string;
    role: CollaborationRole;
    status: 'pending' | 'accepted' | 'declined';
    requestedAt: Date;
    respondedAt?: Date;
    message?: string;
}

export interface Workspace {
    id: string;
    ideaId: string;
    name: string;
    createdAt: Date;
    ownerId: string;
    members: WorkspaceMember[];
    reportId: string; // Linked premortem report
    tasks: WorkspaceTask[];
}

export interface WorkspaceMember {
    userId: string;
    displayName: string;
    role: CollaborationRole;
    joinedAt: Date;
}

export interface WorkspaceTask {
    id: string;
    title: string;
    description: string;
    assigneeId?: string;
    status: 'todo' | 'in_progress' | 'done';
    relatedWarningId?: string; // Link to early warning signal
    createdAt: Date;
    dueDate?: Date;
}

// ==========================================
// User & Subscription
// ==========================================

export type SubscriptionTier = 'FREE' | 'FOUNDER' | 'TEAM' | 'ACCELERATOR';

export interface User {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    subscriptionTier: SubscriptionTier;
    reportsThisMonth: number;
    createdAt: Date;
}

// ==========================================
// Pipeline Stage Types
// ==========================================

export interface PipelineProgress {
    currentStage: 'decomposition' | 'retrieval' | 'synthesis' | 'scoring';
    stageProgress: number; // 0-100
    stageMessage: string;
    completedStages: string[];
}

export interface PerplexityResponse {
    content: string;
    citations: Citation[];
    model: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
    };
}
