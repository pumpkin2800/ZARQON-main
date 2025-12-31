import { motion } from 'framer-motion';

export const AbdullahPage = ({ onBack }: { onBack: () => void }) => {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full text-center space-y-8"
            >
                <h1 className="text-6xl font-black tracking-tighter text-brand-verif text-shadow-glow">
                    ABDULLAH
                </h1>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-verif to-transparent opacity-50" />
                <p className="text-xl opacity-60 font-mono">
                    // VOID DETECTED
                // WAITING FOR SIGNAL INPUT...
                </p>

                <button
                    onClick={onBack}
                    className="mt-12 px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm tracking-widest"
                >
                    RETURN TO TERMINAL
                </button>
            </motion.div>
        </div>
    );
};
