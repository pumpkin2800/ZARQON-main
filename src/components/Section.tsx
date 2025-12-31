import { type ReactNode } from 'react';
import clsx from 'clsx';
import { useAccessStore } from '../store/accessStore';

interface SectionProps {
    title: string;
    color?: string; // Default to green
    children: ReactNode;
    className?: string;
}

export const Section = ({ title, children, className }: SectionProps) => {
    const { accessLevel } = useAccessStore();

    return (
        <section className={clsx("relative border-l-2 border-brand-green/30 pl-6 py-8 my-12", className)}>
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-brand-dark border-2 border-brand-green/50 rounded-full" />

            <h2 className={clsx(
                "text-3xl font-bold uppercase tracking-widest mb-8 flex items-center gap-4",
                accessLevel === 'VERIFIED' ? "text-shadow-glow text-brand-verif" : "text-brand-green"
            )}>
                {title}
                {accessLevel === 'VERIFIED' && <span className="text-xs border px-2 py-0.5 rounded-full border-brand-verif text-brand-verify opacity-70">VERIFIED</span>}
            </h2>

            <div className="space-y-6">
                {children}
            </div>
        </section>
    );
};
