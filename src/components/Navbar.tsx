import React, { useState } from 'react';
import { useBlockchain, NavigationTab } from '../context/BlockchainContext';
import { ShieldCheck, ShieldAlert, Plus, RefreshCw, Menu, X, Layers, Activity } from 'lucide-react';

export const Navbar: React.FC<{ onOpenVerifyModal: () => void }> = ({ onOpenVerifyModal }) => {
  const { activeTab, setActiveTab, validationReport, isValidating, resetToDemo } = useBlockchain();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const isChainHealthy = validationReport ? validationReport.isValid : true;

  const navLinks: { id: NavigationTab; label: string }[] = [
    { id: 'explore', label: 'Explore Campaigns' },
    { id: 'explorer', label: 'Blockchain Explorer' },
    { id: 'security', label: 'Security Lab' },
    { id: 'analytics', label: 'Funding Analytics' },
    { id: 'portfolio', label: 'My Portfolio' },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-400 p-[1.5px] shadow-sm shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0">
                FUNDCHAIN
              </span>
              <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase -mt-1">
                Genesis Ledger
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-cyan-400 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action with verification status */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Integrity quick status indicator */}
            <button
              onClick={onOpenVerifyModal}
              title="Click to view full cryptographic audit"
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                isChainHealthy
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/30'
                  : 'bg-rose-950/60 text-rose-300 border-rose-700 hover:bg-rose-900/40 animate-pulse'
              }`}
            >
              {isChainHealthy ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Chain Verified</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Tamper Detected</span>
                </>
              )}
            </button>

            {/* Reset Demo button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Reset blockchain to initial state"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('create')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-lg shadow-sm shadow-cyan-500/20 active:scale-95 transition-all whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create Campaign</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === link.id
                    ? 'bg-slate-900 text-cyan-400'
                    : 'text-slate-300 hover:bg-slate-900/60'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  onOpenVerifyModal();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-mono text-cyan-400 flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Verify Ledger Audit</span>
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(true);
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-slate-400 hover:text-rose-400"
              >
                Reset Demo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <h3 className="text-base font-semibold text-white">Reset Demo Blockchain?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will reset the entire blockchain back to Block #0 (Genesis Block) and the initial verified seed campaigns. All newly created test campaigns or tamper simulations will be restored.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-white rounded-lg border border-slate-700 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowResetConfirm(false);
                  await resetToDemo();
                }}
                className="px-4 py-1.5 text-xs font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
