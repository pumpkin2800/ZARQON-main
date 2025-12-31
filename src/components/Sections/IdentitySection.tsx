import { Section } from '../Section';
import { useAccessStore } from '../../store/accessStore';
import { motion } from 'framer-motion';

export const IdentitySection = () => {
    const { accessLevel } = useAccessStore();
    const isVerified = accessLevel === 'VERIFIED' || accessLevel === 'INTERNAL';

    return (
        <Section title="Identity / Role">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Public Column */}
                <div>
                    <h3 className="text-xl font-bold text-brand-green-bright mb-4">Core Function</h3>
                    <p className="opacity-80 leading-relaxed max-w-md">
                        a normal man trying to be the best version of him self and inspire others
                    </p>

                    <div className="mt-8 space-y-4">
                        <div className="border border-brand-green/20 p-4 bg-brand-green/5">
                            <h4 className="font-bold text-sm tracking-wider mb-2">PRINCIPLES</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm opacity-70">
                                <li>to be a better man</li>
                                <li>to be financially stable</li>
                                <li>to be someone worthy</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Verified Column */}
                {isVerified ? (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="border-l border-brand-verif/30 pl-8"
                    >
                        <h3 className="text-xl font-bold text-brand-verif mb-4">Philosophy (Deep)</h3>
                        <p className="leading-relaxed opacity-90 text-brand-verif/90">
                            I restart from zero to avoid "shallow" Seniority.
                            Most engineers stack frameworks without understanding the metal.
                            ZARQON represents a return to first principles.
                        </p>

                        <div className="mt-6">
                            <h4 className="font-bold text-sm tracking-wider text-brand-verif mb-2">THE ZERO-RESET METHOD</h4>
                            <p className="text-sm opacity-70">
                                Every 6 months, verify core knowledge by rebuilding tools from scratch.
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="border-l border-brand-green/10 pl-8 opacity-30 blur-sm select-none grayscale">
                        <h3 className="text-xl font-bold mb-4">Philosophy (Deep)</h3>
                        <p className="leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <div className="mt-4 p-2 border border-brand-green/50 text-center text-xs">
                            VERIFICATION REQUIRED TO READ
                        </div>
                    </div>
                )}
            </div>
        </Section>
    );
};
