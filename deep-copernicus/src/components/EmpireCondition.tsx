import React from 'react';
import { Activity } from 'lucide-react';

interface EmpireConditionProps {
    netWorth: number;
    completedTasks: number;
    activeHabits: number;
}

export const EmpireCondition: React.FC<EmpireConditionProps> = ({ netWorth, completedTasks, activeHabits }) => {
    // Simple algorithm to calculate condition score (0-100)
    // This can be made more complex later
    const score = Math.min(100, Math.floor(
        (netWorth > 0 ? 40 : 0) +
        (completedTasks * 5) +
        (activeHabits * 10)
    ));

    let condition = 'CRITICAL';
    let color = 'text-red-500';
    let borderColor = 'border-red-500';

    if (score > 80) {
        condition = 'GOD MODE';
        color = 'text-cyber-neon';
        borderColor = 'border-cyber-neon';
    } else if (score > 50) {
        condition = 'OPTIMAL';
        color = 'text-green-500';
        borderColor = 'border-green-500';
    } else if (score > 30) {
        condition = 'STABLE';
        color = 'text-yellow-500';
        borderColor = 'border-yellow-500';
    }

    return (
        <div className={`cyber-card flex items-center justify-between ${borderColor} border-l-4`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full bg-black border ${borderColor}`}>
                    <Activity className={color} size={24} />
                </div>
                <div>
                    <h3 className="text-gray-400 text-xs tracking-widest uppercase">Empire Condition</h3>
                    <div className={`text-2xl font-black tracking-tighter ${color} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                        {condition}
                    </div>
                </div>
            </div>

            <div className="text-right">
                <div className="text-3xl font-bold text-white">{score}%</div>
                <div className="w-24 h-2 bg-gray-800 rounded-full mt-1 overflow-hidden">
                    <div
                        className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-1000`}
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
