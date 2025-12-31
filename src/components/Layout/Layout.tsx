import React, { useState } from 'react';
import { useAccessStore } from '../../store/accessStore';
import clsx from 'clsx';
import { ShieldCheck, Lock, Terminal } from 'lucide-react';
import { AccessModal } from '../AccessModal';
import { ParticlesBackground } from '../ParticlesBackground';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { accessLevel } = useAccessStore();
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="min-h-screen bg-brand-dark text-brand-green font-mono relative overflow-hidden selection:bg-brand-green selection:text-brand-dark">
            {/* Background Animation */}
            <ParticlesBackground />

            {/* CRT Effects */}
            <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-30 bg-scanlines scanlines"></div>
            <div className="fixed inset-0 pointer-events-none z-50 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>

            {/* Modals */}
            <AccessModal isOpen={showModal} onClose={() => setShowModal(false)} />

            {/* Top Bar */}
            <header className="fixed top-0 left-0 right-0 h-16 border-b border-brand-green/20 bg-brand-dark/80 backdrop-blur-sm z-40 flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <Terminal size={20} className="text-brand-green" />
                    <span className="font-bold tracking-widest text-lg">ZARQON</span>
                </div>

                <div className="flex gap-2">
                    <div className={`w-2 h-2 rounded-full ${accessLevel === 'PUBLIC' ? 'bg-brand-green animate-pulse' : 'bg-brand-green/30'}`} />
                    <div className={`w-2 h-2 rounded-full ${accessLevel === 'VERIFIED' ? 'bg-brand-verif animate-pulse' : 'bg-brand-green/30'}`} />
                    <div className={`w-2 h-2 rounded-full ${accessLevel === 'INTERNAL' ? 'bg-brand-alert animate-pulse' : 'bg-brand-green/30'}`} />
                </div>

                <button
                    onClick={() => accessLevel === 'PUBLIC' && setShowModal(true)}
                    className={clsx(
                        "px-4 py-1 border text-sm tracking-wider transition-colors uppercase flex items-center gap-2",
                        accessLevel === 'PUBLIC'
                            ? "border-brand-green text-brand-green hover:bg-brand-green/10"
                            : "border-brand-verif text-brand-verif bg-brand-verif/10 cursor-default"
                    )}
                >
                    {accessLevel === 'PUBLIC' ? (
                        <>Request Access <Lock size={14} /></>
                    ) : (
                        <>Verified Mode <ShieldCheck size={14} /></>
                    )}
                </button>
            </header>

            {/* Main Content */}
            <main className="pt-20 px-4 pb-20 max-w-7xl mx-auto relative z-10">
                {children}
            </main>

        </div>
    );
};
