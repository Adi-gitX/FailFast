/**
 * Premortem Design System Tokens
 * Dark theme - Modern, professional, credible
 */

export const colors = {
    // Primary palette - Dark theme
    background: {
        primary: '#0a0a0a',      // Main background
        secondary: '#111111',    // Cards
        tertiary: '#161616',     // Elevated surfaces
        inverse: '#FAFAFA',      // Light sections
    },

    // Text colors - High readability on dark
    text: {
        primary: '#FAFAFA',      // Primary text - white
        secondary: '#A1A1A1',    // Secondary text
        tertiary: '#666666',     // Muted text
        inverse: '#111111',      // Dark text on light
        link: '#818CF8',         // Links - Indigo
    },

    // Risk indicators - Vivid on dark
    risk: {
        critical: '#F43F5E',     // Rose - critical patterns
        elevated: '#F97316',     // Orange - elevated concern
        moderate: '#EAB308',     // Amber - moderate signals
        low: '#22C55E',          // Green - positive signals
    },

    // Accent - Violet/Indigo palette
    accent: {
        primary: '#8B5CF6',      // Violet
        secondary: '#6366F1',    // Indigo
        subtle: 'rgba(139, 92, 246, 0.1)', // Violet subtle
    },

    // Borders - Subtle on dark
    border: {
        default: 'rgba(255, 255, 255, 0.06)',
        subtle: 'rgba(255, 255, 255, 0.03)',
        emphasis: 'rgba(255, 255, 255, 0.12)',
    },
} as const;

export const typography = {
    // Font families
    fontFamily: {
        sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        serif: '"EB Garamond", "Times New Roman", serif',
        mono: '"JetBrains Mono", "Fira Code", monospace',
    },

    // Font sizes - Optimized for reading
    fontSize: {
        xs: '0.75rem',     // 12px
        sm: '0.8125rem',   // 13px
        base: '0.875rem',  // 14px
        md: '1rem',        // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
    },

    // Line heights
    lineHeight: {
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '1.75',
    },

    // Font weights
    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
} as const;

export const spacing = {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
} as const;

export const shadows = {
    none: 'none',
    xs: '0 1px 2px rgba(0, 0, 0, 0.3)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
    glow: '0 0 20px rgba(139, 92, 246, 0.3)',
    focus: '0 0 0 3px rgba(139, 92, 246, 0.25)',
} as const;

export const radii = {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
} as const;

export const transitions = {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// Risk level definitions (non-deterministic framing) - Dark theme
export const riskLevels = {
    CRITICAL: {
        label: 'Critical Historical Pattern',
        description: 'Strong historical correlation with failure',
        color: colors.risk.critical,
        bgColor: 'rgba(244, 63, 94, 0.12)',
    },
    ELEVATED: {
        label: 'Elevated Risk Pattern',
        description: 'Moderate historical concern signals',
        color: colors.risk.elevated,
        bgColor: 'rgba(249, 115, 22, 0.12)',
    },
    MODERATE: {
        label: 'Moderate Risk Pattern',
        description: 'Some historical indicators present',
        color: colors.risk.moderate,
        bgColor: 'rgba(234, 179, 8, 0.12)',
    },
    LOW: {
        label: 'Lower Risk Pattern',
        description: 'Fewer historical warning signals',
        color: colors.risk.low,
        bgColor: 'rgba(34, 197, 94, 0.12)',
    },
} as const;

// Collaboration roles
export const collaborationRoles = [
    { id: 'cto', label: 'CTO / Tech Lead', icon: 'Code' },
    { id: 'cmo', label: 'CMO / Marketing', icon: 'Megaphone' },
    { id: 'coo', label: 'COO / Operations', icon: 'Settings' },
    { id: 'cfo', label: 'CFO / Finance', icon: 'DollarSign' },
    { id: 'design', label: 'Design Lead', icon: 'Palette' },
    { id: 'sales', label: 'Sales Lead', icon: 'UserPlus' },
    { id: 'advisor', label: 'Advisor', icon: 'Lightbulb' },
    { id: 'investor', label: 'Investor', icon: 'TrendingUp' },
] as const;

// Subscription tiers
export const subscriptionTiers = {
    FREE: {
        name: 'Free',
        price: 0,
        reports: 3,
        features: ['Basic analysis', '3 reports/month', 'Community access'],
    },
    FOUNDER: {
        name: 'Founder',
        price: 29,
        reports: -1, // unlimited
        features: ['Unlimited reports', 'Full citations', 'PDF export', 'Version history'],
    },
    TEAM: {
        name: 'Team',
        price: 99,
        reports: -1,
        features: ['Everything in Founder', 'Team workspaces', 'Collaboration tools', 'API access'],
    },
    ACCELERATOR: {
        name: 'Accelerator',
        price: -1, // custom
        reports: -1,
        features: ['Everything in Team', 'Batch analysis', 'Investor views', 'White-label'],
    },
} as const;
