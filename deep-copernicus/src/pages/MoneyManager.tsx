import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { useGlobalStore } from '../stores/globalStore';
import { Plus, Minus, Trash2, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';
import clsx from 'clsx';

const COLORS = ['#6E00FF', '#C560FF', '#00C2FF', '#FF0055', '#FFD600'];

export const MoneyManager = () => {
    const { currency } = useGlobalStore();
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [note, setNote] = useState('');

    const transactions = useLiveQuery(() => db.financeEntries.reverse().toArray());

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !category) return;

        await db.financeEntries.add({
            type,
            amount: parseFloat(amount),
            category,
            date: new Date(),
            note
        });

        setAmount('');
        setCategory('');
        setNote('');
    };

    const handleDelete = (id: number) => {
        db.financeEntries.delete(id);
    };

    // Chart Data Preparation
    const expenseData = transactions
        ?.filter(t => t.type === 'expense')
        .reduce((acc: any[], curr) => {
            const existing = acc.find(i => i.name === curr.category);
            if (existing) {
                existing.value += curr.amount;
            } else {
                acc.push({ name: curr.category, value: curr.amount });
            }
            return acc;
        }, []) || [];

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Money Manager</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setType('income')}
                        className={clsx("cyber-button", type === 'income' ? "bg-green-600 hover:bg-green-500" : "bg-cyber-gray hover:bg-cyber-dark")}
                    >
                        <Plus size={18} /> Income
                    </button>
                    <button
                        onClick={() => setType('expense')}
                        className={clsx("cyber-button", type === 'expense' ? "bg-red-600 hover:bg-red-500" : "bg-cyber-gray hover:bg-cyber-dark")}
                    >
                        <Minus size={18} /> Expense
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Input Form */}
                <div className="cyber-card h-fit">
                    <h3 className="text-xl font-bold mb-4 text-cyber-neon">Add {type === 'income' ? 'Income' : 'Expense'}</h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="cyber-input"
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Category</label>
                            <input
                                type="text"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="cyber-input"
                                placeholder={type === 'income' ? "Salary, Freelance..." : "Food, Rent..."}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Note (Optional)</label>
                            <input
                                type="text"
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                className="cyber-input"
                                placeholder="Details..."
                            />
                        </div>
                        <button type="submit" className="w-full cyber-button justify-center mt-4">
                            Add Transaction
                        </button>
                    </form>
                </div>

                {/* Analytics Chart */}
                <div className="cyber-card flex flex-col items-center justify-center min-h-[300px]">
                    <h3 className="text-xl font-bold mb-4 text-cyber-neon">Expense Breakdown</h3>
                    {expenseData.length > 0 ? (
                        <div className="w-full h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenseData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #6E00FF' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-gray-500">No expense data yet</p>
                    )}
                </div>

                {/* Recent Transactions List */}
                <div className="cyber-card lg:col-span-1 h-[500px] overflow-y-auto">
                    <h3 className="text-xl font-bold mb-4 text-cyber-neon">Recent History</h3>
                    <div className="space-y-3">
                        {transactions?.map((t) => (
                            <div key={t.id} className="flex justify-between items-center p-3 bg-cyber-dark rounded border border-cyber-purple/10 hover:border-cyber-purple/50 transition-colors">
                                <div>
                                    <p className="font-bold text-white">{t.category}</p>
                                    <p className="text-xs text-gray-500">{format(t.date, 'MMM d, yyyy')}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={clsx("font-mono font-bold", t.type === 'income' ? "text-green-400" : "text-red-400")}>
                                        {t.type === 'income' ? '+' : '-'}{currency} {t.amount.toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => t.id && handleDelete(t.id)}
                                        className="text-gray-600 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {(!transactions || transactions.length === 0) && (
                            <p className="text-center text-gray-500 mt-10">No transactions found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
