import { Section } from '../Section';
import { useAccessStore } from '../../store/accessStore';

const timeline = [
    { phase: 'PHASE 1: FOUNDATION', status: 'ACTIVE', desc: 'Core infrastructure and identity establishment.', details: 'Built Zarqon v1, established knowledge base, initial certs.' },
    { phase: 'PHASE 2: SOON', status: 'LOCKED', desc: '', details: '' },
];

export const TimelineSection = () => {
    const { accessLevel } = useAccessStore();
    const isVerified = accessLevel === 'VERIFIED' || accessLevel === 'INTERNAL';

    return (
        <Section title="Timeline / Roadmap">
            <div className="space-y-8 border-l border-brand-green/20 ml-3 pl-8 relative">
                {timeline.map((item, idx) => (
                    <div key={idx} className="relative">
                        <div className={`absolute -left-[38px] top-1 w-5 h-5 rounded-full border-4 border-brand-dark ${item.status === 'ACTIVE' ? 'bg-brand-green animate-pulse' : 'bg-brand-green/50'}`} />

                        <h3 className="text-lg font-bold tracking-wider mb-1">{item.phase} <span className="text-xs opacity-50 ml-2">[{item.status}]</span></h3>
                        <p className="opacity-70 max-w-xl">{item.desc}</p>

                        {isVerified && item.details && (
                            <div className="mt-4 p-4 bg-brand-verif/5 border-l-2 border-brand-verif max-w-xl">
                                <div className="text-xs text-brand-verif font-bold mb-1">STRATEGIC CONTEXT</div>
                                <p className="text-sm opacity-90">{item.details}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Section>
    );
};
