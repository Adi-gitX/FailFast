'use client';

import { motion } from 'framer-motion';
import { Skull, DollarSign, Calendar, ExternalLink, Activity } from 'lucide-react';
import type { FailedStartup } from '@/lib/supabase';

interface StartupCardProps {
    startup: FailedStartup;
    index?: number;
}

export function StartupCard({ startup, index = 0 }: StartupCardProps) {
    const getCategoryColor = (category: string) => {
        // Muted, sophisticated colors for borders/accents
        const colors: Record<string, string> = {
            'FINTECH': 'border-green-500/20 text-green-400',
            'HARDWARE': 'border-orange-500/20 text-orange-400',
            'E-COMMERCE': 'border-blue-500/20 text-blue-400',
            'ON-DEMAND': 'border-purple-500/20 text-purple-400',
            'SOCIAL': 'border-pink-500/20 text-pink-400',
            'MEDIA': 'border-yellow-500/20 text-yellow-400',
            'HEALTH': 'border-teal-500/20 text-teal-400',
            'CRYPTO': 'border-indigo-500/20 text-indigo-400',
        };
        return colors[category?.toUpperCase()] || 'border-gray-500/20 text-gray-400';
    };

    const colorClass = getCategoryColor(startup.category);

    return (
        <motion.div
            className="group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl p-6 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border bg-transparent ${colorClass} uppercase tracking-wide`}>
                            {startup.category}
                        </span>
                        <span className="text-xs text-gray-500">• {startup.city || 'Global'}</span>
                    </div>
                    <h3 className="text-xl font-serif text-white group-hover:text-purple-200 transition-colors">
                        {startup.name}
                    </h3>
                </div>
                {startup.year_died && (
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500 font-mono">DIED</span>
                        <span className="text-sm font-medium text-gray-300">{startup.year_died}</span>
                    </div>
                )}
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                {startup.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                    <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-red-300">{startup.money_burned}</span>
                    </div>
                </div>

                <motion.button
                    className="p-2 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                >
                    <ExternalLink className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );
}

// Skeleton loader for startup cards
export function StartupCardSkeleton() {
    return (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                    <div className="h-4 w-16 bg-white/10 rounded" />
                    <div className="h-6 w-32 bg-white/10 rounded" />
                </div>
                <div className="h-8 w-8 bg-white/10 rounded" />
            </div>
            <div className="space-y-2 mb-6">
                <div className="h-3 w-full bg-white/10 rounded" />
                <div className="h-3 w-full bg-white/10 rounded" />
                <div className="h-3 w-2/3 bg-white/10 rounded" />
            </div>
            <div className="flex justify-between pt-4 border-t border-white/5">
                <div className="h-4 w-20 bg-white/10 rounded" />
                <div className="h-4 w-4 bg-white/10 rounded" />
            </div>
        </div>
    );
}
