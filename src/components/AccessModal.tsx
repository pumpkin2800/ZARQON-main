import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck } from 'lucide-react';
import { useAccessStore } from '../store/accessStore';

interface AccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AccessModal = ({ isOpen, onClose }: AccessModalProps) => {
    const [inputKey, setInputKey] = useState('');
    const [error, setError] = useState(false);
    const { unlockVerified } = useAccessStore();

    useEffect(() => {
        if (isOpen) {
            setInputKey('');
            setError(false);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputKey === 'ZARQON-V2') {
            unlockVerified();
            onClose();
        } else {
            setError(true);
            setTimeout(() => setError(false), 1000);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-brand-dark/90 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative z-50 w-full max-w-md bg-brand-panel border border-brand-green shadow-[0_0_30px_rgba(157,0,255,0.2)] p-6"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-brand-green/50 hover:text-brand-green"><X size={20} /></button>

                        <div className="flex items-center gap-3 mb-6 text-brand-green">
                            <Lock size={24} />
                            <h2 className="text-xl font-bold tracking-widest">SECURITY GATEWAY</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider opacity-70">Enter Authorization Key</label>
                                <input
                                    type="password"
                                    value={inputKey}
                                    onChange={(e) => setInputKey(e.target.value)}
                                    className="w-full bg-brand-dark border border-brand-green/30 p-3 text-brand-green placeholder:text-brand-green/20 focus:outline-none focus:border-brand-green font-mono text-center tracking-[0.5em]"
                                    placeholder="••••••••"
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="text-brand-alert text-xs text-center font-bold animate-pulse">
                                    ACCESS DENIED: INVALID KEY
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3 bg-brand-green text-brand-dark font-bold hover:bg-brand-green-bright transition-colors uppercase tracking-widest"
                            >
                                AUTHENTICATE
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
