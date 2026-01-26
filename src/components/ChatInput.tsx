'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Command, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';

interface ChatInputProps {
    onSubmit: (message: string) => void;
    disabled?: boolean;
}

const placeholders = [
    "Describe your startup idea...",
    "What problem are you solving?",
    "Who is your target audience?",
    "What's your monetization strategy?",
];

export function ChatInput({ onSubmit, disabled = false }: ChatInputProps) {
    const [input, setInput] = useState('');
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { isAnalyzing } = useAppStore();

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleSubmit = () => {
        if (!input.trim() || disabled || isAnalyzing) return;
        onSubmit(input.trim());
        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex justify-center w-full px-4 mb-6">
            <motion.div
                className={`w-full max-w-3xl relative rounded-2xl transition-all duration-300 ${isFocused
                    ? 'bg-white/10 border-white/20'
                    : 'bg-white/5 border-white/10'
                    } backdrop-blur-md border`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-end gap-3 p-3">
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder={placeholders[placeholderIndex]}
                            disabled={disabled || isAnalyzing}
                            className="w-full bg-transparent text-white placeholder:text-gray-500 resize-none focus:outline-none text-base font-light leading-relaxed min-h-[44px] max-h-[200px] py-2 px-2"
                            rows={1}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!input.trim() || disabled || isAnalyzing}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${input.trim() && !isAnalyzing
                            ? 'bg-white text-black hover:scale-105 active:scale-95'
                            : 'bg-transparent text-white/20 cursor-not-allowed'
                            }`}
                    >
                        {isAnalyzing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Helper Text */}
                <div className="px-4 pb-3 flex items-center justify-between text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                        <Command className="w-3 h-3" /> + Enter to send
                    </span>
                    <span>Markdown Supported</span>
                </div>
            </motion.div>
        </div>
    );
}
