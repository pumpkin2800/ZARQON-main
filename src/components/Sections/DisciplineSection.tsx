import { Section } from '../Section';
import { useAccessStore } from '../../store/accessStore';
import { Crosshair } from 'lucide-react';

export const DisciplineSection = () => {
    const { accessLevel } = useAccessStore();
    const isVerified = accessLevel === 'VERIFIED' || accessLevel === 'INTERNAL';

    return (
        <Section title="Proof of Discipline">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2 p-6 border border-brand-green/10 bg-brand-green/5">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-brand-green-bright">
                        <Crosshair size={18} />
                        THE MANIFESTO
                    </h3>
                    <p className="opacity-80 italic leading-relaxed">
                        "Motivation is a signal. Discipline is bandwidth.
                        I do not rely on how I feel. I rely on the protocol."
                    </p>
                </div>

                <div className="md:w-1/2">
                    {isVerified ? (
                        <div className="space-y-4">
                            <h3 className="font-bold text-brand-verif mb-2">PROTOCOL: DEEP WORK</h3>
                            <ul className="space-y-2 text-sm opacity-90">
                                <li className="flex gap-2">
                                    <span className="text-brand-verif">{'>'}</span>
                                    <span>04:00 - 08:00 : RAW CREATION (NO WIFI)</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-brand-verif">{'>'}</span>
                                    <span>Daily Commit or Penalty ($50 -{'>'} Vault)</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-brand-verif">{'>'}</span>
                                    <span>Zero Notifications Policy</span>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center border border-dashed border-brand-green/20 opacity-40 text-sm">
                            INTERNAL PROTOCOLS HIDDEN
                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
};
