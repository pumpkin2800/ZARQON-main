import { useState } from 'react';
import { Layout } from './components/Layout/Layout';
import { BootScreen } from './components/BootScreen';
import { AnimatePresence } from 'framer-motion';
import { IdentitySection } from './components/Sections/IdentitySection';
import { CapabilitySection } from './components/Sections/CapabilitySection';
import { CertificatesSection } from './components/Sections/CertificatesSection';
import { VaultSection } from './components/Sections/VaultSection';
import { LiveSignalsSection } from './components/Sections/LiveSignalsSection';
import { TimelineSection } from './components/Sections/TimelineSection';
import { DisciplineSection } from './components/Sections/DisciplineSection';
import { ContactSection } from './components/Sections/ContactSection';
import { AbdullahPage } from './components/AbdullahPage';

function App() {
  const [booted, setBooted] = useState(false);
  const [view, setView] = useState<'HOME' | 'ABDULLAH'>('HOME');

  if (view === 'ABDULLAH') {
    return <AbdullahPage onBack={() => setView('HOME')} />;
  }

  return (
    <>
      <AnimatePresence>
        {!booted && <BootScreen onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      {booted && (
        <Layout>
          <div className="flex flex-col gap-12 text-center py-20 animate-in fade-in duration-1000">
            <h1 className="text-6xl font-black mb-4 tracking-tighter text-shadow-glow">WELCOME TO ZARQON</h1>
            <p className="text-xl opacity-70">YOU HAVE REACHED YOUR DESTINATION LEAVE THE REST FOR US NOW</p>
          </div>

          <div className="space-y-24 pb-32">
            <IdentitySection />
            <CapabilitySection />
            <CertificatesSection />
            <VaultSection />
            <LiveSignalsSection />
            <TimelineSection />
            <DisciplineSection />
            <ContactSection onNavigate={(page) => setView(page)} />
          </div>
        </Layout>
      )}
    </>
  );
}

export default App;
