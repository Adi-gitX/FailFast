'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ThumbsUp, Sparkles, Briefcase, Zap, DollarSign, Search, ChevronRight } from 'lucide-react';
import { useAppStore, StartupIdea } from '@/lib/store';

// Sample curated startup ideas
const CURATED_IDEAS: StartupIdea[] = [
    {
        id: '1',
        name: 'AI Code Review Bot',
        description: 'An AI-powered tool that automatically reviews pull requests, identifies bugs, suggests improvements, and ensures code quality standards before human review.',
        tags: ['AI', 'Developer Tools', 'SaaS'],
        model: 'B2B SaaS',
        effort: 'Medium',
        monetization: 'Subscription',
        industry: 'Developer Tools',
        votes: 342,
        author: 'anonymous',
    },
    {
        id: '2',
        name: 'Local Service Marketplace',
        description: 'A hyperlocal platform connecting homeowners with vetted local service providers for home repairs, cleaning, and maintenance with real-time pricing.',
        tags: ['Marketplace', 'Local', 'Services'],
        model: 'Transaction Fee',
        effort: 'High',
        monetization: 'Commission',
        industry: 'Home Services',
        votes: 287,
        author: 'founder123',
    },
    {
        id: '3',
        name: 'Mental Health Check-in App',
        description: 'A daily mental wellness app that uses mood tracking, journaling prompts, and AI-based insights to help users maintain better mental health.',
        tags: ['Health', 'AI', 'Consumer'],
        model: 'Freemium',
        effort: 'Medium',
        monetization: 'Subscription + Ads',
        industry: 'Health & Wellness',
        votes: 456,
        author: 'healthtech_lover',
    },
    {
        id: '4',
        name: 'Carbon Footprint Tracker',
        description: 'An app that tracks personal carbon footprint by analyzing purchase history, travel, and lifestyle choices, with gamified challenges to reduce impact.',
        tags: ['Sustainability', 'Consumer', 'Gamification'],
        model: 'Freemium',
        effort: 'Medium',
        monetization: 'Premium + B2B',
        industry: 'Climate Tech',
        votes: 198,
        author: 'green_founder',
    },
    {
        id: '5',
        name: 'Freelancer Invoice Automation',
        description: 'Automated invoicing and payment collection for freelancers with smart reminders, multiple payment options, and expense tracking.',
        tags: ['Fintech', 'Freelance', 'Automation'],
        model: 'SaaS',
        effort: 'Low',
        monetization: 'Subscription',
        industry: 'Fintech',
        votes: 321,
        author: 'solo_dev',
    },
    {
        id: '6',
        name: 'AI Interview Prep Coach',
        description: 'AI-powered interview preparation tool that conducts mock interviews, provides real-time feedback, and customizes practice based on target companies.',
        tags: ['AI', 'Career', 'Education'],
        model: 'B2C SaaS',
        effort: 'Medium',
        monetization: 'Subscription',
        industry: 'Career Tech',
        votes: 512,
        author: 'career_guru',
    },
];

export function IdeasView() {
    const [ideas] = useState<StartupIdea[]>(CURATED_IDEAS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
    const { setActiveTab } = useAppStore();

    const industries = [...new Set(ideas.map((i) => i.industry))];

    const filteredIdeas = ideas
        .filter((idea) => {
            const matchesSearch =
                !searchQuery ||
                idea.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                idea.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesIndustry = !selectedIndustry || idea.industry === selectedIndustry;
            return matchesSearch && matchesIndustry;
        })
        .sort((a, b) => b.votes - a.votes);

    const handleAnalyze = (idea: StartupIdea) => {
        setActiveTab('chat');
        // Ideally pass the idea to chat context here
    };

    return (
        <div className="h-full flex flex-col pt-8 pb-12">
            {/* Header Content */}
            <div className="mb-12 space-y-6">
                <div>
                    <span className="text-green-400 font-mono text-xs uppercase tracking-wider mb-2 block">Curated Concept Database</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Startup Ideas</h1>
                    <p className="text-gray-400 max-w-2xl text-lg font-light">
                        Vetted opportunities ready for execution. Pick one and analyze it to see failure risks.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search ideas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-none">
                        <button
                            onClick={() => setSelectedIndustry(null)}
                            className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${!selectedIndustry
                                ? 'bg-white text-black'
                                : 'bg-white/5 text-gray-400 hover:text-white'
                                }`}
                        >
                            All Industries
                        </button>
                        {industries.map((industry) => (
                            <button
                                key={industry}
                                onClick={() => setSelectedIndustry(industry)}
                                className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${selectedIndustry === industry
                                    ? 'bg-white text-black'
                                    : 'bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                {industry}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIdeas.map((idea, index) => (
                    <IdeaCard
                        key={idea.id}
                        idea={idea}
                        index={index}
                        onAnalyze={() => {
                            setActiveTab('chat');
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

interface IdeaCardProps {
    idea: StartupIdea;
    index: number;
    onAnalyze: () => void;
}

function IdeaCard({ idea, index, onAnalyze }: IdeaCardProps) {
    const [votes, setVotes] = useState(idea.votes);
    const [hasVoted, setHasVoted] = useState(false);

    const handleVote = () => {
        if (!hasVoted) {
            setVotes((v) => v + 1);
            setHasVoted(true);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative flex flex-col glass-card hover:bg-black/40 rounded-2xl p-6 transition-all duration-300"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-300 uppercase tracking-wide">
                            {idea.model}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">• {idea.industry}</span>
                    </div>
                    <h3 className="text-xl font-serif text-white group-hover:text-purple-200 transition-colors">
                        {idea.name}
                    </h3>
                </div>

                <button
                    onClick={handleVote}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${hasVoted ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono">{votes}</span>
                </button>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                {idea.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                    <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>{idea.effort}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{idea.monetization}</span>
                    </div>
                </div>

                <button
                    onClick={onAnalyze}
                    className="flex items-center gap-2 text-xs font-semibold text-white hover:text-purple-300 transition-colors"
                >
                    ANALYZE <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        </motion.div>
    );
}
