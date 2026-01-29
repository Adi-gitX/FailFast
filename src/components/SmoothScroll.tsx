'use client';

import { useEffect, useRef, ReactNode, createContext, useContext } from 'react';
import Lenis from 'lenis';

interface SmoothScrollContextType {
    lenis: Lenis | null;
    scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
    lenis: null,
    scrollTo: () => { },
});

interface SmoothScrollProps {
    children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProps) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis on the document root
        lenisRef.current = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
            infinite: false,
        });

        // Add lenis class to html for CSS compatibility
        document.documentElement.classList.add('lenis', 'lenis-smooth');

        // RAF loop for smooth scroll
        function raf(time: number) {
            lenisRef.current?.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Expose lenis to window for debugging
        if (typeof window !== 'undefined') {
            (window as Window & { lenis?: Lenis }).lenis = lenisRef.current;
        }

        return () => {
            lenisRef.current?.destroy();
            document.documentElement.classList.remove('lenis', 'lenis-smooth');
        };
    }, []);

    const scrollTo = (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => {
        lenisRef.current?.scrollTo(target, {
            offset: options?.offset ?? 0,
            duration: options?.duration ?? 1.2,
        });
    };

    return (
        <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
            {children}
        </SmoothScrollContext.Provider>
    );
}

// Hook to access Lenis instance
export function useSmoothScroll() {
    return useContext(SmoothScrollContext);
}

// Simple scroll wrapper that doesn't use Lenis (for areas that need normal scroll)
export function NativeScroll({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={className} data-lenis-prevent>
            {children}
        </div>
    );
}
