import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import {
    Globe,
    ExternalLink,
    Trash2,
    Plus,
    Tag,
    Pin,
    Star
} from 'lucide-react';
import clsx from 'clsx';

export const WebsitesVault = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [tags, setTags] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [notes, setNotes] = useState('');

    const websites = useLiveQuery(() =>
        db.websites.toArray()
            .then(items => items.sort((a, b) => {
                // Sort by Pinned first
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                // Then by priority (High -> Low)
                const priorityMap = { high: 3, medium: 2, low: 1 };
                return priorityMap[b.priority] - priorityMap[a.priority];
            }))
    );

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !name) return;

        await db.websites.add({
            url: url.startsWith('http') ? url : `https://${url}`,
            name,
            tags: tags.split(',').map(t => t.trim()).filter(t => t),
            priority,
            notes,
            isPinned: false,
            isHighlighted: false
        });

        setUrl('');
        setName('');
        setTags('');
        setPriority('medium');
        setNotes('');
        setShowAddForm(false);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this link?')) {
            db.websites.delete(id);
        }
    };

    const togglePin = async (id: number, currentStatus?: boolean) => {
        await db.websites.update(id, { isPinned: !currentStatus });
    };

    const toggleHighlight = async (id: number, currentStatus?: boolean) => {
        await db.websites.update(id, { isHighlighted: !currentStatus });
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'high': return 'text-red-400 border-red-400/30 bg-red-400/10';
            case 'medium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
            case 'low': return 'text-green-400 border-green-400/30 bg-green-400/10';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Websites <span className="text-cyber-purple">Vault</span></h2>
                    <p className="text-gray-400 font-mono text-sm">Curated collection of digital resources</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="cyber-button"
                >
                    <Plus size={18} /> {showAddForm ? 'Cancel' : 'Add Link'}
                </button>
            </header>

            {showAddForm && (
                <div className="glass-panel animate-fade-in">
                    <h3 className="text-xl font-bold mb-4 text-cyber-neon flex items-center gap-2">
                        <Plus size={20} /> New Resource
                    </h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text" placeholder="Website Name"
                            value={name} onChange={e => setName(e.target.value)}
                            className="cyber-input" required
                        />
                        <input
                            type="text" placeholder="URL (e.g. google.com)"
                            value={url} onChange={e => setUrl(e.target.value)}
                            className="cyber-input" required
                        />
                        <input
                            type="text" placeholder="Tags (comma separated)"
                            value={tags} onChange={e => setTags(e.target.value)}
                            className="cyber-input"
                        />
                        <select
                            value={priority}
                            onChange={e => setPriority(e.target.value as any)}
                            className="cyber-input"
                        >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                        <textarea
                            placeholder="Notes (Optional)"
                            value={notes} onChange={e => setNotes(e.target.value)}
                            className="cyber-input md:col-span-2 h-20"
                        />
                        <button type="submit" className="cyber-button md:col-span-2 justify-center">
                            Save Link
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {websites?.map(site => (
                    <div
                        key={site.id}
                        className={clsx(
                            "glass-panel group relative hover:translate-y-[-2px] transition-all flex flex-col h-full",
                            site.isHighlighted && "highlight-glow border-cyber-neon/30"
                        )}
                    >
                        {/* Pin Indicator */}
                        {site.isPinned && (
                            <div className="absolute -top-2 -right-2 bg-cyber-neon text-black p-1 rounded-full shadow-[0_0_10px_rgba(197,96,255,0.5)] z-10">
                                <Pin size={12} fill="currentColor" />
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-cyber-dark rounded-full text-cyber-purple">
                                    <Globe size={18} />
                                </div>
                                <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded border tracking-wider", getPriorityColor(site.priority))}>
                                    {site.priority.toUpperCase()}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-1">
                                <button
                                    onClick={() => site.id && togglePin(site.id, site.isPinned)}
                                    className={clsx("p-1 rounded hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100", site.isPinned ? "text-cyber-neon opacity-100" : "text-gray-400")}
                                    title={site.isPinned ? "Unpin" : "Pin"}
                                >
                                    <Pin size={14} fill={site.isPinned ? "currentColor" : "none"} />
                                </button>
                                <button
                                    onClick={() => site.id && toggleHighlight(site.id, site.isHighlighted)}
                                    className={clsx("p-1 rounded hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100", site.isHighlighted ? "text-yellow-400 opacity-100" : "text-gray-400")}
                                    title={site.isHighlighted ? "Remove Highlight" : "Highlight"}
                                >
                                    <Star size={14} fill={site.isHighlighted ? "currentColor" : "none"} />
                                </button>
                                <a
                                    href={site.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-cyber-neon transition-colors p-1"
                                >
                                    <ExternalLink size={14} />
                                </a>
                                <button
                                    onClick={() => site.id && handleDelete(site.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <h4 className="text-lg font-bold text-white mb-1 leading-tight">{site.name}</h4>
                        <p className="text-sm text-gray-400 mb-3 truncate font-mono opacity-70">{site.url}</p>

                        {site.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-white/5">
                                {site.tags.map((tag, idx) => (
                                    <span key={idx} className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Tag size={8} /> {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
