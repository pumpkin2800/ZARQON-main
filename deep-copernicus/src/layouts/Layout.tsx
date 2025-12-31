import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Wallet,
    Share2,
    Key,
    Globe,
    Award,
    GraduationCap,
    BookOpen,
    Settings,
    Menu,
    X
} from 'lucide-react';
import clsx from 'clsx';
import { Terminal } from '../components/Terminal';

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
    <Link
        to={to}
        className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-none border-l-2 transition-all duration-200",
            active
                ? "bg-cyber-purple/10 border-cyber-neon text-cyber-neon shadow-[0_0_10px_rgba(197,96,255,0.2)]"
                : "border-transparent text-gray-400 hover:bg-cyber-purple/5 hover:text-white hover:border-cyber-purple"
        )}
    >
        <Icon size={18} />
        <span className="font-bold tracking-wide text-sm">{label}</span>
    </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [logoClicks, setLogoClicks] = useState(0);
    const [showTerminal, setShowTerminal] = useState(false);

    const handleLogoClick = () => {
        const newCount = logoClicks + 1;
        setLogoClicks(newCount);
        if (newCount === 5) {
            setShowTerminal(true);
            setLogoClicks(0);
        }
    };

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'COMMAND CENTER' },
        { path: '/money', icon: Wallet, label: 'FINANCE' },
        { path: '/social', icon: Share2, label: 'SOCIAL OPS' },
        { path: '/vault/accounts', icon: Key, label: 'ACCOUNTS' },
        { path: '/vault/websites', icon: Globe, label: 'LINKS' },
        { path: '/vault/certificates', icon: Award, label: 'CERTIFICATES' },
        { path: '/vault/courses', icon: GraduationCap, label: 'ACADEMY' },
        { path: '/vault/books', icon: BookOpen, label: 'LIBRARY' },
        { path: '/settings', icon: Settings, label: 'SYSTEM' },
    ];

    return (
        <div className="min-h-screen bg-cyber-black text-white flex font-mono selection:bg-cyber-neon selection:text-black">
            <Terminal isOpen={showTerminal} onClose={() => setShowTerminal(false)} />

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-black/40 border-r border-cyber-purple/20 p-4 fixed h-full overflow-y-auto backdrop-blur-md">
                <div className="mb-8 px-4 pt-4 select-none cursor-pointer" onClick={handleLogoClick}>
                    <h1 className="text-2xl font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_rgba(110,0,255,0.8)]">
                        ZARKOON
                        <span className="text-cyber-neon block text-sm font-normal tracking-[0.2em] not-italic mt-1">EMPIRE</span>
                    </h1>
                </div>

                <nav className="space-y-1 flex-1">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            to={item.path}
                            icon={item.icon}
                            label={item.label}
                            active={location.pathname === item.path}
                        />
                    ))}
                </nav>

                <div className="mt-auto pt-4 border-t border-cyber-purple/20 text-[10px] text-gray-600 text-center uppercase tracking-widest">
                    System Online • v2.0
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-cyber-purple/20 z-50 px-4 py-3 flex justify-between items-center">
                <span className="font-black text-cyber-neon tracking-widest" onClick={handleLogoClick}>ZARKOON</span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-black/95 z-40 pt-16 px-4">
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <div key={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                                <SidebarItem
                                    to={item.path}
                                    icon={item.icon}
                                    label={item.label}
                                    active={location.pathname === item.path}
                                />
                            </div>
                        ))}
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
