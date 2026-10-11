import React from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { Layers, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useBlockchain();

  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">FUNDCHAIN</span>
              <p className="text-xs text-slate-400">
                Transparent Blockchain Crowdfunding Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <button onClick={() => setActiveTab('explore')} className="hover:text-white transition-colors">
              Explore
            </button>
            <button onClick={() => setActiveTab('explorer')} className="hover:text-white transition-colors">
              Blockchain Explorer
            </button>
            <button onClick={() => setActiveTab('security')} className="hover:text-white transition-colors">
              Security Lab
            </button>
            <button onClick={() => setActiveTab('analytics')} className="hover:text-white transition-colors">
              Analytics
            </button>
            <button onClick={() => setActiveTab('portfolio')} className="hover:text-white transition-colors">
              My Portfolio
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Genesis Hash Anchor · SHA-256 Verified
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 text-center text-xs text-slate-400">
          Decentralized public fundraising ledger with cryptographic immutability and zero-trust verification.
        </div>
      </div>
    </footer>
  );
};
