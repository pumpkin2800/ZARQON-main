import React, { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import {
    BookOpen,
    Star,
    Plus,
    Trash2,
    Upload,
    Check,
    Pin
} from 'lucide-react';
import clsx from 'clsx';

export const BooksVault = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [status, setStatus] = useState<'to-read' | 'reading' | 'read'>('to-read');
    const [rating, setRating] = useState(0);
    const [coverBlob, setCoverBlob] = useState<Blob | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const books = useLiveQuery(() =>
        db.books.toArray()
            .then(items => items.sort((a, b) => {
                // Sort by Pinned first
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                // Then by rating (Highest first)
                return (b.rating || 0) - (a.rating || 0);
            }))
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverBlob(e.target.files[0]);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !author) return;

        await db.books.add({
            title,
            author,
            status,
            rating,
            coverBlob: coverBlob || undefined,
            isPinned: false,
            isHighlighted: false
        });

        setTitle('');
        setAuthor('');
        setStatus('to-read');
        setRating(0);
        setCoverBlob(null);
        setShowAddForm(false);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this book?')) {
            db.books.delete(id);
        }
    };

    const updateStatus = (id: number, newStatus: 'to-read' | 'reading' | 'read') => {
        db.books.update(id, { status: newStatus });
    };

    const togglePin = async (id: number, currentStatus?: boolean) => {
        await db.books.update(id, { isPinned: !currentStatus });
    };

    const toggleHighlight = async (id: number, currentStatus?: boolean) => {
        await db.books.update(id, { isHighlighted: !currentStatus });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Books <span className="text-cyber-purple">Vault</span></h2>
                    <p className="text-gray-400 font-mono text-sm">Your personal library</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="cyber-button"
                >
                    <Plus size={18} /> {showAddForm ? 'Cancel' : 'Add Book'}
                </button>
            </header>

            {showAddForm && (
                <div className="glass-panel animate-fade-in">
                    <h3 className="text-xl font-bold mb-4 text-cyber-neon flex items-center gap-2">
                        <Plus size={20} /> New Book
                    </h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text" placeholder="Book Title"
                            value={title} onChange={e => setTitle(e.target.value)}
                            className="cyber-input" required
                        />
                        <input
                            type="text" placeholder="Author"
                            value={author} onChange={e => setAuthor(e.target.value)}
                            className="cyber-input" required
                        />
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value as any)}
                            className="cyber-input"
                        >
                            <option value="to-read">To Read</option>
                            <option value="reading">Reading</option>
                            <option value="read">Read</option>
                        </select>
                        <div className="flex items-center gap-2 cyber-input">
                            <span className="text-gray-400 text-sm">Rating:</span>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={star <= rating ? "text-yellow-400" : "text-gray-600"}
                                >
                                    <Star size={16} fill={star <= rating ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs text-gray-400 mb-1">Cover Image</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-cyber-purple/30 rounded-lg p-4 text-center cursor-pointer hover:border-cyber-neon transition-colors bg-black/20"
                            >
                                {coverBlob ? (
                                    <span className="text-cyber-neon">{(coverBlob as File).name} selected</span>
                                ) : (
                                    <span className="text-gray-400 flex items-center justify-center gap-2">
                                        <Upload size={16} /> Upload Cover
                                    </span>
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
                            Add to Library
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books?.map(book => (
                    <div
                        key={book.id}
                        className={clsx(
                            "glass-panel group p-0 overflow-hidden flex flex-col h-full",
                            book.isHighlighted && "highlight-glow border-cyber-neon/30"
                        )}
                    >
                        {/* Pin Indicator */}
                        {book.isPinned && (
                            <div className="absolute top-2 left-2 bg-cyber-neon text-black p-1 rounded-full shadow-[0_0_10px_rgba(197,96,255,0.5)] z-20">
                                <Pin size={12} fill="currentColor" />
                            </div>
                        )}

                        <div className="relative aspect-[2/3] bg-black/40 border-b border-white/5">
                            {book.coverBlob ? (
                                <img
                                    src={URL.createObjectURL(book.coverBlob)}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-cyber-purple/30">
                                    <BookOpen size={48} />
                                </div>
                            )}

                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                                <div className="flex gap-2 mb-2">
                                    <button
                                        onClick={() => book.id && togglePin(book.id, book.isPinned)}
                                        className={clsx("p-2 rounded-full transition-colors", book.isPinned ? "bg-cyber-neon text-black" : "bg-gray-700 text-white hover:bg-cyber-purple")}
                                        title={book.isPinned ? "Unpin" : "Pin"}
                                    >
                                        <Pin size={14} fill={book.isPinned ? "currentColor" : "none"} />
                                    </button>
                                    <button
                                        onClick={() => book.id && toggleHighlight(book.id, book.isHighlighted)}
                                        className={clsx("p-2 rounded-full transition-colors", book.isHighlighted ? "bg-yellow-400 text-black" : "bg-gray-700 text-white hover:bg-yellow-400")}
                                        title={book.isHighlighted ? "Remove Highlight" : "Highlight"}
                                    >
                                        <Star size={14} fill={book.isHighlighted ? "currentColor" : "none"} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => book.id && updateStatus(book.id, 'reading')}
                                    className="w-full py-1.5 bg-cyber-purple/50 border border-cyber-purple rounded text-xs text-white hover:bg-cyber-neon hover:text-black transition-all"
                                >
                                    Reading
                                </button>
                                <button
                                    onClick={() => book.id && updateStatus(book.id, 'read')}
                                    className="w-full py-1.5 bg-green-600/50 border border-green-500 rounded text-xs text-white hover:bg-green-500 transition-all"
                                >
                                    Finished
                                </button>
                                <button
                                    onClick={() => book.id && handleDelete(book.id)}
                                    className="p-2 bg-red-600/50 border border-red-500 rounded-full text-white hover:bg-red-500 mt-2 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {book.status !== 'to-read' && (
                                <div className={clsx(
                                    "absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-lg",
                                    book.status === 'reading' ? "bg-cyber-purple text-white" : "bg-green-500 text-black"
                                )}>
                                    {book.status}
                                </div>
                            )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col bg-white/5">
                            <h4 className="font-bold text-white line-clamp-1 leading-tight" title={book.title}>{book.title}</h4>
                            <p className="text-xs text-gray-400 mb-2 font-mono">{book.author}</p>

                            {book.rating ? (
                                <div className="flex gap-0.5 mt-auto">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            className={i < (book.rating || 0) ? "text-yellow-400" : "text-gray-700"}
                                            fill={i < (book.rating || 0) ? "currentColor" : "none"}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-auto text-xs text-gray-600 font-mono">Unrated</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
