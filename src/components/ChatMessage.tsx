'use client';

import { motion } from 'framer-motion';
import { User, Sparkles, TrendingDown, TrendingUp, AlertTriangle, BarChart3, ExternalLink } from 'lucide-react';
import type { Message } from '@/lib/store';

interface ChatMessageProps {
    message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            className={`flex gap-6 ${isUser ? 'flex-row-reverse' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${isUser
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white border-white/20'
                }`}>
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-3xl ${isUser ? 'text-right' : ''}`}>
                <div className={`inline-block text-left ${isUser
                    ? 'bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-white'
                    : ''
                    }`}>
                    {isUser ? (
                        <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    ) : (
                        <div className="space-y-6">
                            {/* Analysis Header Stats */}
                            {message.analysis && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                        <div className="flex items-center gap-2 mb-1">
                                            <TrendingDown className="w-4 h-4 text-red-400" />
                                            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Failure Risk</span>
                                        </div>
                                        <div className="text-2xl font-serif text-white">{message.analysis.failureRate}%</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                        <div className="flex items-center gap-2 mb-1">
                                            <TrendingUp className="w-4 h-4 text-green-400" />
                                            <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Success Chance</span>
                                        </div>
                                        <div className="text-2xl font-serif text-white">{message.analysis.successRate}%</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                                        <div className="flex items-center gap-2 mb-1">
                                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                            <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Est. Runway</span>
                                        </div>
                                        <div className="text-2xl font-serif text-white">{message.analysis.timeToFailure}</div>
                                    </div>
                                </div>
                            )}

                            {/* Markdown Content */}
                            <div className="text-gray-300 leading-relaxed font-light space-y-4">
                                <MessageContent content={message.content} />
                            </div>

                            {/* Similar Failures Panel */}
                            {message.analysis?.similarFailures && message.analysis.similarFailures.length > 0 && (
                                <div className="mt-8">
                                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4" />
                                        Relevant Failed Startups
                                    </h4>
                                    <div className="grid gap-3">
                                        {message.analysis.similarFailures.slice(0, 5).map((startup, idx) => (
                                            <div key={idx} className="group relative overflow-hidden p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="font-serif text-lg text-white group-hover:text-purple-300 transition-colors">{startup.name}</span>
                                                        <span className="text-xs text-gray-500 ml-2 border border-white/10 px-2 py-0.5 rounded-full">
                                                            {startup.category}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-mono text-red-400">{startup.money_burned}</span>
                                                </div>
                                                <p className="text-sm text-gray-400 line-clamp-2">
                                                    {startup.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function MessageContent({ content }: { content: string }) {
    const lines = content.replace(/\*\*/g, '').split('\n'); // Quick clean for simplicity, or handle bold properly
    // Note: Re-implementing a proper markdown parser would be ideal, but adapting the existing one
    // to match the Oryx style (Serif headers) is the goal here.

    // Using a simpler render approach for the "Oryx" editorial look
    return (
        <div className="space-y-4">
            {content.split('##').map((section, idx) => {
                if (!section.trim()) return null;
                const [title, ...body] = section.split('\n');

                // If it's the first part and doesn't start with ##, it might be intro text
                if (idx === 0 && !content.startsWith('##')) {
                    return <p key={idx} className="whitespace-pre-wrap">{section}</p>;
                }

                return (
                    <div key={idx} className="pt-4 first:pt-0">
                        {title && <h2 className="text-2xl font-serif text-white mb-3">{title.trim()}</h2>}
                        <div className="text-gray-300 space-y-2 whitespace-pre-wrap">
                            {body.join('\n').trim()}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export function TypingIndicator() {
    return (
        <motion.div
            className="flex gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="w-8 h-8 rounded-lg bg-transparent border border-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                />
                <span>Analyzing market data...</span>
            </div>
        </motion.div>
    );
}
