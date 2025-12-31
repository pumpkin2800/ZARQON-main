import React, { useRef, useState } from 'react';
import { db } from '../db';
import {
    Download,
    Upload,
    Database,
    AlertTriangle,
    CheckCircle2,
    Trash2
} from 'lucide-react';

export const Settings = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleExport = async () => {
        try {
            const data = {
                financeEntries: await db.financeEntries.toArray(),
                socialStats: await db.socialStats.toArray(),
                accounts: await db.accounts.toArray(),
                websites: await db.websites.toArray(),
                certificates: await db.certificates.toArray(),
                courses: await db.courses.toArray(),
                books: await db.books.toArray(),
                exportDate: new Date().toISOString(),
                version: 1
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `empire-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setMessage({ type: 'success', text: 'Data exported successfully!' });
        } catch (error) {
            console.error('Export failed:', error);
            setMessage({ type: 'error', text: 'Failed to export data.' });
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);

                // Validate basic structure
                if (!data.version || !data.financeEntries) {
                    throw new Error('Invalid backup file format');
                }

                if (confirm('WARNING: This will overwrite your current data. Are you sure?')) {
                    await db.transaction('rw', db.tables, async () => {
                        await Promise.all(db.tables.map(table => table.clear()));

                        if (data.financeEntries) await db.financeEntries.bulkAdd(data.financeEntries);
                        if (data.socialStats) await db.socialStats.bulkAdd(data.socialStats);
                        if (data.accounts) await db.accounts.bulkAdd(data.accounts);
                        if (data.websites) await db.websites.bulkAdd(data.websites);

                        if (data.certificates) {
                            const certs = data.certificates.map((c: any) => {
                                const { imageBlob, ...rest } = c;
                                return rest;
                            });
                            await db.certificates.bulkAdd(certs);
                        }

                        if (data.courses) await db.courses.bulkAdd(data.courses);

                        if (data.books) {
                            const books = data.books.map((b: any) => {
                                const { coverBlob, ...rest } = b;
                                return rest;
                            });
                            await db.books.bulkAdd(books);
                        }
                    });

                    setMessage({ type: 'success', text: 'Data imported successfully! (Note: Images are not restored in JSON backup)' });
                    setTimeout(() => window.location.reload(), 2000);
                }
            } catch (error) {
                console.error('Import failed:', error);
                setMessage({ type: 'error', text: 'Failed to import data. Invalid file.' });
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-white">System Settings</h2>
                <p className="text-gray-400">Manage your data and preferences</p>
            </header>

            {message && (
                <div className={`p-4 rounded flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="cyber-card">
                    <h3 className="text-xl font-bold mb-4 text-cyber-neon flex items-center gap-2">
                        <Database size={20} /> Data Management
                    </h3>
                    <p className="text-sm text-gray-400 mb-6">
                        Your data is stored locally in your browser. Create a backup to prevent data loss if you clear your browser cache.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={handleExport}
                            className="w-full cyber-button justify-center bg-cyber-dark border border-cyber-purple hover:bg-cyber-purple"
                        >
                            <Download size={18} /> Export Data to JSON
                        </button>

                        <div className="relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImport}
                                accept=".json"
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full cyber-button justify-center bg-cyber-dark border border-cyber-neon hover:bg-cyber-neon/20"
                            >
                                <Upload size={18} /> Import Data from JSON
                            </button>
                        </div>
                    </div>
                </div>

                <div className="cyber-card">
                    <h3 className="text-xl font-bold mb-4 text-cyber-neon flex items-center gap-2">
                        <AlertTriangle size={20} /> Danger Zone
                    </h3>
                    <p className="text-sm text-gray-400 mb-6">
                        Irreversible actions. Proceed with caution.
                    </p>

                    <button
                        onClick={async () => {
                            if (confirm("Are you absolutely sure? This will wipe ALL data.")) {
                                await Promise.all(db.tables.map(table => table.clear()));
                                window.location.reload();
                            }
                        }}
                        className="w-full cyber-button justify-center bg-red-900/20 border border-red-500 text-red-500 hover:bg-red-900/50"
                    >
                        <Trash2 size={18} /> Factory Reset
                    </button>
                </div>
            </div>
        </div>
    );
};
