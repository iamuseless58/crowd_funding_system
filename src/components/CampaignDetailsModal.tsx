import React from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { Campaign, Contribution } from '../types/blockchain';
import { formatINR, formatNumber, formatTimestamp, getDaysRemaining, truncateHash } from '../utils/formatters';
import {
  X,
  Heart,
  ShieldCheck,
  Calendar,
  Users,
  ExternalLink,
  Target,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const CampaignDetailsModal: React.FC<{
  campaign: Campaign;
  onClose: () => void;
}> = ({ campaign, onClose }) => {
  const {
    contributions,
    blocks,
    setContributeTargetCampaign,
    setSelectedProof,
  } = useBlockchain();

  const campaignContributions = contributions.filter((c) => c.campaignId === campaign.id);
  const progressPct = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
  const deadlineInfo = getDaysRemaining(campaign.deadline);
  const creationBlock = blocks.find((b) => b.index === campaign.blockIndex);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none" role="img" aria-label="emoji">
              {campaign.imageEmoji || '🌱'}
            </span>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-slate-300 font-medium">{campaign.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-cyan-400">Block #{campaign.blockIndex}</span>
                <span aria-hidden="true">·</span>
                <span
                  className={
                    campaign.status === 'Successfully Funded'
                      ? 'text-emerald-400 font-medium'
                      : 'text-slate-300'
                  }
                >
                  {campaign.status}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">{campaign.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Top Grid: Core Info & Funding Stats */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Description & Details */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Campaign Mission
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
                  {campaign.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Beneficiary</span>
                  </span>
                  <p className="text-xs text-slate-200 leading-snug">{campaign.beneficiary}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Purpose of Capital</span>
                  </span>
                  <p className="text-xs text-slate-200 leading-snug">{campaign.purpose}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1 text-xs text-slate-400">
                <span>Created by <strong className="text-slate-200">{campaign.creator}</strong></span>
                <span aria-hidden="true">·</span>
                <button
                  onClick={() => {
                    if (creationBlock) {
                      setSelectedProof({ block: creationBlock, campaign });
                    }
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-medium underline flex items-center gap-1"
                >
                  <span>Creation Block #{campaign.blockIndex}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Right: Funding Status Card */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              {/* Trust Score Banner */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-300 font-medium">Blockchain Trust Score</span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                  {campaign.trustScore || 96}/100
                </span>
              </div>

              {/* Progress Numbers */}
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
                    {formatINR(campaign.raised)}
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{progressPct}%</span>
                </div>
                <div className="text-xs text-slate-400">
                  Goal: <span className="font-mono text-slate-300">{formatINR(campaign.goal)}</span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800 mt-2">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      progressPct >= 100
                        ? 'bg-emerald-400'
                        : 'bg-gradient-to-r from-cyan-400 to-indigo-500'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Contributor & Time Meta */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
                  <span className="block text-[11px] text-slate-500">Backers</span>
                  <span className="font-mono text-white font-bold text-sm">
                    {campaign.contributorCount}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
                  <span className="block text-[11px] text-slate-500">Time Left</span>
                  <span className="text-white font-medium text-xs truncate block mt-0.5">
                    {deadlineInfo.text}
                  </span>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={() => {
                  setContributeTargetCampaign(campaign);
                  onClose();
                }}
                className="w-full py-2.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Contribute to this Project</span>
              </button>
            </div>
          </div>

          {/* Section: Blockchain Funding History */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Blockchain Funding History</span>
                  <span className="font-mono text-xs text-cyan-400 font-normal">
                    ({campaignContributions.length} Mined Transactions)
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Every contribution is an individual block permanently linked to the previous block hash.
                </p>
              </div>

              {creationBlock && (
                <button
                  onClick={() => setSelectedProof({ block: creationBlock, campaign })}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>View Blockchain Proof</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Transactions Table / List */}
            {campaignContributions.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                No contributions yet. Be the first backer to create Block #{blocks.length}!
              </div>
            ) : (
              <div className="space-y-3">
                {campaignContributions.map((contrib, idx) => {
                  const contribBlock = blocks.find((b) => b.index === contrib.blockIndex);

                  return (
                    <div
                      key={contrib.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 font-bold">
                            Transaction #{String(idx + 1).padStart(3, '0')}
                          </span>
                          <span className="text-slate-500 font-sans">·</span>
                          <span className="text-white font-sans font-medium">
                            {contrib.contributor}
                          </span>
                          <span className="text-slate-500 font-sans">·</span>
                          <span className="text-emerald-400 font-bold font-mono">
                            {formatINR(contrib.amount)}
                          </span>
                        </div>

                        {contrib.message && (
                          <p className="text-[11px] font-sans text-slate-300 italic">
                            "{contrib.message}"
                          </p>
                        )}

                        <div className="text-[11px] text-slate-400 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{formatTimestamp(contrib.timestamp)}</span>
                          </span>
                          <span>·</span>
                          <span>Block #{contrib.blockIndex}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">SHA-256 Hash</span>
                          <span className="text-slate-300 text-[11px]">
                            {truncateHash(contrib.hash, 8, 8)}
                          </span>
                        </div>

                        {contribBlock && (
                          <button
                            onClick={() =>
                              setSelectedProof({
                                block: contribBlock,
                                contribution: contrib,
                                campaign,
                              })
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 hover:bg-slate-850 transition-colors text-[11px] whitespace-nowrap"
                          >
                            Proof
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

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>FUNDCHAIN Verified Cryptographic Ledger</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
