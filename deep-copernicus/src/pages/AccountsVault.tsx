import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { encryptData, decryptData } from '../utils/encryption';
import {
    Key,
    Copy,
    Eye,
    EyeOff,
    Trash2,
    Search,
    Plus,
    Pin,
    Star
} from 'lucide-react';
import clsx from 'clsx';

export const AccountsVault = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [visiblePasswords, setVisiblePasswords] = useState<{ [key: number]: boolean }>({});

    // Form State
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [category, setCategory] = useState('General');
    const [notes, setNotes] = useState('');

    const accounts = useLiveQuery(() =>
        db.accounts
            .filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.username.toLowerCase().includes(searchTerm.toLowerCase()))
            .toArray()
            .then(items => items.sort((a, b) => {
                // Sort by Pinned first
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                // Then by name
                return a.name.localeCompare(b.name);
            }))
        , [searchTerm]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !password) return;

        await db.accounts.add({
            name,
            username,
            encryptedPassword: encryptData(password),
            category,
            notes,
            isPinned: false,
            isHighlighted: false
        });

        // Reset
        setName('');
        setUsername('');
        setPassword('');
        setCategory('General');
        setNotes('');
        setShowAddForm(false);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this account?')) {
            db.accounts.delete(id);
        }
    };

    const togglePin = async (id: number, currentStatus?: boolean) => {
        await db.accounts.update(id, { isPinned: !currentStatus });
    };

    const toggleHighlight = async (id: number, currentStatus?: boolean) => {
        await db.accounts.update(id, { isHighlighted: !currentStatus });
    };

    const togglePasswordVisibility = (id: number) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Accounts <span className="text-cyber-purple">Vault</span></h2>
                    <p className="text-gray-400 font-mono text-sm">Encrypted storage for your credentials</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="cyber-button"
                >
                    <Plus size={18} /> {showAddForm ? 'Cancel' : 'Add Account'}
                </button>
            </header>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                    type="text"
                    placeholder="Search accounts..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="cyber-input pl-10 rounded-lg"
                />
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="glass-panel animate-fade-in">
                    <h3 className="text-xl font-bold mb-4 text-cyber-neon flex items-center gap-2">
                        <Plus size={20} /> New Account
                    </h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text" placeholder="Account Name (e.g. Netflix)"
                            value={name} onChange={e => setName(e.target.value)}
                            className="cyber-input" required
                        />
                        <input
                            type="text" placeholder="Category"
                            value={category} onChange={e => setCategory(e.target.value)}
                            className="cyber-input"
                        />
                        <input
                            type="text" placeholder="Username / Email"
                            value={username} onChange={e => setUsername(e.target.value)}
                            className="cyber-input"
                        />
                        <input
                            type="password" placeholder="Password"
                            value={password} onChange={e => setPassword(e.target.value)}
                            className="cyber-input" required
                        />
                        <textarea
                            placeholder="Notes (Optional)"
                            value={notes} onChange={e => setNotes(e.target.value)}
                            className="cyber-input md:col-span-2 h-20"
                        />
                        <button type="submit" className="cyber-button md:col-span-2 justify-center">
                            Save to Vault
                        </button>
                    </form>
                </div>
            )}

            {/* Accounts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts?.map(account => {
                    const isVisible = visiblePasswords[account.id!];
                    const decryptedPass = decryptData(account.encryptedPassword);

                    return (
                        <div
                            key={account.id}
                            className={clsx(
                                "glass-panel group relative flex flex-col h-full",
                                account.isHighlighted && "highlight-glow border-cyber-neon/30"
                            )}
                        >
                            {/* Pin Indicator */}
                            {account.isPinned && (
                                <div className="absolute -top-2 -right-2 bg-cyber-neon text-black p-1 rounded-full shadow-[0_0_10px_rgba(197,96,255,0.5)] z-10">
                                    <Pin size={12} fill="currentColor" />
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={clsx(
                                        "p-2 rounded-lg transition-colors",
                                        account.isHighlighted ? "bg-cyber-neon/20 text-cyber-neon" : "bg-cyber-purple/20 text-cyber-purple"
                                    )}>
                                        <Key size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg leading-tight">{account.name}</h4>
                                        <p className="text-xs text-gray-400 font-mono mt-1">{account.category}</p>
                                    </div>
                                </div>

                                {/* Action Buttons (Visible on Hover) */}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => account.id && togglePin(account.id, account.isPinned)}
                                        className={clsx("p-1.5 rounded hover:bg-white/10 transition-colors", account.isPinned ? "text-cyber-neon" : "text-gray-400")}
                                        title={account.isPinned ? "Unpin" : "Pin"}
                                    >
                                        <Pin size={14} fill={account.isPinned ? "currentColor" : "none"} />
                                    </button>
                                    <button
                                        onClick={() => account.id && toggleHighlight(account.id, account.isHighlighted)}
                                        className={clsx("p-1.5 rounded hover:bg-white/10 transition-colors", account.isHighlighted ? "text-yellow-400" : "text-gray-400")}
                                        title={account.isHighlighted ? "Remove Highlight" : "Highlight"}
                                    >
                                        <Star size={14} fill={account.isHighlighted ? "currentColor" : "none"} />
                                    </button>
                                    <button
                                        onClick={() => account.id && handleDelete(account.id)}
                                        className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 mt-auto">
                                <div className="bg-black/40 p-2.5 rounded border border-white/5 flex justify-between items-center group/field">
                                    <span className="text-sm text-gray-300 truncate select-all">{account.username}</span>
                                    <button
                                        onClick={() => copyToClipboard(account.username)}
                                        className="text-gray-600 hover:text-white opacity-0 group-hover/field:opacity-100 transition-opacity"
                                        title="Copy Username"
                                    >
                                        <Copy size={14} />
                                    </button>
                                </div>

                                <div className="bg-black/40 p-2.5 rounded border border-white/5 flex justify-between items-center group/field">
                                    <span className="text-sm text-gray-300 font-mono truncate tracking-wider">
                                        {isVisible ? decryptedPass : '••••••••••••'}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => account.id && togglePasswordVisibility(account.id)}
                                            className="text-gray-500 hover:text-white"
                                        >
                                            {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(decryptedPass)}
                                            className="text-gray-600 hover:text-white opacity-0 group-hover/field:opacity-100 transition-opacity"
                                            title="Copy Password"
                                        >
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
