import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import {
    GraduationCap,
    PlayCircle,
    CheckCircle2,
    Clock,
    Plus,
    Trash2
} from 'lucide-react';
import clsx from 'clsx';

export const CoursesVault = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [name, setName] = useState('');
    const [platform, setPlatform] = useState('');
    const [link, setLink] = useState('');
    const [status, setStatus] = useState<'not-started' | 'in-progress' | 'completed'>('not-started');
    const [deadline, setDeadline] = useState('');

    const courses = useLiveQuery(() => db.courses.toArray());

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !platform) return;

        await db.courses.add({
            name,
            platform,
            link,
            completionPercentage: 0,
            status,
            deadline: deadline ? new Date(deadline) : undefined
        });

        setName('');
        setPlatform('');
        setLink('');
        setStatus('not-started');
        setDeadline('');
        setShowAddForm(false);
    };

    const updateProgress = (id: number, progress: number) => {
        db.courses.update(id, {
            completionPercentage: progress,
            status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started'
        });
    };

    const handleDelete = (id: number) => {
        db.courses.delete(id);
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Courses Vault</h2>
                    <p className="text-gray-400">Track your learning journey</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="cyber-button"
                >
                    <Plus size={18} /> {showAddForm ? 'Cancel' : 'Add Course'}
                </button>
            </header>

            {showAddForm && (
                <div className="cyber-card">
                    <h3 className="text-xl font-bold mb-4 text-cyber-neon">New Course</h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text" placeholder="Course Name"
                            value={name} onChange={e => setName(e.target.value)}
                            className="cyber-input" required
                        />
                        <input
                            type="text" placeholder="Platform (Udemy, Coursera...)"
                            value={platform} onChange={e => setPlatform(e.target.value)}
                            className="cyber-input" required
                        />
                        <input
                            type="text" placeholder="Course Link"
                            value={link} onChange={e => setLink(e.target.value)}
                            className="cyber-input"
                        />
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value as any)}
                            className="cyber-input"
                        >
                            <option value="not-started">Not Started</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Deadline (Optional)</label>
                            <input
                                type="date"
                                value={deadline} onChange={e => setDeadline(e.target.value)}
                                className="cyber-input"
                            />
                        </div>
                        <button type="submit" className="cyber-button md:col-span-2 justify-center">
                            Start Learning
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses?.map(course => (
                    <div key={course.id} className="cyber-card">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={clsx(
                                    "p-3 rounded-lg",
                                    course.status === 'completed' ? "bg-green-500/20 text-green-400" :
                                        course.status === 'in-progress' ? "bg-cyber-purple/20 text-cyber-neon" :
                                            "bg-gray-800 text-gray-400"
                                )}>
                                    <GraduationCap size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">{course.name}</h4>
                                    <p className="text-sm text-gray-400">{course.platform}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => course.id && handleDelete(course.id)}
                                className="text-gray-600 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Progress</span>
                                <span>{course.completionPercentage}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={course.completionPercentage}
                                onChange={(e) => course.id && updateProgress(course.id, parseInt(e.target.value))}
                                className="w-full h-2 bg-cyber-dark rounded-lg appearance-none cursor-pointer accent-cyber-neon"
                            />
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <div className="flex gap-2">
                                {course.link && (
                                    <a
                                        href={course.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs flex items-center gap-1 text-cyber-neon hover:underline"
                                    >
                                        <PlayCircle size={12} /> Continue
                                    </a>
                                )}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                {course.status === 'completed' ? (
                                    <span className="text-green-400 flex items-center gap-1"><CheckCircle2 size={12} /> Completed</span>
                                ) : (
                                    <span className="flex items-center gap-1"><Clock size={12} /> {course.status === 'in-progress' ? 'In Progress' : 'Not Started'}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
