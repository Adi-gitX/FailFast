import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, Code, Sparkles, MessageSquare, Linkedin, Github, Twitter, X } from 'lucide-react';

interface CofounderProfile {
    id: string;
    name: string;
    role: string;
    location: string;
    skills: string[];
    lookingFor: string[];
    bio: string;
    avatar: string;
    ideas: number;
    connections: number;
}

const SAMPLE_PROFILES: CofounderProfile[] = [
    {
        id: '1',
        name: 'Alex Chen',
        role: 'Full Stack Developer',
        location: 'San Francisco, CA',
        skills: ['React', 'Node.js', 'AWS', 'AI/ML'],
        lookingFor: ['Marketing Co-founder', 'Business Development'],
        bio: 'Ex-Google engineer with 8 years of experience. Looking to build something in the AI/productivity space.',
        avatar: '👨‍💻',
        ideas: 3,
        connections: 47,
    },
    {
        id: '2',
        name: 'Sarah Martinez',
        role: 'Product Manager',
        location: 'New York, NY',
        skills: ['Product Strategy', 'User Research', 'Data Analytics'],
        lookingFor: ['Technical Co-founder', 'Designer'],
        bio: 'Former PM at Stripe. Passionate about fintech and financial inclusion.',
        avatar: '👩‍💼',
        ideas: 5,
        connections: 89,
    },
    {
        id: '3',
        name: 'Michael Park',
        role: 'UI/UX Designer',
        location: 'Austin, TX',
        skills: ['Figma', 'User Research', 'Design Systems', 'Frontend'],
        lookingFor: ['Backend Developer', 'Growth Marketer'],
        bio: 'Design lead at early-stage startups. Won multiple design awards. Ready to co-found.',
        avatar: '🎨',
        ideas: 2,
        connections: 56,
    },
    {
        id: '4',
        name: 'Emily Johnson',
        role: 'Growth Marketer',
        location: 'Los Angeles, CA',
        skills: ['SEO', 'Content Marketing', 'Paid Ads', 'Analytics'],
        lookingFor: ['Technical Co-founder', 'Product Manager'],
        bio: 'Grew 3 startups from 0 to 100k users. Looking for my next adventure in health tech.',
        avatar: '📈',
        ideas: 4,
        connections: 102,
    },
];

export function CollaborateView() {
    const [profiles] = useState<CofounderProfile[]>(SAMPLE_PROFILES);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProfile, setSelectedProfile] = useState<CofounderProfile | null>(null);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const roles = [...new Set(profiles.map((p) => p.role))];

    const filteredProfiles = profiles.filter((profile) => {
        const matchesSearch =
            !searchQuery ||
            profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            profile.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
            profile.bio.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = !selectedRole || profile.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="h-full flex flex-col pt-8 pb-12">
            {/* Header Content */}
            <div className="mb-12 space-y-6">
                <div>
                    <span className="text-green-400 font-mono text-xs uppercase tracking-wider mb-2 block">Talent Network</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Find Co-founders</h1>
                    <p className="text-gray-400 max-w-2xl text-lg font-light">
                        Connect with visionaries, builders, and growth experts matching your ambition.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by role, skills..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-none">
                        <button
                            onClick={() => setSelectedRole(null)}
                            className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${!selectedRole
                                ? 'bg-white text-black'
                                : 'bg-white/5 text-gray-400 hover:text-white'
                                }`}
                        >
                            All Roles
                        </button>
                        {roles.map((role) => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${selectedRole === role
                                    ? 'bg-white text-black'
                                    : 'bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((profile, idx) => (
                    <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative glass-card hover:bg-white/5 rounded-2xl p-6 transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedProfile(profile)}
                        layoutId={`card-${profile.id}`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 text-white font-serif text-xl">
                                {profile.name[0]}
                            </div>
                            <div className="px-2 py-1 rounded text-[10px] font-medium bg-white/5 border border-white/5 text-gray-400">
                                {profile.role}
                            </div>
                        </div>

                        <h3 className="text-xl font-serif text-white group-hover:text-purple-200 transition-colors mb-2">
                            {profile.name}
                        </h3>

                        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                            {profile.bio}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-auto">
                            {profile.skills.slice(0, 3).map(skill => (
                                <span key={skill} className="px-2 py-1 rounded text-[10px] bg-white/5 text-gray-500 border border-white/5">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedProfile && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setSelectedProfile(null)}
                        />

                        <motion.div
                            layoutId={`card-${selectedProfile.id}`}
                            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedProfile(null)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-20"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-8 md:p-10 space-y-8">
                                {/* Header */}
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 text-white font-serif text-3xl">
                                        {selectedProfile.name[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-serif text-white mb-2">{selectedProfile.name}</h2>
                                        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-4">
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full">
                                                <Briefcase className="w-3.5 h-3.5" />
                                                {selectedProfile.role}
                                            </span>
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {selectedProfile.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">About</h3>
                                        <p className="text-gray-400 leading-relaxed text-lg font-light">
                                            {selectedProfile.bio}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                                            <Code className="w-4 h-4" />
                                            Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProfile.skills.map(skill => (
                                                <span key={skill} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/10 flex items-center gap-4">
                                    <button className="flex-1 bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Send Message
                                    </button>
                                    <div className="flex gap-2">
                                        <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
                                            <Linkedin className="w-5 h-5" />
                                        </button>
                                        <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
                                            <Twitter className="w-5 h-5" />
                                        </button>
                                        <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
                                            <Github className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
