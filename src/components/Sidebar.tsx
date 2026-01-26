'use client';

import {
    MessageSquare,
    Skull,
    Lightbulb,
    Users,
    Sparkles,
    LayoutGrid
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';

const navItems = [
    { id: 'home', label: 'Home', icon: LayoutGrid },
    { id: 'chat', label: 'Analyze', icon: MessageSquare },
    { id: 'graveyard', label: 'Failed', icon: Skull },
    { id: 'ideas', label: 'Ideas', icon: Lightbulb },
    { id: 'collaborate', label: 'Collaborate', icon: Users },
] as const;

export function Sidebar() {
    const { activeTab, setActiveTab } = useAppStore();

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 h-20 z-50 flex items-center justify-between px-8 bg-transparent backdrop-blur-sm border-b border-transparent"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Logo */}
            <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setActiveTab('home')}
            >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-serif text-xl text-white tracking-tight">FailFast</span>
            </div>

            {/* Centered Navigation */}
            <div className="hidden md:flex items-center gap-8">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as typeof activeTab)}
                            className={`relative text-sm font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {item.label}
                            {isActive && (
                                <motion.div
                                    class="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
                                    layoutId="navIndicator"
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button className="px-4 py-2 text-xs font-semibold text-white/90 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all backdrop-blur-md">
                    LOGIN
                </button>
            </div>
        </motion.nav>
    );
}
