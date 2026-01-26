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

            // Extract probabilities from analysis text
            const successMatch = data.analysis.match(/success\s*likelihood[:\s]*(\d+)/i);
            const failureMatch = data.analysis.match(/failure\s*risk[:\s]*(\d+)/i);

            const successRate = successMatch ? parseInt(successMatch[1]) : 12;
            const failureRate = failureMatch ? parseInt(failureMatch[1]) : 88;

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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl space-y-8 text-center"
            >
                {/* Virtual Assistant Badge */}
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 backdrop-blur-md">
                        <Sparkles className="w-3 h-3 text-[var(--accent)]" />
                        <span>Virtual Assistant</span>
                        <span className="px-1.5 py-0.5 rounded bg-[var(--accent)] text-black text-[10px] font-bold">BETA</span>
                    </div>
                </div>

                {/* Main Headline */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-tight drop-shadow-lg">
                    Outline the problem<br />
                    <span className="text-white/50">and its impact.</span>
                </h1>

                {/* Input Box Container */}
                <div className="glass-card p-2 md:p-3 mt-12 max-w-2xl mx-auto shadow-2xl shadow-black/20">
                    <form onSubmit={handleSubmit} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Describe your startup concept..."
                            className="w-full bg-transparent border-none text-lg text-white placeholder:text-gray-500 py-4 px-6 focus:ring-0 focus:outline-none"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="absolute right-2 p-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowUp className="w-5 h-5" />
                        </button>
                    </form>
                </div>

                {/* Grid of features/prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16 max-w-4xl mx-auto text-left">
                    <div className="glass-card p-6 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onExampleClick("Analyze the failure risk of a subscription-based coffee delivery service.")}>
                        <Zap className="w-6 h-6 text-yellow-400 mb-4" />
                        <h3 className="text-lg font-serif text-white mb-2">Failure Analysis</h3>
                        <p className="text-sm text-gray-400">Get a brutal reality check on your startup idea based on 1000+ failed case studies.</p>
                    </div>
                    <div className="glass-card p-6 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onExampleClick("Find a technical co-founder for a fintech app.")}>
                        <Users className="w-6 h-6 text-blue-400 mb-4" />
                        <h3 className="text-lg font-serif text-white mb-2">Co-founder Match</h3>
                        <p className="text-sm text-gray-400">Identify the perfect partner skills needed to build your specific concept.</p>
                    </div>
                    <div className="glass-card p-6 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onExampleClick("Generate a pivot strategy for a struggling edtech platform.")}>
                        <RefreshCw className="w-6 h-6 text-green-400 mb-4" />
                        <h3 className="text-lg font-serif text-white mb-2">Pivot Strategy</h3>
                        <p className="text-sm text-gray-400">Stuck? Let AI analyze market signals and suggest viable pivots.</p>
                    </div>
                    <div className="glass-card p-6 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onExampleClick("What are the similar failed startups in the pet tech space?")}>
                        <Search className="w-6 h-6 text-purple-400 mb-4" />
                        <h3 className="text-lg font-serif text-white mb-2">Competitor Autopsy</h3>
                        <p className="text-sm text-gray-400">Learn exactly why others in your space died so you don't have to.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
