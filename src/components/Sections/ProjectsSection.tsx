import { Section } from '../Section';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../deep-copernicus/src/db';
import { useGlobalStore } from '../../../deep-copernicus/src/stores/globalStore';
import { Briefcase, TrendingUp, Globe } from 'lucide-react';

export const ProjectsSection = () => {
    const { currency } = useGlobalStore();
    const websites = useLiveQuery(() => db.websites.toArray());
    const financeEntries = useLiveQuery(() => db.financeEntries.toArray());

    const projectCount = websites?.length || 0;

    // Calculate revenue from entries tagged as 'Project' or similar
    const projectRevenue = financeEntries
        ?.filter(e => e.type === 'income' && (e.category.toLowerCase().includes('project') || e.category.toLowerCase().includes('freelance')))
        .reduce((acc, curr) => acc + curr.amount, 0) || 0;

    return (
        <Section title="Projects & Ventures">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border border-white/10 bg-white/5 flex flex-col gap-4 group hover:border-brand-verif/50 transition-all">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-brand-verif/20 text-brand-verif rounded"><Briefcase size={20} /></div>
                        <span className="text-xs opacity-50 uppercase tracking-widest">Active</span>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white mb-1 group-hover:text-brand-verif transition-colors">{projectCount}</div>
                        <div className="text-xs opacity-60">TOTAL DEPLOYED PROJECTS</div>
                    </div>
                </div>

                <div className="p-6 border border-white/10 bg-white/5 flex flex-col gap-4 group hover:border-green-500/50 transition-all">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-green-500/20 text-green-500 rounded"><TrendingUp size={20} /></div>
                        <span className="text-xs opacity-50 uppercase tracking-widest">Revenue</span>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white mb-1 group-hover:text-green-500 transition-colors">{currency} {projectRevenue.toLocaleString()}</div>
                        <div className="text-xs opacity-60">TOTAL PROJECT INCOME</div>
                    </div>
                </div>

                <div className="p-6 border border-white/10 bg-white/5 flex flex-col gap-4 group hover:border-blue-400/50 transition-all">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-blue-400/20 text-blue-400 rounded"><Globe size={20} /></div>
                        <span className="text-xs opacity-50 uppercase tracking-widest">Stack</span>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-white mb-1">React / Python / Rust</div>
                        <div className="text-xs opacity-60">CORE TECHNOLOGIES</div>
                    </div>
                </div>
            </div>

            {/* Dynamic List of Latest Projects */}
            {projectCount > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {websites?.slice(0, 4).map(site => (
                        <a key={site.id} href={site.url.startsWith('http') ? site.url : `https://${site.url}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 border border-white/5 hover:bg-white/5 hover:border-white/20 transition-all group">
                            <div className="flex flex-col">
                                <span className="font-bold text-brand-verif group-hover:text-white transition-colors">{site.name}</span>
                                <span className="text-xs opacity-40">{site.url}</span>
                            </div>
                            <div className={`px-2 py-1 text-[10px] uppercase rounded border ${site.priority === 'high' ? 'border-red-500/50 text-red-500' : 'border-white/10 opacity-50'}`}>
                                {site.priority}
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </Section>
    );
};
