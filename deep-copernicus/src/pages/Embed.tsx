import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { useGlobalStore } from '../stores/globalStore';
import { EmpireCondition } from '../components/EmpireCondition';
import { MotivationalQuote } from '../components/MotivationalQuote';

export const Embed = () => {
    const { currency } = useGlobalStore();
    const financeEntries = useLiveQuery(() => db.financeEntries.toArray());
    const socialStats = useLiveQuery(() => db.socialStats.toArray());
    const books = useLiveQuery(() => db.books.toArray());
    const courses = useLiveQuery(() => db.courses.toArray());

    const totalIncome = financeEntries?.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const totalExpense = financeEntries?.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const netWorth = totalIncome - totalExpense;

    const followers = socialStats?.reduce((acc, curr) => acc + curr.followers, 0) || 0;
    const booksRead = books?.filter(b => b.status === 'read').length || 0;
    const completedCourses = courses?.filter(c => c.status === 'completed').length || 0;
    const activeCourses = courses?.filter(c => c.status === 'in-progress').length || 0;

    return (
        <div className="bg-black min-h-screen text-white p-4 font-sans select-none overflow-hidden flex flex-col justify-center">
            <div className="grid grid-cols-1 gap-6">

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <div className="text-[10px] text-gray-500 tracking-widest mb-1">NET WORTH</div>
                        <div className="text-xl font-bold text-cyber-purple drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
                            {currency} {netWorth.toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-500 tracking-widest mb-1">FOLLOWERS</div>
                        <div className="text-xl font-bold text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]">
                            {followers.toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-500 tracking-widest mb-1">BOOKS</div>
                        <div className="text-xl font-bold text-cyber-purple drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
                            {booksRead}
                        </div>
                    </div>
                </div>

                {/* Components */}
                <div className="space-y-4">
                    <EmpireCondition
                        netWorth={netWorth}
                        completedTasks={booksRead + completedCourses}
                        activeHabits={activeCourses}
                    />
                    <div className="opacity-80 transform scale-95">
                        <MotivationalQuote />
                    </div>
                </div>

            </div>
        </div>
    );
};
