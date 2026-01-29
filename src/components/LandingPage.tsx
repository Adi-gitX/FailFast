'use client';

import { motion } from 'framer-motion';
import {
    ArrowRight,
    Skull,
    Brain,
    TrendingDown,
    Shield,
    Zap,
    CheckCircle,
    Star,
    ChevronDown
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Logo } from './Logo';

const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export function LandingPage() {
    const { setIsLoggedIn } = useAppStore();

    const features = [
        {
            icon: Skull,
            title: 'Failure Intelligence',
            description: 'Learn from 5,000+ startup autopsies. See exactly why similar ideas failed.',
            color: 'text-rose-400'
        },
        {
            icon: Brain,
            title: 'AI Premortem Analysis',
            description: 'Multi-stage pipeline identifies risks before you waste money.',
            color: 'text-violet-400'
        },
        {
            icon: TrendingDown,
            title: 'Risk Scoring',
            description: 'Quantified failure probability with actionable improvement levers.',
            color: 'text-amber-400'
        },
        {
            icon: Shield,
            title: 'Early Warnings',
            description: 'Know the signals to watch for. Pivot before it\'s too late.',
            color: 'text-emerald-400'
        }
    ];

    const testimonials = [
        { name: 'Sarah Chen', role: 'Founder, TechVenture', text: 'Saved us from a $500K mistake. The premortem showed pattern matches to 3 failed startups.' },
        { name: 'Marcus Johnson', role: 'VC Partner', text: 'We use this to vet deals. It catches red flags our analysts miss.' },
        { name: 'Priya Sharma', role: 'Serial Entrepreneur', text: 'Finally, data-driven validation. Not just vibes and optimism.' }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-violet-900/20 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-rose-900/15 blur-[120px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-indigo-900/10 blur-[200px] rounded-full" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Logo className="w-8 h-8 text-white" />
                        <span className="text-xl font-semibold tracking-tight">Premortem</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsLoggedIn(true)}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Log in
                        </button>
                        <button
                            onClick={() => setIsLoggedIn(true)}
                            className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
                <motion.div
                    className="max-w-5xl mx-auto text-center"
                    initial="initial"
                    animate="animate"
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="mb-8">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400">
                            <Zap className="w-4 h-4 text-amber-400" />
                            AI-Powered Startup Validation
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={fadeInUp}
                        className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight mb-8 leading-[0.95]"
                    >
                        Know how your startup
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-violet-400 to-indigo-400">
                            will fail
                        </span>
                        <br />
                        before it does
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed"
                    >
                        Run a premortem on your idea. Our AI analyzes failure patterns from
                        thousands of dead startups to show you exactly what could go wrong.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => setIsLoggedIn(true)}
                            className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all flex items-center gap-3 shadow-2xl shadow-white/10 group"
                        >
                            Analyze Your Idea
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-3">
                            Watch Demo
                        </button>
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        className="mt-16 flex items-center justify-center gap-8 text-sm text-gray-500"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            5,000+ startup autopsies
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            Real-time market data
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            AI-powered analysis
                        </div>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <ChevronDown className="w-6 h-6 text-gray-500" />
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif mb-6">
                            Failure is a pattern.
                            <br />
                            <span className="text-gray-500">Now you can see it coming.</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="relative py-32 px-6 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif mb-6">How it works</h2>
                        <p className="text-xl text-gray-500">Four stages. Total clarity.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Describe', desc: 'Enter your startup idea in plain language' },
                            { step: '02', title: 'Decompose', desc: 'AI breaks down value prop, market, assumptions' },
                            { step: '03', title: 'Analyze', desc: 'Pattern match against 5,000+ failed startups' },
                            { step: '04', title: 'Report', desc: 'Get risk score, warnings, and improvement levers' },
                        ].map((item, i) => (
                            <motion.div
                                key={item.step}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                            >
                                <div className="text-6xl font-serif text-gray-800 mb-4">{item.step}</div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-500 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="relative py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center justify-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                            ))}
                        </div>
                        <p className="text-gray-400">Trusted by 10,000+ founders and investors</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={t.name}
                                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <p className="text-gray-300 mb-6 leading-relaxed">"{t.text}"</p>
                                <div>
                                    <div className="font-medium">{t.name}</div>
                                    <div className="text-sm text-gray-500">{t.role}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="relative py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-medium mb-6">
                            <Zap className="w-3 h-3" />
                            Limited Launch Offer
                        </span>
                        <h2 className="text-5xl md:text-6xl font-serif mb-4">$1 for one year</h2>
                        <p className="text-gray-500">Then $99/year. Cancel anytime.</p>
                    </motion.div>

                    <motion.div
                        className="p-8 rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 max-w-lg mx-auto"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <ul className="space-y-4 mb-8">
                            {[
                                'Unlimited premortem analyses',
                                'Access to failure database',
                                'Real-time market intelligence',
                                'Competitor monitoring',
                                'Export reports (PDF/Markdown)',
                                'Priority support'
                            ].map(item => (
                                <li key={item} className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => setIsLoggedIn(true)}
                            className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
                        >
                            Start for $1
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <p className="text-center text-xs text-gray-600 mt-4">
                            7-day money-back guarantee. No questions asked.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                        <Logo className="w-8 h-8 text-white" />
                        <span className="font-semibold">Premortem</span>
                    </div>

                    <div className="flex items-center gap-8 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>

                    <p className="text-sm text-gray-600">© 2026 Premortem. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
