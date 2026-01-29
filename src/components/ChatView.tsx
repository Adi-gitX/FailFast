'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, ArrowUp, Users, Search, RefreshCw } from 'lucide-react';
import { useAppStore, Message } from '@/lib/store';
import { ChatInput } from './ChatInput';
import { ChatMessage, TypingIndicator } from './ChatMessage';
import { getFailedStartups } from '@/lib/supabase';

export function ChatView() {
    const {
        messages,
        addMessage,
        isAnalyzing,
        setIsAnalyzing,
        failedStartups,
        setFailedStartups,
        setFailedStartupsLoading
    } = useAppStore();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);

    // Load failed startups on mount
    useEffect(() => {
        const loadStartups = async () => {
            setFailedStartupsLoading(true);
            const startups = await getFailedStartups(500);
            setFailedStartups(startups);
            setFailedStartupsLoading(false);
        };
        if (failedStartups.length === 0) {
            loadStartups();
        }
    }, [failedStartups.length, setFailedStartups, setFailedStartupsLoading]);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isAnalyzing]);

    const handleSubmit = async (content: string) => {
        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date(),
        };
        addMessage(userMessage);
        setIsAnalyzing(true);

        try {
            // Find relevant failed startups based on keywords
            const keywords = content.toLowerCase().split(' ');
            const relevantStartups = failedStartups
                .filter(s => {
                    const desc = s.description.toLowerCase();
                    const cat = s.category?.toLowerCase() || '';
                    return keywords.some(kw =>
                        kw.length > 3 && (desc.includes(kw) || cat.includes(kw))
                    );
                })
                .slice(0, 20);

            // Call the analysis API
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idea: content,
                    failedStartups: relevantStartups.length > 0
                        ? relevantStartups.map(s => ({
                            name: s.name,
                            description: s.description,
                            category: s.category,
                            money_burned: s.money_burned,
                        }))
                        : failedStartups.slice(0, 30).map(s => ({
                            name: s.name,
                            description: s.description,
                            category: s.category,
                            money_burned: s.money_burned,
                        })),
                }),
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();

            // Extract probabilities from analysis text or risk score
            const successMatch = data.analysis?.match(/success\\s*likelihood[:\\s]*(\\d+)/i) ||
                data.report?.riskScore?.confidence;
            const failureMatch = data.analysis?.match(/failure\\s*risk[:\\s]*(\\d+)/i);

            // Calculate from report risk level if available
            let successRate = successMatch ? (typeof successMatch === 'number' ? successMatch : parseInt(successMatch[1])) : 50;
            let failureRate = failureMatch ? parseInt(failureMatch[1]) : 100 - successRate;

            // Add assistant message
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.analysis,
                timestamp: new Date(),
                analysis: {
                    successRate,
                    failureRate,
                    timeToFailure: "8-12 Months",
                    similarFailures: relevantStartups.slice(0, 3),
                    sections: {
                        reality: '',
                        uniqueness: '',
                        success: '',
                        pivots: '',
                        probability: ''
                    }
                },
            };
            addMessage(assistantMessage);
        } catch (error) {
            console.error('Analysis error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I encountered an error analyzing your idea. Please try again.",
                timestamp: new Date(),
            };
            addMessage(errorMessage);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const copyLastAnalysis = () => {
        const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
        if (lastAssistant) {
            navigator.clipboard.writeText(lastAssistant.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="h-full flex flex-col pt-4 relative">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[80px]" />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 pb-48 scrollbar-none">
                {messages.length === 0 ? (
                    <EmptyState onExampleClick={handleSubmit} />
                ) : (
                    <div className="space-y-8 max-w-4xl mx-auto">
                        <AnimatePresence mode="popLayout">
                            {messages.map((message) => (
                                <ChatMessage key={message.id} message={message} />
                            ))}
                        </AnimatePresence>
                        {isAnalyzing && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            {messages.length > 0 && (
                <ChatInput onSubmit={handleSubmit} disabled={isAnalyzing} />
            )}
        </div>
    );
}

function EmptyState({ onExampleClick }: { onExampleClick: (text: string) => void }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onExampleClick(input);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-3xl space-y-8"
            >
                {/* Hero Input Section */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400">
                        <Sparkles className="w-3 h-3 text-[var(--accent)]" />
                        <span>AI Analyst Ready</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
                        What are we validating?
                    </h1>
                </div>

                {/* Main Command Input */}
                <div className="glass-card p-1 shadow-2xl shadow-black/50 relative overflow-hidden group border-white/10 focus-within:border-white/20 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                    <form onSubmit={handleSubmit} className="relative flex items-center bg-[#0a0a0a] rounded-xl overflow-hidden">
                        <div className="pl-4">
                            <Zap className="w-5 h-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Describe your startup idea (e.g. 'Uber for dog walking')..."
                            className="w-full bg-transparent border-none text-lg text-white placeholder:text-gray-600 py-6 px-4 focus:ring-0 focus:outline-none font-light"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="mr-2 p-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowUp className="w-5 h-5" />
                        </button>
                    </form>
                </div>

                {/* Quick Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-8">
                    <button
                        onClick={() => onExampleClick("Analyze the failure risk of a subscription-based coffee delivery service.")}
                        className="text-left p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-black/10 transition-all group"
                    >
                        <div className="flex items-center gap-2 text-xs text-black mb-1 font-medium">
                            <Zap className="w-3 h-3 text-orange-500" />
                            <span>Risk Analysis</span>
                        </div>
                        <div className="text-sm text-gray-600">"Rate the failure probability of..."</div>
                    </button>

                    <button
                        onClick={() => onExampleClick("Find a technical co-founder for a fintech app.")}
                        className="text-left p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-black/10 transition-all group"
                    >
                        <div className="flex items-center gap-2 text-xs text-black mb-1 font-medium">
                            <Users className="w-3 h-3 text-blue-500" />
                            <span>Co-founder Match</span>
                        </div>
                        <div className="text-sm text-gray-600">"Find a CTO for fintech..."</div>
                    </button>

                    <button
                        onClick={() => onExampleClick("Generate a pivot strategy for a struggling edtech platform.")}
                        className="text-left p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-black/10 transition-all group"
                    >
                        <div className="flex items-center gap-2 text-xs text-black mb-1 font-medium">
                            <RefreshCw className="w-3 h-3 text-green-500" />
                            <span>Pivot Strategy</span>
                        </div>
                        <div className="text-sm text-gray-600">"Suggest pivots for edtech..."</div>
                    </button>

                    <button
                        onClick={() => onExampleClick("What are the similar failed startups in the pet tech space?")}
                        className="text-left p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-black/10 transition-all group"
                    >
                        <div className="flex items-center gap-2 text-xs text-black mb-1 font-medium">
                            <Search className="w-3 h-3 text-purple-500" />
                            <span>Competitor Autopsy</span>
                        </div>
                        <div className="text-sm text-gray-600">"List failed pet startups..."</div>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
