'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import {
    Home,
    MessageSquare,
    Skull,
    Lightbulb,
    Users,
    ChevronLeft,
    ChevronRight,
    Sparkles,
} from 'lucide-react';

const navItems = [
    { id: 'home', label: 'New Analysis', icon: Home },
    { id: 'graveyard', label: 'Graveyard', icon: Skull },
    { id: 'ideas', label: 'Public Ideas', icon: Lightbulb },
    { id: 'collaborate', label: 'Workspaces', icon: Users },
] as const;

export function Sidebar() {
    const { activeTab, setActiveTab } = useAppStore();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <motion.aside
            className={`h-screen flex flex-col border-r border-white/5 bg-[#0a0a0a] sticky top-0 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}
            initial={false}
            animate={{ width: isCollapsed ? 64 : 256 }}
        >
            {/* Header */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-white/5">
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                    >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                            <Skull className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-white tracking-tight">Premortem</span>
                    </motion.div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-2 space-y-1">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id || (item.id === 'home' && activeTab === 'chat');
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as typeof activeTab)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${isActive
                                    ? 'text-white bg-white/10'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {item.label}
                                </motion.span>
                            )}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 rounded-xl bg-white/10 -z-10"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            {!isCollapsed && (
                <div className="p-4 border-t border-white/5">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-600/10 border border-violet-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-violet-400" />
                            <span className="text-sm font-medium text-white">Pro Plan</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">
                            Unlimited analyses & team features
                        </p>
                        <button className="w-full py-2 px-3 rounded-lg bg-violet-500 text-white text-xs font-medium hover:bg-violet-400 transition-colors">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            )}
        </motion.aside>
    );
}
