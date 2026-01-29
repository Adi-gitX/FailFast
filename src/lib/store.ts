import { create } from 'zustand';
import { FailedStartup } from './supabase';

export interface StartupIdea {
    id: string;
    name: string;
    description: string;
    tags: string[];
    model: string;
    effort: string;
    monetization: string;
    industry: string;
    votes: number;
    author?: string;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    analysis?: AnalysisResult;
}

export interface AnalysisResult {
    successRate: number;
    failureRate: number;
    timeToFailure: string;
    similarFailures: FailedStartup[];
    sections: {
        reality: string;
        uniqueness: string;
        success: string;
        pivots: string;
        probability: string;
    };
}

interface AppState {
    // Navigation
    activeTab: 'home' | 'chat' | 'graveyard' | 'ideas' | 'collaborate';
    setActiveTab: (tab: 'home' | 'chat' | 'graveyard' | 'ideas' | 'collaborate') => void;

    // Chat
    messages: Message[];
    isAnalyzing: boolean;
    addMessage: (message: Message) => void;
    setIsAnalyzing: (value: boolean) => void;
    clearMessages: () => void;

    // Failed Startups
    failedStartups: FailedStartup[];
    setFailedStartups: (startups: FailedStartup[]) => void;
    failedStartupsLoading: boolean;
    setFailedStartupsLoading: (value: boolean) => void;

    // Startup Ideas
    startupIdeas: StartupIdea[];
    setStartupIdeas: (ideas: StartupIdea[]) => void;

    // Auth
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;

    // Search & Filter
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
    sortBy: 'default' | 'burned' | 'recent';
    setSortBy: (sort: 'default' | 'burned' | 'recent') => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Navigation
    activeTab: 'home',
    setActiveTab: (tab) => set({ activeTab: tab }),

    // Chat
    messages: [],
    isAnalyzing: false,
    addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
    setIsAnalyzing: (value) => set({ isAnalyzing: value }),
    clearMessages: () => set({ messages: [] }),

    // Failed Startups
    failedStartups: [],
    setFailedStartups: (startups) => set({ failedStartups: startups }),
    failedStartupsLoading: false,
    setFailedStartupsLoading: (value) => set({ failedStartupsLoading: value }),

    // Startup Ideas
    startupIdeas: [],
    setStartupIdeas: (ideas) => set({ startupIdeas: ideas }),

    // Auth
    // Auth
    isLoggedIn: false,
    setIsLoggedIn: (value) => set({ isLoggedIn: value }),

    // Search & Filter
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    selectedCategory: null,
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    sortBy: 'default',
    setSortBy: (sort) => set({ sortBy: sort }),
}));
