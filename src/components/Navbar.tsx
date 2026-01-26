'use client';

import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';

export function Navbar() {
    const { activeTab, setActiveTab } = useAppStore();

    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'ideas', label: 'Ideas' },
        { id: 'graveyard', label: 'Graveyard' },
        { id: 'collaborate', label: 'Collaborate' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-transparent backdrop-blur-[2px]">
            {/* Brand */}
            <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setActiveTab('home')}
            >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                    <span className="font-serif font-bold text-white">F</span>
                </div>
                <span className="font-serif text-xl font-medium tracking-tight text-white">FailFast</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`text-sm font-medium transition-all hover:text-white ${activeTab === item.id ? 'text-white' : 'text-gray-400'
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 transition-all"
                >
                    <Github className="w-4 h-4" />
                    <span>3.2k</span>
                </a>
                <button className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                    LOGIN
                </button>
            </div>
        </nav>
    );
}
