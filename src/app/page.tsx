'use client';

import { useState, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { GraveyardView, IdeasView, CollaborateView } from '@/components';
import { LandingPage } from '@/components/LandingPage';
import { IdeaSubmission } from '@/components/IdeaSubmission';
import { ReportView } from '@/components/ReportView';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, LogOut } from 'lucide-react';
import { PremortemReport, PipelineProgress } from '@/lib/types';
import { SmoothScrollProvider } from '@/components/SmoothScroll';

/**
 * Dashboard Component
 * Main application layout with sidebar and content area
 */
function Dashboard() {
  const { activeTab, setActiveTab, setIsLoggedIn } = useAppStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<PipelineProgress | undefined>();
  const [currentReport, setCurrentReport] = useState<PremortemReport | null>(null);

  // Handle idea submission
  const handleSubmitIdea = useCallback(async (idea: string) => {
    setIsAnalyzing(true);
    setProgress({
      currentStage: 'decomposition',
      stageProgress: 0,
      stageMessage: 'Analyzing idea structure...',
      completedStages: [],
    });

    try {
      // Simulate progress updates
      const stages: Array<{ stage: PipelineProgress['currentStage']; message: string }> = [
        { stage: 'decomposition', message: 'Analyzing idea structure...' },
        { stage: 'retrieval', message: 'Gathering market intelligence...' },
        { stage: 'synthesis', message: 'Synthesizing failure patterns...' },
        { stage: 'scoring', message: 'Calculating risk assessment...' },
      ];

      // Start progress simulation
      let stageIndex = 0;
      const progressInterval = setInterval(() => {
        if (stageIndex < stages.length) {
          setProgress({
            currentStage: stages[stageIndex].stage,
            stageProgress: 50,
            stageMessage: stages[stageIndex].message,
            completedStages: stages.slice(0, stageIndex).map(s => s.stage),
          });
          stageIndex++;
        }
      }, 2000);

      // Make API call
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();

      if (data.success && data.report) {
        // Convert dates
        data.report.createdAt = new Date(data.report.createdAt);
        data.report.updatedAt = new Date();
        setCurrentReport(data.report as PremortemReport);
        setActiveTab('chat'); // Switch to report view
      } else {
        console.error('Analysis error:', data.error);
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsAnalyzing(false);
      setProgress(undefined);
    }
  }, [setActiveTab]);

  // Handle export
  const handleExport = useCallback(() => {
    if (!currentReport) return;

    // Create markdown export
    const markdown = generateMarkdownExport(currentReport);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `premortem-${currentReport.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [currentReport]);

  // Render active view
  const renderContent = () => {
    // If we have a report and on chat tab, show the report
    if (activeTab === 'chat' && currentReport) {
      return (
        <motion.div
          key="report"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-8"
        >
          <ReportView
            report={currentReport}
            onExport={handleExport}
            onShare={() => console.log('Share clicked')}
          />
        </motion.div>
      );
    }

    switch (activeTab) {
      case 'home':
      case 'chat':
        return (
          <motion.div
            key="submission"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <IdeaSubmission
              onSubmit={handleSubmitIdea}
              isAnalyzing={isAnalyzing}
              progress={progress}
            />
          </motion.div>
        );
      case 'graveyard':
        return (
          <motion.div
            key="graveyard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8"
          >
            <GraveyardView />
          </motion.div>
        );
      case 'ideas':
        return (
          <motion.div
            key="ideas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8"
          >
            <IdeasView />
          </motion.div>
        );
      case 'collaborate':
        return (
          <motion.div
            key="collaborate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8"
          >
            <CollaborateView />
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Get breadcrumb label
  const getBreadcrumbLabel = () => {
    if (activeTab === 'chat' && currentReport) return 'Analysis Report';
    const labels: Record<string, string> = {
      home: 'New Analysis',
      chat: 'New Analysis',
      graveyard: 'Startup Graveyard',
      ideas: 'Public Ideas',
      collaborate: 'Workspaces',
    };
    return labels[activeTab] || activeTab;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 relative min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-14 px-6 flex items-center justify-between border-b border-white/5 sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500">Premortem</span>
            <span className="text-gray-700">/</span>
            <span className="text-white font-medium">
              {getBreadcrumbLabel()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 w-56 text-sm bg-white/5 border border-white/5 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-white/10 transition-colors"
              />
            </div>
            <button className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/**
 * Generate Markdown export of report
 */
function generateMarkdownExport(report: PremortemReport): string {
  let md = `# Premortem Analysis Report

**Version:** ${report.version}
**Generated:** ${new Date(report.createdAt).toLocaleString()}

---

## Original Idea

${report.originalIdea}

---

## Risk Assessment

**Overall:** ${report.riskScore.overall}
**Confidence:** ${report.riskScore.confidence}%

### Breakdown
`;

  Object.entries(report.riskScore.breakdown).forEach(([key, value]) => {
    md += `- **${key}:** ${value}\n`;
  });

  md += `\n---\n\n## Idea Decomposition\n\n`;
  md += `**Value Proposition:** ${report.decomposition.valueProposition}\n\n`;
  md += `**Target Market:** ${report.decomposition.targetMarket}\n\n`;
  md += `**Business Model:** ${report.decomposition.businessModel}\n\n`;

  md += `### Key Assumptions\n`;
  report.decomposition.keyAssumptions.forEach(a => {
    md += `- ${a}\n`;
  });

  md += `\n### Testable Hypotheses\n`;
  report.decomposition.testableHypotheses.forEach(h => {
    md += `- ${h}\n`;
  });

  md += `\n---\n\n## Failure Patterns\n\n`;
  report.failureModes.forEach(mode => {
    md += `### ${mode.name}\n`;
    md += `${mode.description}\n\n`;
    md += `- **Historical Prevalence:** ${mode.probability}%\n`;
    md += `- **Timeframe:** ${mode.timeframe}\n\n`;
  });

  md += `---\n\n## Improvement Levers\n\n`;
  report.improvementLevers.forEach(lever => {
    md += `### ${lever.title}\n`;
    md += `${lever.description}\n\n`;
    md += `- **Impact:** ${lever.impact}\n`;
    md += `- **Effort:** ${lever.effort}\n\n`;
  });

  md += `---\n\n## Early Warning Signals\n\n`;
  report.earlyWarnings.forEach(warning => {
    md += `- **${warning.signal}:** ${warning.description}\n`;
  });

  md += `\n---\n\n*${report.riskScore.disclaimer}*\n`;

  return md;
}

/**
 * Main Page Component
 */
export default function Home() {
  const { isLoggedIn } = useAppStore();

  return (
    <SmoothScrollProvider>
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <LandingPage />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Dashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </SmoothScrollProvider>
  );
}
