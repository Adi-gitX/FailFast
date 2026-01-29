'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Star, Disc } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Logo } from './Logo';

export function LoginView() {
    const { setIsLoggedIn } = useAppStore();

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#ffffff] text-black relative overflow-hidden font-sans">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Aurora Gradients */}
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-900/10 blur-[120px] rounded-full animate-pulse-glow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-900/10 blur-[100px] rounded-full" />

                {/* Stars */}
                <div className="absolute inset-0 opacity-20 bg-[url('/background.png')] bg-repeat opacity-30 mix-blend-overlay" />
            </div>

            {/* Left Panel - The Offer */}
            <div className="flex-1 flex flex-col justify-center items-center lg:items-start p-8 lg:p-24 relative z-10 border-r border-gray-100">
                <div className="absolute top-8 left-8 lg:top-12 lg:left-12">
                    <Logo className="w-10 h-10 text-black" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-md space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium uppercase tracking-wider">
                        <Star className="w-3 h-3 fill-current" />
                        Limited Time Offer
                    </div>

                    <div>
                        <h1 className="text-8xl lg:text-9xl font-serif tracking-tighter text-black mb-2 relative">
                            $1
                        </h1>
                        <h2 className="text-4xl lg:text-5xl font-serif text-gray-800 tracking-tight">
                            for one year
                        </h2>
                        <p className="text-gray-500 text-sm mt-2 font-mono">
                            Renews at $99/year. Cancel anytime.
                        </p>
                    </div>

                    <p className="text-xl text-gray-600 font-light leading-relaxed">
                        Take control of your entire startup journey. Validate ideas, analyze risks, and find co-founders with AI.
                    </p>

                    <div className="space-y-4 pt-8">
                        <button
                            onClick={() => setIsLoggedIn(true)}
                            className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-black/10"
                        >
                            <Disc className="w-5 h-5" />
                            Continue with Google
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                        <div className="relative text-center">
                            <span className="bg-[#ffffff] px-2 text-xs text-gray-400 relative z-10">Or sign up with email</span>
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                        </div>
                        <input
                            type="email"
                            placeholder="E-mail"
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-black placeholder:text-gray-400 focus:outline-none focus:border-black/10 transition-all"
                        />
                    </div>

                    <p className="text-[10px] text-center lg:text-left text-gray-600 leading-relaxed max-w-sm">
                        By creating an account, you agree to our Investment Advisory Agreement, Terms of Service and Privacy Policy. You also acknowledge that you have reviewed our Form ADV Brochure.
                    </p>
                </motion.div>
            </div>

            {/* Right Panel - The Visual */}
            <div className="flex-1 hidden lg:flex flex-col justify-center items-center p-12 bg-gray-50 relative overflow-hidden">
                {/* Aurora Background for Right Panel */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-black opacity-50" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="relative z-10 text-center space-y-8"
                >
                    <h2 className="text-5xl font-serif text-black tracking-tight leading-tight">
                        Validate ideas,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-800">
                            predict the future.
                        </span>
                    </h2>

                    {/* Floating Glass Card (Mockup) */}
                    <div className="w-[400px] h-[250px] mx-auto glass-card p-6 flex flex-col justify-between relative group hover:scale-105 transition-transform duration-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Success Probability</div>
                                <div className="text-3xl font-serif text-white">84%</div>
                                <div className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                    AI Verified
                                </div>
                            </div>
                            <div className="p-2 rounded-full bg-white/5">
                                <Star className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        {/* Simulated Graph */}
                        <div className="w-full h-12 flex items-end gap-1 opacity-50">
                            {[40, 65, 50, 80, 55, 90, 70, 85, 60, 95].map((h, i) => (
                                <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-white/20 rounded-t-sm" />
                            ))}
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono border-t border-white/5 pt-4">
                            <span>VALIDATION SCORE</span>
                            <span>HIGH POTENTIAL</span>
                        </div>
                    </div>

                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                        ))}
                        <span className="text-xs text-gray-500 ml-2">TRUSTED BY 100K+ FOUNDERS</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
