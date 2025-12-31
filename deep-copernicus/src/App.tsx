import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Dashboard } from './pages/Dashboard';
import { MoneyManager } from './pages/MoneyManager';
import { SocialTracker } from './pages/SocialTracker';
import { AccountsVault } from './pages/AccountsVault';
import { WebsitesVault } from './pages/WebsitesVault';
import { CertificatesVault } from './pages/CertificatesVault';
import { CoursesVault } from './pages/CoursesVault';
import { BooksVault } from './pages/BooksVault';
import { Settings } from './pages/Settings';
import { Embed } from './pages/Embed';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/embed" element={<Embed />} />
                <Route
                    path="*"
                    element={
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/money" element={<MoneyManager />} />
                                <Route path="/social" element={<SocialTracker />} />
                                <Route path="/vault/accounts" element={<AccountsVault />} />
                                <Route path="/vault/websites" element={<WebsitesVault />} />
                                <Route path="/vault/certificates" element={<CertificatesVault />} />
                                <Route path="/vault/courses" element={<CoursesVault />} />
                                <Route path="/vault/books" element={<BooksVault />} />
                                <Route path="/settings" element={<Settings />} />
                            </Routes>
                        </Layout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
