import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const QUOTES = [
    "The world is yours.",
    "Ghost mode activated. Build in silence.",
    "They sleep. We grind.",
    "Your empire is waiting.",
    "Discipline equals freedom.",
    "Focus on the mission.",
    "Reality is negotiable.",
    "Upgrade your mind.",
    "Code your future.",
    "Execute order 66."
];

export const MotivationalQuote = () => {
    const [quote, setQuote] = useState(QUOTES[0]);

    useEffect(() => {
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        setQuote(randomQuote);

        const interval = setInterval(() => {
            const nextQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
            setQuote(nextQuote);
        }, 30000); // Change every 30 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="cyber-card flex items-center gap-4 py-3 px-6 bg-cyber-purple/5 border-cyber-purple/20">
            <Quote size={20} className="text-cyber-purple shrink-0" />
            <p className="text-sm font-mono text-gray-300 italic tracking-wide w-full text-center">
                "{quote}"
            </p>
            <Quote size={20} className="text-cyber-purple shrink-0 rotate-180" />
        </div>
    );
};
