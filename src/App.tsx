/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BlockchainProvider, useBlockchain } from './context/BlockchainContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CampaignList } from './components/CampaignList';
import { CreateCampaignModal } from './components/CreateCampaignModal';
import { ContributeModal } from './components/ContributeModal';
import { CampaignDetailsModal } from './components/CampaignDetailsModal';
import { ProofModal } from './components/ProofModal';
import { BlockchainExplorer } from './components/BlockchainExplorer';
import { TamperLab } from './components/TamperLab';
import { AnalyticsView } from './components/AnalyticsView';
import { UserPortfolio } from './components/UserPortfolio';
import { EducationalPanel } from './components/EducationalPanel';
import { VerifyModal } from './components/VerifyModal';
import { Footer } from './components/Footer';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const {
    activeTab,
    setActiveTab,
    isInitializing,
    selectedCampaignId,
    setSelectedCampaignId,
    campaigns,
    selectedProof,
    setSelectedProof,
    contributeTargetCampaign,
    setContributeTargetCampaign,
  } = useBlockchain();

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // If user navigates to 'create', open the create modal
  React.useEffect(() => {
    if (activeTab === 'create') {
      setShowCreateModal(true);
    }
  }, [activeTab]);

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId) || null;

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 text-cyan-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs font-mono text-slate-400">
          Initializing Genesis Block & Cryptographic Ledger...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar with Verification Status */}
      <Navbar onOpenVerifyModal={() => setShowVerifyModal(true)} />

      {/* Main View Port */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero />
            <CampaignList />
            <EducationalPanel />
          </>
        )}

        {activeTab === 'explore' && <CampaignList />}

        {activeTab === 'explorer' && <BlockchainExplorer />}

        {activeTab === 'security' && <TamperLab />}

        {activeTab === 'analytics' && <AnalyticsView />}

        {activeTab === 'portfolio' && <UserPortfolio />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <CampaignDetailsModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaignId(null)}
        />
      )}

      {/* Contribute Modal */}
      {contributeTargetCampaign && (
        <ContributeModal
          campaign={contributeTargetCampaign}
          onClose={() => setContributeTargetCampaign(null)}
        />
      )}

      {/* Blockchain Proof Modal */}
      {selectedProof && (
        <ProofModal proof={selectedProof} onClose={() => setSelectedProof(null)} />
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <CreateCampaignModal
          onClose={() => {
            setShowCreateModal(false);
            if (activeTab === 'create') {
              setActiveTab('explore');
            }
          }}
        />
      )}

      {/* Full Verification Modal */}
      {showVerifyModal && (
        <VerifyModal onClose={() => setShowVerifyModal(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BlockchainProvider>
      <AppContent />
    </BlockchainProvider>
  );
}
