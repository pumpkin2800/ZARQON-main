import React, { useState, useEffect, useRef } from 'react';
import { X, Terminal as TerminalIcon } from 'lucide-react';

interface TerminalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ isOpen, onClose }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([
        'ZARKOON OS v1.0.0 initialized...',
        'System integrity: 100%',
        'Type "help" for available commands.'
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (cmd: string) => {
        const cleanCmd = cmd.trim().toLowerCase();
        let response = '';

        switch (cleanCmd) {
            case 'help':
                response = 'Available commands: help, status, clear, whoami, ghostplan, exit';
                break;
            case 'status':
                response = 'EMPIRE CONDITION: OPTIMAL. ALL SYSTEMS ONLINE.';
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'whoami':
                response = 'USER: ZARKOON COMMANDER. ACCESS LEVEL: GOD MODE.';
                break;
            case 'ghostplan':
                response = 'GHOSTPLAN ACTIVE. OBJECTIVE: TOTAL DOMINATION. EXECUTE DAILY PROTOCOLS.';
                break;
            case 'exit':
                onClose();
                return;
            default:
                response = `Command not found: ${cmd}`;
        }

        setHistory(prev => [...prev, `> ${cmd}`, response]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 font-mono">
            <div className="w-full max-w-3xl h-[600px] bg-black border-2 border-green-500 rounded-lg shadow-[0_0_50px_rgba(34,197,94,0.2)] flex flex-col relative overflow-hidden">
                {/* CRT Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>

                {/* Header */}
                <div className="bg-green-900/20 border-b border-green-500 p-2 flex justify-between items-center text-green-500">
                    <div className="flex items-center gap-2">
                        <TerminalIcon size={16} />
                        <span className="text-xs font-bold tracking-widest">ZARKOON_TERMINAL_ACCESS</span>
                    </div>
                    <button onClick={onClose} className="hover:text-green-300 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 overflow-y-auto text-green-500 font-bold text-sm space-y-2 scrollbar-hide" onClick={() => inputRef.current?.focus()}>
                    {history.map((line, i) => (
                        <div key={i} className="break-words">{line}</div>
                    ))}
                    <div className="flex items-center gap-2">
                        <span className="text-green-500 animate-pulse">{'>'}</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent border-none outline-none text-green-500 flex-1 caret-green-500 uppercase"
                            autoFocus
                        />
                    </div>
                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
};
