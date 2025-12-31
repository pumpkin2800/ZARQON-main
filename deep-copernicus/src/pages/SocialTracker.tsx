import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import {
    Youtube,
    Instagram,
    Facebook,
    TrendingUp,
    Plus,
    Video
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Custom TikTok Icon since Lucide might not have it or it's named differently
const TikTokIcon = ({ size = 24, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

const PLATFORMS = [
    { id: 'yt1', name: 'YouTube Main', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    { id: 'yt2', name: 'YouTube 2nd', icon: Youtube, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
    { id: 'tt1', name: 'TikTok Main', icon: TikTokIcon, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
    { id: 'tt2', name: 'TikTok 2nd', icon: TikTokIcon, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/30' },
    { id: 'ig1', name: 'Instagram Main', icon: Instagram, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    { id: 'ig2', name: 'Instagram 2nd', icon: Instagram, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
    { id: 'fb1', name: 'Facebook', icon: Facebook, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
];

export const SocialTracker = () => {
    const socialStats = useLiveQuery(() => db.socialStats.toArray());
    const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0].id);
    const [followers, setFollowers] = useState('');
    const [views, setViews] = useState('');

    const handleAddStat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!followers) return;

        await db.socialStats.add({
            platform: selectedPlatform,
            followers: parseInt(followers),
            views: parseInt(views) || 0,
            date: new Date()
        });

        setFollowers('');
        setViews('');
    };

    const getLatestStat = (platformId: string) => {
        const stats = socialStats?.filter(s => s.platform === platformId).sort((a, b) => b.date.getTime() - a.date.getTime());
        return stats?.[0] || { followers: 0, views: 0 };
    };

    const getChartData = (platformId: string) => {
        return socialStats
            ?.filter(s => s.platform === platformId)
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map(s => ({
                date: s.date.toLocaleDateString(),
                followers: s.followers,
                views: s.views
            })) || [];
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Social <span className="text-cyber-neon">Ops</span></h2>
                    <p className="text-gray-400 font-mono text-sm">Track your digital footprint across the empire.</p>
                </div>
            </header>

            {/* Platform Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PLATFORMS.map(platform => {
                    const latest = getLatestStat(platform.id);
                    const Icon = platform.icon;
                    return (
                        <div
                            key={platform.id}
                            onClick={() => setSelectedPlatform(platform.id)}
                            className={`cyber-card cursor-pointer transition-all ${selectedPlatform === platform.id ? 'border-cyber-neon shadow-[0_0_15px_rgba(197,96,255,0.3)]' : `hover:border-gray-500 ${platform.border}`}`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className={`p-2 rounded ${platform.bg} ${platform.color}`}>
                                    <Icon size={20} />
                                </div>
                                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">{platform.name}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-2xl font-bold text-white">{latest.followers.toLocaleString()}</div>
                                <div className="text-xs text-gray-400 uppercase tracking-wide">Followers</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Form */}
                <div className="cyber-card h-fit">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Plus size={20} className="text-cyber-neon" />
                        Log New Data
                    </h3>
                    <form onSubmit={handleAddStat} className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Target Platform</label>
                            <select
                                value={selectedPlatform}
                                onChange={(e) => setSelectedPlatform(e.target.value)}
                                className="cyber-input bg-black"
                            >
                                {PLATFORMS.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Current Followers</label>
                            <input
                                type="number"
                                value={followers}
                                onChange={(e) => setFollowers(e.target.value)}
                                className="cyber-input"
                                placeholder="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase">Total Views (Optional)</label>
                            <input
                                type="number"
                                value={views}
                                onChange={(e) => setViews(e.target.value)}
                                className="cyber-input"
                                placeholder="0"
                            />
                        </div>
                        <button type="submit" className="cyber-button w-full justify-center mt-4">
                            Update Stats
                        </button>
                    </form>
                </div>

                {/* Charts */}
                <div className="lg:col-span-2 cyber-card min-h-[400px]">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-cyber-neon" />
                        Growth Trajectory: <span className="text-cyber-purple">{PLATFORMS.find(p => p.id === selectedPlatform)?.name}</span>
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={getChartData(selectedPlatform)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="date" stroke="#666" fontSize={12} tickMargin={10} />
                                <YAxis stroke="#666" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #8A2BE2', borderRadius: '4px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="followers"
                                    stroke="#8A2BE2"
                                    strokeWidth={2}
                                    dot={{ fill: '#C560FF', strokeWidth: 2 }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
