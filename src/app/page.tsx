'use client';

import { Navbar } from '@/components/Navbar';
import { ChatView, GraveyardView, IdeasView, CollaborateView } from '@/components';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

function HeroView() {
  const { setActiveTab } = useAppStore();
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4 pt-20">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[50%] -translate-x-[50%] w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] left-[20%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-5xl mx-auto space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-200 mb-4 backdrop-blur-md">
          <span>Introducing FailFast v2.0</span>
          <ArrowRight className="w-3 h-3" />
        </div>

        <h1 className="text-7xl md:text-8xl lg:text-9xl font-serif tracking-tight leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50 drop-shadow-2xl">
          Validate your startup,<br />before you build.
        </h1>

        <p className="max-w-xl mx-auto text-lg text-gray-400 font-light leading-relaxed">
          The brutally honest AI co-founder. Analyze your idea against 1,000+ failed startups and get a reality check in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button
            onClick={() => setActiveTab('chat')}
            className="group relative px-8 py-4 bg-white text-black rounded-lg font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            GET STARTED
            <ArrowRight className="w-4 h-4 inline-block ml-2 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => setActiveTab('graveyard')}
            className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-lg font-semibold text-sm hover:bg-white/10 transition-all backdrop-blur-md"
          >
            VIEW GRAVEYARD
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const { activeTab } = useAppStore();

  return (
    <main className="min-h-screen relative text-foreground overflow-x-hidden">
      <Navbar />

      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10"
          >
            <HeroView />
          </motion.div>
        )}

        {activeTab === 'ideas' && (
          <motion.div
            key="ideas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-24 px-4 md:px-12 max-w-7xl mx-auto"
          >
            <IdeasView />
          </motion.div>
        )}

        {activeTab === 'graveyard' && (
          <motion.div
            key="graveyard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-24 px-4 md:px-12 max-w-7xl mx-auto"
          >
            <GraveyardView />
          </motion.div>
        )}

        {activeTab === 'collaborate' && (
          <motion.div
            key="collaborate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-24 px-4 md:px-12 max-w-7xl mx-auto"
          >
            <CollaborateView />
          </motion.div>
        )}

        {activeTab === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="pt-20 h-screen overflow-hidden"
          >
            <ChatView />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
