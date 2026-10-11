import React, { useState, useMemo } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { formatINR, formatTimestamp, truncateHash } from '../utils/formatters';
import {
  Wallet,
  Heart,
  ExternalLink,
  Layers,
  CheckCircle2,
  Calendar,
  User,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const UserPortfolio: React.FC = () => {
  const { contributions, campaigns, blocks, setSelectedProof, setActiveTab } = useBlockchain();

  // Unique contributors list
  const contributorList = useMemo(() => {
    const set = new Set<string>();
    contributions.forEach((c) => set.add(c.contributor));
    return Array.from(set);
  }, [contributions]);

  const [activeContributor, setActiveContributor] = useState<string>(
    contributorList[0] || 'Alex Sharma'
  );

  const userContributions = useMemo(() => {
    return contributions.filter(
      (c) => c.contributor.toLowerCase() === activeContributor.toLowerCase()
    );
  }, [contributions, activeContributor]);

  const totalUserDonated = userContributions.reduce((acc, c) => acc + c.amount, 0);

  const supportedCampaignIds = new Set(userContributions.map((c) => c.campaignId));
  const supportedCampaigns = campaigns.filter((c) => supportedCampaignIds.has(c.id));

  const activeCount = supportedCampaigns.filter((c) => c.status === 'Active').length;
  const completedCount = supportedCampaigns.filter(
    (c) => c.status === 'Successfully Funded' || c.status === 'Completed'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Contributor Portfolio
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Personal micro-donation ledger with verifiable cryptographic certificates of support.
          </p>
        </div>

        {/* Profile Switcher Selector */}
        <div className="flex items-center gap-2 self-start md:self-auto text-xs">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 font-medium">Viewing Backer:</span>
          <select
            value={activeContributor}
            onChange={(e) => setActiveContributor(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-medium focus:outline-none focus:border-cyan-500"
          >
            {contributorList.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
          <span className="text-xs text-slate-400 font-medium block">Total Contributed</span>
          <span className="text-2xl font-bold text-white font-mono tabular-nums block">
            {formatINR(totalUserDonated)}
          </span>
          <span className="text-[11px] text-slate-500 block">Verified on-chain transactions</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
          <span className="text-xs text-slate-400 font-medium block">Campaigns Supported</span>
          <span className="text-2xl font-bold text-cyan-400 font-mono tabular-nums block">
            {supportedCampaigns.length}
          </span>
          <span className="text-[11px] text-slate-500 block">Unique grassroots initiatives</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
          <span className="text-xs text-slate-400 font-medium block">Active Campaigns</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono tabular-nums block">
            {activeCount}
          </span>
          <span className="text-[11px] text-slate-500 block">Currently ongoing</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
          <span className="text-xs text-slate-400 font-medium block">Funded Milestones</span>
          <span className="text-2xl font-bold text-indigo-400 font-mono tabular-nums block">
            {completedCount}
          </span>
          <span className="text-[11px] text-slate-500 block">Successfully hit 100% target</span>
        </div>
      </div>

      {/* Contributions Ledger History Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>On-Chain Contribution History ({userContributions.length})</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">All Blocks SHA-256 Validated</span>
        </div>

        {userContributions.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
            <p>No contributions recorded for "{activeContributor}" yet.</p>
            <button
              onClick={() => setActiveTab('explore')}
              className="text-cyan-400 hover:text-cyan-300 underline font-medium"
            >
              Explore Campaigns to Back an Idea
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {userContributions.map((contrib) => {
              const contribBlock = blocks.find((b) => b.index === contrib.blockIndex);

              return (
                <div
                  key={contrib.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">Block #{contrib.blockIndex}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-white font-sans font-bold text-sm">
                        {contrib.campaignTitle}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                      <span>Tx: {contrib.txId}</span>
                      <span className="text-slate-500">·</span>
                      <span>{formatTimestamp(contrib.timestamp)}</span>
                      {contrib.message && (
                        <>
                          <span className="text-slate-500">·</span>
                          <span className="text-slate-300 italic font-sans">"{contrib.message}"</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">DONATION AMOUNT</span>
                      <span className="text-emerald-400 font-bold text-sm">
                        {formatINR(contrib.amount)}
                      </span>
                    </div>

                    {contribBlock && (
                      <button
                        onClick={() =>
                          setSelectedProof({
                            block: contribBlock,
                            contribution: contrib,
                          })
                        }
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Inspect Proof</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
