'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    TrendingUp,
    Clock,
    Scale,
    Truck,
    Skull,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    ExternalLink,
    Target,
    Lightbulb,
    Bell,
    FileText,
    Share2
} from 'lucide-react';
import {
    PremortemReport,
    RiskLevel,
    FailureMode,
    Risk,
    Challenge,
    Comparable,
    Lever,
    Warning,
    Citation
} from '@/lib/types';
import { riskLevels } from '@/lib/design-tokens';

interface ReportViewProps {
    report: PremortemReport;
    onExport?: () => void;
    onShare?: () => void;
}

export function ReportView({ report, onExport, onShare }: ReportViewProps) {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
        new Set(['decomposition', 'riskScore', 'failureModes'])
    );

    const toggleSection = (sectionId: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
        } else {
            newExpanded.add(sectionId);
        }
        setExpandedSections(newExpanded);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Report Header */}
            <header className="mb-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-2">
                            Premortem Analysis
                        </h1>
                        <p className="text-[var(--muted-foreground)] text-sm">
                            Version {report.version} • Generated {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {onExport && (
                            <button onClick={onExport} className="btn-secondary flex items-center gap-2">
                                <FileText size={16} />
                                Export
                            </button>
                        )}
                        {onShare && (
                            <button onClick={onShare} className="btn-secondary flex items-center gap-2">
                                <Share2 size={16} />
                                Share
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Original Idea */}
            <div className="card p-6 mb-6">
                <h2 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
                    Analyzed Idea
                </h2>
                <p className="text-[var(--foreground)] leading-relaxed">
                    {report.originalIdea}
                </p>
            </div>

            {/* Overall Risk Score */}
            <RiskScoreCard riskScore={report.riskScore} />

            {/* Sections */}
            <div className="space-y-4 mt-6">
                {/* Idea Decomposition */}
                <CollapsibleSection
                    id="decomposition"
                    title="Idea Breakdown"
                    icon={<Target size={20} />}
                    isExpanded={expandedSections.has('decomposition')}
                    onToggle={() => toggleSection('decomposition')}
                >
                    <DecompositionSection decomposition={report.decomposition} />
                </CollapsibleSection>

                {/* Failure Modes */}
                <CollapsibleSection
                    id="failureModes"
                    title="Failure Patterns"
                    icon={<AlertTriangle size={20} />}
                    badge={report.failureModes.length}
                    isExpanded={expandedSections.has('failureModes')}
                    onToggle={() => toggleSection('failureModes')}
                >
                    <FailureModesSection modes={report.failureModes} />
                </CollapsibleSection>

                {/* Market Risks */}
                <CollapsibleSection
                    id="marketRisks"
                    title="Market Risks"
                    icon={<TrendingUp size={20} />}
                    badge={report.marketRisks.length}
                    isExpanded={expandedSections.has('marketRisks')}
                    onToggle={() => toggleSection('marketRisks')}
                >
                    <RisksSection risks={report.marketRisks} />
                </CollapsibleSection>

                {/* Timing Risks */}
                {report.timingRisks.length > 0 && (
                    <CollapsibleSection
                        id="timingRisks"
                        title="Timing Risks"
                        icon={<Clock size={20} />}
                        badge={report.timingRisks.length}
                        isExpanded={expandedSections.has('timingRisks')}
                        onToggle={() => toggleSection('timingRisks')}
                    >
                        <RisksSection risks={report.timingRisks} />
                    </CollapsibleSection>
                )}

                {/* Regulatory Risks */}
                {report.regulatoryRisks.length > 0 && (
                    <CollapsibleSection
                        id="regulatoryRisks"
                        title="Regulatory Considerations"
                        icon={<Scale size={20} />}
                        badge={report.regulatoryRisks.length}
                        isExpanded={expandedSections.has('regulatoryRisks')}
                        onToggle={() => toggleSection('regulatoryRisks')}
                    >
                        <RisksSection risks={report.regulatoryRisks} />
                    </CollapsibleSection>
                )}

                {/* Distribution Challenges */}
                {report.distributionChallenges.length > 0 && (
                    <CollapsibleSection
                        id="distribution"
                        title="Distribution Challenges"
                        icon={<Truck size={20} />}
                        badge={report.distributionChallenges.length}
                        isExpanded={expandedSections.has('distribution')}
                        onToggle={() => toggleSection('distribution')}
                    >
                        <ChallengesSection challenges={report.distributionChallenges} />
                    </CollapsibleSection>
                )}

                {/* Comparables */}
                <CollapsibleSection
                    id="comparables"
                    title="Comparable Startups"
                    icon={<Skull size={20} />}
                    badge={report.failedStartups.length + report.survivingStartups.length}
                    isExpanded={expandedSections.has('comparables')}
                    onToggle={() => toggleSection('comparables')}
                >
                    <ComparablesSection
                        failed={report.failedStartups}
                        surviving={report.survivingStartups}
                    />
                </CollapsibleSection>

                {/* Improvement Levers */}
                <CollapsibleSection
                    id="levers"
                    title="Improvement Levers"
                    icon={<Lightbulb size={20} />}
                    badge={report.improvementLevers.length}
                    isExpanded={expandedSections.has('levers')}
                    onToggle={() => toggleSection('levers')}
                >
                    <LeversSection levers={report.improvementLevers} />
                </CollapsibleSection>

                {/* Early Warnings */}
                <CollapsibleSection
                    id="warnings"
                    title="Early Warning Signals"
                    icon={<Bell size={20} />}
                    badge={report.earlyWarnings.length}
                    isExpanded={expandedSections.has('warnings')}
                    onToggle={() => toggleSection('warnings')}
                >
                    <WarningsSection warnings={report.earlyWarnings} />
                </CollapsibleSection>

                {/* Citations */}
                {report.citations.length > 0 && (
                    <CollapsibleSection
                        id="citations"
                        title="Sources & Citations"
                        icon={<ExternalLink size={20} />}
                        badge={report.citations.length}
                        isExpanded={expandedSections.has('citations')}
                        onToggle={() => toggleSection('citations')}
                    >
                        <CitationsSection citations={report.citations} />
                    </CollapsibleSection>
                )}
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-4 rounded-lg bg-[var(--secondary)] border border-[var(--border)]">
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    <strong>Disclaimer:</strong> {report.riskScore.disclaimer}
                </p>
            </div>
        </div>
    );
}

// Risk Score Card Component
function RiskScoreCard({ riskScore }: { riskScore: PremortemReport['riskScore'] }) {
    const overallConfig = riskLevels[riskScore.overall];

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-[var(--foreground)]">Risk Assessment</h2>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">
                        {riskScore.confidence}% confidence based on available evidence
                    </p>
                </div>
                <div
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                        backgroundColor: overallConfig.bgColor,
                        color: overallConfig.color
                    }}
                >
                    {overallConfig.label}
                </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
                {Object.entries(riskScore.breakdown).map(([key, level]) => (
                    <div key={key} className="text-center">
                        <div className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                            {key}
                        </div>
                        <RiskBadge level={level} size="sm" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Reusable Risk Badge
function RiskBadge({ level, size = 'md' }: { level: RiskLevel; size?: 'sm' | 'md' }) {
    const config = riskLevels[level];
    const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';

    return (
        <span
            className={`inline-flex items-center rounded-full font-medium ${sizeClasses}`}
            style={{ backgroundColor: config.bgColor, color: config.color }}
        >
            {level.toLowerCase()}
        </span>
    );
}

// Collapsible Section
function CollapsibleSection({
    id,
    title,
    icon,
    badge,
    isExpanded,
    onToggle,
    children
}: {
    id: string;
    title: string;
    icon: React.ReactNode;
    badge?: number;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="card overflow-hidden">
            <button
                onClick={onToggle}
                className="collapse-header"
                aria-expanded={isExpanded}
                aria-controls={`section-${id}`}
            >
                <div className="flex items-center gap-3">
                    <span className="text-[var(--muted-foreground)]">{icon}</span>
                    <span className="font-medium text-[var(--foreground)]">{title}</span>
                    {badge !== undefined && badge > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                            {badge}
                        </span>
                    )}
                </div>
                {isExpanded ? (
                    <ChevronDown size={20} className="text-[var(--muted-foreground)]" />
                ) : (
                    <ChevronRight size={20} className="text-[var(--muted-foreground)]" />
                )}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        id={`section-${id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-6 pt-0 border-t border-[var(--border)]">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Section Components
function DecompositionSection({ decomposition }: { decomposition: PremortemReport['decomposition'] }) {
    return (
        <div className="space-y-4 mt-4">
            <div>
                <h4 className="text-label mb-2">Value Proposition</h4>
                <p className="text-body">{decomposition.valueProposition}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h4 className="text-label mb-2">Target Market</h4>
                    <p className="text-body">{decomposition.targetMarket}</p>
                </div>
                <div>
                    <h4 className="text-label mb-2">Business Model</h4>
                    <p className="text-body">{decomposition.businessModel}</p>
                </div>
            </div>
            <div>
                <h4 className="text-label mb-2">Key Assumptions</h4>
                <ul className="space-y-2">
                    {decomposition.keyAssumptions.map((assumption, i) => (
                        <li key={i} className="flex items-start gap-2 text-body">
                            <span className="text-[var(--muted-foreground)]">•</span>
                            {assumption}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h4 className="text-label mb-2">Testable Hypotheses</h4>
                <ul className="space-y-2">
                    {decomposition.testableHypotheses.map((hypothesis, i) => (
                        <li key={i} className="flex items-start gap-2 text-body">
                            <CheckCircle size={14} className="text-[var(--risk-low)] mt-1 flex-shrink-0" />
                            {hypothesis}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function FailureModesSection({ modes }: { modes: FailureMode[] }) {
    return (
        <div className="space-y-4 mt-4">
            {modes.map((mode, i) => (
                <div key={mode.id} className="stagger-item p-4 rounded-lg border border-[var(--border)]">
                    <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-[var(--foreground)]">{mode.name}</h4>
                        <span className="text-sm font-medium text-[var(--risk-elevated)]">
                            {mode.probability}% historical prevalence
                        </span>
                    </div>
                    <p className="text-body text-[var(--muted-foreground)] mb-3">{mode.description}</p>
                    <div className="flex items-center gap-4 text-caption">
                        <span>Timeframe: {mode.timeframe}</span>
                    </div>
                    {mode.mitigations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[var(--border)]">
                            <p className="text-caption text-[var(--muted-foreground)] mb-2">Mitigations:</p>
                            <ul className="space-y-1">
                                {mode.mitigations.slice(0, 3).map((m, j) => (
                                    <li key={j} className="text-caption text-[var(--risk-low)]">• {m}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function RisksSection({ risks }: { risks: Risk[] }) {
    return (
        <div className="space-y-3 mt-4">
            {risks.map((risk) => (
                <div key={risk.id} className="stagger-item list-item">
                    <RiskBadge level={risk.level} size="sm" />
                    <div className="flex-1">
                        <h4 className="font-medium text-[var(--foreground)] mb-1">{risk.title}</h4>
                        <p className="text-caption text-[var(--muted-foreground)]">{risk.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ChallengesSection({ challenges }: { challenges: Challenge[] }) {
    return (
        <div className="space-y-3 mt-4">
            {challenges.map((challenge) => (
                <div key={challenge.id} className="stagger-item list-item">
                    <RiskBadge level={challenge.severity} size="sm" />
                    <div className="flex-1">
                        <h4 className="font-medium text-[var(--foreground)] mb-1">{challenge.title}</h4>
                        <p className="text-caption text-[var(--muted-foreground)]">{challenge.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ComparablesSection({ failed, surviving }: { failed: Comparable[]; surviving: Comparable[] }) {
    return (
        <div className="space-y-6 mt-4">
            {failed.length > 0 && (
                <div>
                    <h4 className="text-label mb-3 flex items-center gap-2">
                        <Skull size={14} className="text-[var(--risk-critical)]" />
                        Failed Startups
                    </h4>
                    <div className="grid gap-3">
                        {failed.map((startup) => (
                            <div key={startup.id} className="comparable-card comparable-failed">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{startup.name}</span>
                                    {startup.moneyBurned && (
                                        <span className="text-caption text-[var(--risk-critical)]">
                                            {startup.moneyBurned} burned
                                        </span>
                                    )}
                                </div>
                                <p className="text-caption text-[var(--muted-foreground)]">{startup.description}</p>
                                {startup.failureReason && (
                                    <p className="text-caption">
                                        <strong>Why:</strong> {startup.failureReason}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {surviving.length > 0 && (
                <div>
                    <h4 className="text-label mb-3 flex items-center gap-2">
                        <CheckCircle size={14} className="text-[var(--risk-low)]" />
                        Surviving / Acquired
                    </h4>
                    <div className="grid gap-3">
                        {surviving.map((startup) => (
                            <div key={startup.id} className="comparable-card comparable-survived">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{startup.name}</span>
                                    {startup.fundingRaised && (
                                        <span className="text-caption text-[var(--risk-low)]">
                                            {startup.fundingRaised} raised
                                        </span>
                                    )}
                                </div>
                                <p className="text-caption text-[var(--muted-foreground)]">{startup.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function LeversSection({ levers }: { levers: Lever[] }) {
    return (
        <div className="space-y-3 mt-4">
            {levers.map((lever) => (
                <div
                    key={lever.id}
                    className={`stagger-item action-item action-item-${lever.impact}`}
                >
                    <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-[var(--foreground)]">{lever.title}</h4>
                        <div className="flex items-center gap-2 text-caption">
                            <span className="text-[var(--muted-foreground)]">Impact: {lever.impact}</span>
                            <span className="text-[var(--muted)]">•</span>
                            <span className="text-[var(--muted-foreground)]">Effort: {lever.effort}</span>
                        </div>
                    </div>
                    <p className="text-body text-[var(--muted-foreground)] mb-3">{lever.description}</p>
                    {lever.steps.length > 0 && (
                        <ul className="space-y-1">
                            {lever.steps.slice(0, 4).map((step, i) => (
                                <li key={i} className="text-caption flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[var(--muted)] flex items-center justify-center text-[10px]">
                                        {i + 1}
                                    </span>
                                    {step}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}

function WarningsSection({ warnings }: { warnings: Warning[] }) {
    return (
        <div className="space-y-3 mt-4">
            {warnings.map((warning) => (
                <div key={warning.id} className="stagger-item list-item">
                    <RiskBadge level={warning.urgency} size="sm" />
                    <div className="flex-1">
                        <h4 className="font-medium text-[var(--foreground)] mb-1">{warning.signal}</h4>
                        <p className="text-caption text-[var(--muted-foreground)] mb-2">{warning.description}</p>
                        <div className="text-caption">
                            <span className="text-[var(--muted-foreground)]">Threshold: </span>
                            <span>{warning.threshold}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function CitationsSection({ citations }: { citations: Citation[] }) {
    return (
        <div className="space-y-2 mt-4">
            {citations.map((citation, i) => (
                <div key={citation.id} className="stagger-item flex items-start gap-3 py-2">
                    <span className="citation-badge">{i + 1}</span>
                    <div>
                        {citation.url ? (
                            <a
                                href={citation.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[var(--accent-foreground)] hover:underline flex items-center gap-1"
                            >
                                {citation.title}
                                <ExternalLink size={12} />
                            </a>
                        ) : (
                            <span className="text-sm">{citation.title}</span>
                        )}
                        <p className="text-caption text-[var(--muted-foreground)]">{citation.source}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ReportView;
