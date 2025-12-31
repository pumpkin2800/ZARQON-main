import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setStep(1), 500),
            setTimeout(() => setStep(2), 1200),
            setTimeout(() => setStep(3), 2000),
            setTimeout(() => onComplete(), 2800),
        ];
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-center font-mono text-brand-green"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
        >
            <div className="w-64 space-y-2">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl font-bold tracking-widest text-center mb-8"
                >
                    WELCOME TO ZARQON
                </motion.div>

                <div className="space-y-1 text-sm opacity-80">
                    <Line text="> INITIALIZING KERNEL..." show={step >= 0} />
                    <Line text="> LOADING SECURITY MODULES..." show={step >= 1} />
                    <Line text="> UNLOCKING PUBLIC LAYER..." show={step >= 2} />
                    <Line text="> YOU HAVE REACHED YOUR DESTINATION LEAVE THE REST FOR US NOW." show={step >= 3} />
                </div>

                <motion.div
                    className="h-1 bg-brand-green/20 w-full mt-8 overflow-hidden relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: step >= 0 ? 1 : 0 }}
                >
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-brand-green shadow-[0_0_10px_#0f0]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

const Line = ({ text, show }: { text: string, show: boolean }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: show ? 1 : 0, x: show ? 0 : -10 }}
        className="h-5"
    >
        {text}
    </motion.div>
);
