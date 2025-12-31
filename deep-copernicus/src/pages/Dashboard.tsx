import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import {
    DollarSign,
    Users,
    BookOpen,
    GraduationCap,
    ArrowUpRight,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmpireCondition } from '../components/EmpireCondition';
import { MotivationalQuote } from '../components/MotivationalQuote';
import { useGlobalStore } from '../stores/globalStore';

export const Dashboard = () => {
    const { currency } = useGlobalStore();
    const financeEntries = useLiveQuery(() => db.financeEntries.toArray());
    const socialStats = useLiveQuery(() => db.socialStats.toArray());
    const books = useLiveQuery(() => db.books.toArray());
    const courses = useLiveQuery(() => db.courses.toArray());

    const totalIncome = financeEntries?.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const totalExpense = financeEntries?.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const netWorth = totalIncome - totalExpense;

    const totalFollowers = socialStats?.reduce((acc, curr) => acc + curr.followers, 0) || 0;

    const booksRead = books?.filter(b => b.status === 'read').length || 0;
    const completedCourses = courses?.filter(c => c.status === 'completed').length || 0;
    const activeCourses = courses?.filter(c => c.status === 'in-progress').length || 0;

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
                        Command <span className="text-cyber-purple">Center</span>
                    </h2>
                    <p className="text-gray-400 font-mono text-sm mt-1">
                        SYSTEM STATUS: <span className="text-green-500 animate-pulse">ONLINE</span>
                    </p>
                </div>
                <div className="w-full md:w-auto">
                    <MotivationalQuote />
                </div>
            </header>

            {/* Empire Condition Meter */}
            <div className="w-full">
                <EmpireCondition
                    netWorth={netWorth}
                    completedTasks={booksRead + completedCourses}
                    activeHabits={activeCourses}
                />
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="cyber-card group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-cyber-purple/20 rounded text-cyber-purple group-hover:text-cyber-neon transition-colors">
                            <DollarSign size={24} />
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${netWorth >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {netWorth >= 0 ? '+2.4%' : '-1.2%'}
                        </span>
                    </div>
                    <h3 className="text-gray-400 text-sm font-mono">NET WORTH</h3>
                    <p className="text-2xl font-bold text-white mt-1">{currency} {netWorth.toLocaleString()}</p>
                </div>

                <div className="cyber-card group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-blue-500/20 rounded text-blue-400 group-hover:text-blue-300 transition-colors">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                            <ArrowUpRight size={12} className="inline mr-1" />
                            Growth
                        </span>
                    </div>
                    <h3 className="text-gray-400 text-sm font-mono">TOTAL FOLLOWERS</h3>
                    <p className="text-2xl font-bold text-white mt-1">{totalFollowers.toLocaleString()}</p>
                </div>

                <div className="cyber-card group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-pink-500/20 rounded text-pink-400 group-hover:text-pink-300 transition-colors">
                            <BookOpen size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-mono">BOOKS READ</h3>
                    <p className="text-2xl font-bold text-white mt-1">{booksRead}</p>
                </div>

                <div className="cyber-card group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-yellow-500/20 rounded text-yellow-400 group-hover:text-yellow-300 transition-colors">
                            <GraduationCap size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-mono">COURSES COMPLETED</h3>
                    <p className="text-2xl font-bold text-white mt-1">{completedCourses}</p>
                </div>
            </div>

            {/* Quick Actions & Recent Activity Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 cyber-card min-h-[300px] flex flex-col justify-center items-center text-gray-500">
                    <p>Financial Overview Chart Loading...</p>
                    {/* Placeholder for Chart */}
                </div>

                <div className="cyber-card">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Clock size={20} className="text-cyber-neon" />
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <Link to="/money" className="cyber-button w-full justify-center">
                            Add Transaction
                        </Link>
                        <Link to="/social" className="cyber-button w-full justify-center">
                            Log Social Stats
                        </Link>
                        <Link to="/vault/books" className="cyber-button w-full justify-center">
                            Update Reading
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
