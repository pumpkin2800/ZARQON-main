import { Section } from '../Section';
import { HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';

export const VaultSection = () => {
    // We use an iframe to strictly sync with the Deep Copernicus origin (localhost:5174)
    // allowing "Live" data changes to be reflected immediately as they share the same IndexedDB/LocalStorage context
    // inside the frame.

    return (
        <Section title="ZARQON Vault Sync">
            <div className="relative min-h-[500px] flex flex-col border border-brand-green/20 bg-black overflow-hidden relative group">

                {/* Connection Header */}
                <div className="absolute top-0 left-0 w-full p-2 bg-brand-green/10 border-b border-brand-green/20 flex justify-between items-center text-xs px-4 z-20 backdrop-blur-sm">
                    <a
                        href={import.meta.env.VITE_VAULT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-brand-verif hover:text-brand-green hover:underline transition-colors cursor-pointer"
                    >
                        <HardDrive size={12} />
                        CONNECTED: DEEP-COPERNICUS
                    </a>
                    <span className="animate-pulse text-brand-green">● LIVE LINK ESTABLISHED</span>
                </div>

                {/* The Live Window */}
                <iframe
                    src={`${import.meta.env.VITE_VAULT_URL}/embed`}
                    className="w-full flex-1 border-none opacity-80 group-hover:opacity-100 transition-opacity duration-500 bg-black"
                    title="Deep Copernicus Vault Embed"
                    loading="lazy"
                />

                <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-brand-verif shadow-[0_0_15px_#0af] z-20"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </Section>
    );
};
