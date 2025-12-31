import { Section } from '../Section';
import { Activity, Clock, Zap, Cpu, Briefcase } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../deep-copernicus/src/db';

import { useGlobalStore } from '../../../deep-copernicus/src/stores/globalStore';

export const LiveSignalsSection = () => {
    const { userName } = useGlobalStore();
    const websites = useLiveQuery(() => db.websites.toArray());
    const projectCount = websites?.length || 0;

    // Always visible
    return (
        <Section title="Live Signals">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <SignalCard
                    icon={<Zap />}
                    label="SYSTEM STATUS"
                    value={userName === 'Emperor' ? 'IMPERIAL' : 'ONLINE'}
                    sub={<a href={import.meta.env.VITE_VAULT_URL} target="_blank" rel="noopener noreferrer" className="hover:text-brand-green hover:underline cursor-pointer transition-colors">Source: Deep-Copernicus</a>}
                    active
                />
                <SignalCard
                    icon={<Activity />}
                    label="CURRENT FOCUS"
                    value="LEARNING"
                    sub="Topic: C++/PYTHON"
                    active
                />
                <SignalCard
                    icon={<Briefcase />}
                    label="ACTIVE PROJECTS"
                    value={projectCount.toString()}
                    sub="Vault: Websites"
                />
                <SignalCard
                    icon={<Cpu />}
                    label="MENTAL LOAD"
                    value="OPTIMAL"
                    sub="Flow State: Active"
                />
            </div>
        </Section>
    );
};

const SignalCard = ({ icon, label, value, sub, active }: any) => (
    <div className={`p-4 border ${active ? 'border-brand-green bg-brand-green/5' : 'border-brand-green/20'} flex flex-col gap-2 relative overflow-hidden group hover:border-brand-green/50 transition-colors`}>
        <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity">{icon}</div>
        <div className="text-[10px] tracking-widest opacity-60 uppercase">{label}</div>
        <div className="text-xl font-bold tracking-tighter text-shadow-glow">{value}</div>
        {sub && <div className="text-xs text-brand-green-bright mt-1 pt-1 border-t border-brand-green/10">{sub}</div>}
        {active && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-green animate-pulse" />}
    </div>
);
