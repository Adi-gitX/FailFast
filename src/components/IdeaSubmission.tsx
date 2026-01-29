'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain, TrendingUp, AlertTriangle, Send, Sparkles } from 'lucide-react';
import { PipelineProgress } from '@/lib/types';

interface IdeaSubmissionProps {
    onSubmit: (idea: string) => void;
    isAnalyzing?: boolean;
    progress?: PipelineProgress;
}

const exampleIdeas = [
    {
        icon: Zap,
        title: 'AI Code Review',
        description: 'AI-powered code review for pull requests',
    },
    {
        icon: Brain,
        title: 'Personal CRM',
        description: 'AI assistant that remembers your contacts',
    },
    {
        icon: TrendingUp,
        title: 'Micro-SaaS',
        description: 'Niche B2B tool for specific workflow',
    },
];

const pipelineStages = [
    { id: 'decomposition', label: 'Decompose', icon: Brain },
    { id: 'retrieval', label: 'Research', icon: TrendingUp },
    { id: 'synthesis', label: 'Synthesize', icon: Sparkles },
    { id: 'scoring', label: 'Score', icon: AlertTriangle },
];

export function IdeaSubmission({ onSubmit, isAnalyzing, progress }: IdeaSubmissionProps) {
    const [idea, setIdea] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (idea.trim() && !isAnalyzing) {
            onSubmit(idea.trim());
        }
    };

    const currentStageIndex = progress
        ? pipelineStages.findIndex(s => s.id === progress.currentStage)
        : -1;

    return (
        <div className="min-h-full flex items-center justify-center p-8">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                className="w-full max-w-3xl relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
                        Know how your startup will fail
                        <span className="text-violet-400">.</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Describe your idea and our AI will analyze historical failure patterns, market risks, and competition.
                    </p>
                </div>

                {/* Form */}
                <motion.form onSubmit={handleSubmit} className="mb-12">
                    <div className="glass-card p-1 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-transparent to-indigo-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <div className="relative flex items-start gap-3 p-4">
                            <textarea
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                placeholder="Describe your startup idea in detail..."
                                className="flex-1 bg-transparent text-white placeholder:text-gray-500 resize-none focus:outline-none text-lg min-h-[120px]"
                                disabled={isAnalyzing}
                            />
                            <button
                                type="submit"
                                disabled={!idea.trim() || isAnalyzing}
                                className="p-3 rounded-xl bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.form>

                {/* Progress Indicator */}
                {isAnalyzing && progress && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <div className="flex items-center justify-between mb-4">
                            {pipelineStages.map((stage, idx) => {
                                const Icon = stage.icon;
                                const isComplete = idx < currentStageIndex;
                                const isCurrent = idx === currentStageIndex;

                                return (
                                    <div key={stage.id} className="flex flex-col items-center gap-2">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isComplete
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : isCurrent
                                                        ? 'bg-violet-500/20 text-violet-400 animate-pulse'
                                                        : 'bg-white/5 text-gray-500'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`text-xs ${isCurrent ? 'text-white' : 'text-gray-500'}`}>
                                            {stage.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-center text-sm text-gray-400">{progress.stageMessage}</p>
                    </motion.div>
                )}

                {/* Example Ideas */}
                {!isAnalyzing && (
                    <div>
                        <p className="text-sm text-gray-500 mb-4 text-center">Try an example</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {exampleIdeas.map((example) => {
                                const Icon = example.icon;
                                return (
                                    <button
                                        key={example.title}
                                        onClick={() => setIdea(example.description)}
                                        className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all text-left"
                                    >
                                        <Icon className="w-5 h-5 text-violet-400 mb-2" />
                                        <h3 className="text-white font-medium text-sm mb-1">{example.title}</h3>
                                        <p className="text-gray-500 text-xs">{example.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
