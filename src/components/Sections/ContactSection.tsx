import { Section } from '../Section';
import { useAccessStore } from '../../store/accessStore';
import { Mail, ArrowRight } from 'lucide-react';

export const ContactSection = ({ onNavigate }: { onNavigate?: (page: 'ABDULLAH') => void }) => {
    const { accessLevel } = useAccessStore();
    const isVerified = accessLevel === 'VERIFIED' || accessLevel === 'INTERNAL';

    return (
        <Section title="Contact / Access">
            <div className="flex flex-col items-center justify-center py-12 text-center">

                {isVerified ? (
                    <div className="space-y-6 max-w-md w-full animate-in zoom-in duration-500">
                        <h3 className="text-2xl font-bold text-brand-verif tracking-tighter">CHANNEL OPEN</h3>
                        <p className="opacity-70">
                            You have verified access. Prioritized communication line established.
                        </p>
                        <button className="w-full py-4 bg-brand-verif/10 border border-brand-verif text-brand-verif font-bold hover:bg-brand-verif/20 transition-all flex items-center justify-center gap-2">
                            <Mail size={18} />
                            INITIATE COLLABORATION
                        </button>
                        <div className="pt-4 grid grid-cols-2 gap-4">
                            <a
                                href="http://localhost:5174"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-2 text-xs border border-brand-verif/30 hover:bg-brand-verif/10 transition-colors"
                            >
                                OPEN VAULT
                            </a>
                            <button
                                onClick={() => onNavigate?.('ABDULLAH')}
                                className="py-2 text-xs border border-brand-verif/30 hover:bg-brand-verif/10 transition-colors"
                            >
                                PROJECT: ABDULLAH
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 max-w-md w-full">
                        <h3 className="text-2xl font-bold tracking-tighter">RESTRICTED FREQUENCY</h3>
                        <p className="opacity-70">
                            Direct communication requires access negotiation.
                        </p>
                        <button className="w-full py-4 bg-brand-green/10 border border-brand-green text-brand-green font-bold hover:bg-brand-green/20 transition-all flex items-center justify-center gap-2 group">
                            REQUEST ACCESS
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                <div className="mt-12 w-full max-w-md pt-8 border-t border-white/10 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                    <a
                        href="http://localhost:5174"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 text-xs tracking-widest border border-brand-verif/30 hover:bg-brand-verif/10 hover:border-brand-verif text-brand-verif transition-all uppercase"
                    >
                        Access Vault
                    </a>
                    <button
                        onClick={() => onNavigate?.('ABDULLAH')}
                        className="py-3 text-xs tracking-widest border border-brand-verif/30 hover:bg-brand-verif/10 hover:border-brand-verif text-brand-verif transition-all uppercase"
                    >
                        Project: Abdullah
                    </button>
                </div>

            </div>
        </Section>
    );
};
