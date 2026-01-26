'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Skull, DollarSign, Calendar, X, SlidersHorizontal } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { StartupCard, StartupCardSkeleton } from './StartupCard';
import { getFailedStartups, getCategories, calculateTotalBurned, formatMoney } from '@/lib/supabase';

export function GraveyardView() {
    const {
        failedStartups,
        setFailedStartups,
        failedStartupsLoading,
        setFailedStartupsLoading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
    } = useAppStore();

    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const loadStartups = async () => {
            if (failedStartups.length === 0) {
                setFailedStartupsLoading(true);
                const startups = await getFailedStartups(500);
                setFailedStartups(startups);
                setFailedStartupsLoading(false);
            }
        };
        loadStartups();
    }, [failedStartups.length, setFailedStartups, setFailedStartupsLoading]);

    const filteredStartups = failedStartups
        .filter((startup) => {
            const matchesSearch =
                !searchQuery ||
                startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                startup.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory =
                !selectedCategory ||
                startup.category === selectedCategory ||
                startup.sector === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'burned') {
                return (b.money_burned_raw || 0) - (a.money_burned_raw || 0);
            }
            if (sortBy === 'recent') {
                return (b.year_died || 0) - (a.year_died || 0);
            }
            return 0;
        });

    const categories = getCategories(failedStartups);
    const totalBurned = calculateTotalBurned(failedStartups);

    return (
        <div className="h-full flex flex-col pt-8 pb-12">
            {/* Header */}
            <div className="mb-12 space-y-6">
                <div>
                    <span className="text-red-400 font-mono text-xs uppercase tracking-wider mb-2 block">Post-Mortem Database</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Startup Graveyard</h1>
                    <p className="text-gray-400 max-w-2xl text-lg font-light">
                        Where billions went to die. Analyze <span className="text-white font-medium">{failedStartups.length}</span> failed companies to avoid their mistakes.
                    </p>
                </div>

                {/* Stats Banner */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-y border-white/5">
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Burned</div>
                        <div className="text-2xl font-serif text-white">{formatMoney(totalBurned)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Startups Tracked</div>
                        <div className="text-2xl font-serif text-white">{failedStartups.length}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Most Common</div>
                        <div className="text-xl font-serif text-white">No Market Need</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Avg Lifespan</div>
                        <div className="text-xl font-serif text-white">2.4 Years</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name, description, or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 glass-card rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 transition-all"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${showFilters
                            ? 'bg-white text-black'
                            : 'bg-white/5 text-gray-400 hover:text-white border border-white/5 hover:border-white/20'
                            }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="text-sm font-medium">Filters</span>
                    </button>

                    <div className="flex glass-card rounded-xl p-1">
                        <button
                            onClick={() => setSortBy('burned')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'burned' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Most Burned
                        </button>
                        <button
                            onClick={() => setSortBy('recent')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'recent' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Most Recent
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="py-4 flex gap-2 overflow-x-auto scrollbar-none">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${!selectedCategory ? 'bg-white text-black' : 'bg-white/5 text-gray-400 border border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    All Categories
                                </button>
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === category ? 'bg-white text-black' : 'bg-white/5 text-gray-400 border border-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Grid */}
            {failedStartupsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <StartupCardSkeleton key={n} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {filteredStartups.slice(0, 50).map((startup) => (
                        <StartupCard key={startup.id} startup={startup} />
                    ))}

                    {filteredStartups.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <Skull className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-white mb-2">No deceased startups found</h3>
                            <p className="text-gray-500">Try adjusting your autopsy criteria.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
