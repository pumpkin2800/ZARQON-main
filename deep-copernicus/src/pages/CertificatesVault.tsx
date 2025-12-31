import React, { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import {
    Award,
    Calendar,
    Upload,
    Trash2,
    Plus,
    AlertCircle,
    Pin,
    Star
} from 'lucide-react';
import { format, isBefore, addMonths } from 'date-fns';
import clsx from 'clsx';

export const CertificatesVault = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [name, setName] = useState('');
    const [issuer, setIssuer] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const certificates = useLiveQuery(() =>
        db.certificates.toArray()
            .then(items => items.sort((a, b) => {
                // Sort by Pinned first
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                // Then by issue date (Newest first)
                return b.issueDate.getTime() - a.issueDate.getTime();
            }))
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageBlob(e.target.files[0]);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !issuer || !issueDate) return;

        await db.certificates.add({
            name,
            issuer,
            issueDate: new Date(issueDate),
            expiryDate: expiryDate ? new Date(expiryDate) : undefined,
            imageBlob: imageBlob || undefined,
            isPinned: false,
            isHighlighted: false
        });

        setName('');
        setIssuer('');
        setIssueDate('');
        setExpiryDate('');
        setImageBlob(null);
        setShowAddForm(false);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this certificate?')) {
            db.certificates.delete(id);
        }
    };

    const togglePin = async (id: number, currentStatus?: boolean) => {
        await db.certificates.update(id, { isPinned: !currentStatus });
    };

    const toggleHighlight = async (id: number, currentStatus?: boolean) => {
        await db.certificates.update(id, { isHighlighted: !currentStatus });
    };

    const isExpiringSoon = (date?: Date) => {
        if (!date) return false;
        return isBefore(date, addMonths(new Date(), 1));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Certificates <span className="text-cyber-purple">Vault</span></h2>
                    <p className="text-gray-400 font-mono text-sm">Digital proof of your achievements</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="cyber-button"
                >
                    <Plus size={18} /> {showAddForm ? 'Cancel' : 'Add Certificate'}
                </button>
            </header>

            {showAddForm && (
                <div className="glass-panel animate-fade-in">
                    <h3 className="text-xl font-bold mb-4 text-cyber-neon flex items-center gap-2">
                        <Plus size={20} /> New Certificate
                    </h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text" placeholder="Certificate Name"
                            value={name} onChange={e => setName(e.target.value)}
                            className="cyber-input" required
                        />
                        <input
                            type="text" placeholder="Issuing Organization"
                            value={issuer} onChange={e => setIssuer(e.target.value)}
                            className="cyber-input" required
                        />
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Issue Date</label>
                            <input
                                type="date"
                                value={issueDate} onChange={e => setIssueDate(e.target.value)}
                                className="cyber-input" required
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Expiry Date (Optional)</label>
                            <input
                                type="date"
                                value={expiryDate} onChange={e => setExpiryDate(e.target.value)}
                                className="cyber-input"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs text-gray-400 mb-1">Certificate Image</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-cyber-purple/30 rounded-lg p-8 text-center cursor-pointer hover:border-cyber-neon transition-colors bg-black/20"
                            >
                                {imageBlob ? (
                                    <span className="text-cyber-neon">{(imageBlob as File).name} selected</span>
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <Upload size={24} className="mb-2" />
                                        <span>Click to upload image</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        </div>
                        <button type="submit" className="cyber-button md:col-span-2 justify-center">
                            Save Certificate
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates?.map(cert => (
                    <div
                        key={cert.id}
                        className={clsx(
                            "glass-panel group relative flex flex-col h-full",
                            cert.isHighlighted && "highlight-glow border-cyber-neon/30"
                        )}
                    >
                        {/* Pin Indicator */}
                        {cert.isPinned && (
                            <div className="absolute -top-2 -right-2 bg-cyber-neon text-black p-1 rounded-full shadow-[0_0_10px_rgba(197,96,255,0.5)] z-10">
                                <Pin size={12} fill="currentColor" />
                            </div>
                        )}

                        <div className="relative aspect-video bg-black/40 rounded-lg mb-4 overflow-hidden border border-white/5 group-hover:border-cyber-purple/50 transition-colors">
                            {cert.imageBlob ? (
                                <img
                                    src={URL.createObjectURL(cert.imageBlob)}
                                    alt={cert.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-cyber-purple/30">
                                    <Award size={48} />
                                </div>
                            )}

                            {/* Overlay Actions */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => cert.id && togglePin(cert.id, cert.isPinned)}
                                    className={clsx("p-1.5 rounded-full backdrop-blur-md transition-colors", cert.isPinned ? "bg-cyber-neon text-black" : "bg-black/50 text-white hover:bg-cyber-purple")}
                                    title={cert.isPinned ? "Unpin" : "Pin"}
                                >
                                    <Pin size={14} fill={cert.isPinned ? "currentColor" : "none"} />
                                </button>
                                <button
                                    onClick={() => cert.id && toggleHighlight(cert.id, cert.isHighlighted)}
                                    className={clsx("p-1.5 rounded-full backdrop-blur-md transition-colors", cert.isHighlighted ? "bg-yellow-400 text-black" : "bg-black/50 text-white hover:bg-yellow-400")}
                                    title={cert.isHighlighted ? "Remove Highlight" : "Highlight"}
                                >
                                    <Star size={14} fill={cert.isHighlighted ? "currentColor" : "none"} />
                                </button>
                                <button
                                    onClick={() => cert.id && handleDelete(cert.id)}
                                    className="p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors backdrop-blur-md"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <h4 className="text-lg font-bold text-white mb-1 leading-tight">{cert.name}</h4>
                        <p className="text-sm text-cyber-neon mb-3 font-mono">{cert.issuer}</p>

                        <div className="flex justify-between items-center text-xs text-gray-400 mt-auto pt-3 border-t border-white/5">
                            <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <span>Issued: {format(cert.issueDate, 'MMM yyyy')}</span>
                            </div>
                            {cert.expiryDate && (
                                <div className={`flex items-center gap-1 ${isExpiringSoon(cert.expiryDate) ? 'text-red-400 font-bold' : ''}`}>
                                    {isExpiringSoon(cert.expiryDate) && <AlertCircle size={12} />}
                                    <span>Expires: {format(cert.expiryDate, 'MMM yyyy')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
