import React from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { formatINR, formatNumber, truncateHash } from '../utils/formatters';
import { Shield, ArrowRight, Plus, Box, Link as LinkIcon, Database, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveTab, campaigns, contributions, blocks, validationReport, setSelectedProof } = useBlockchain();

  const totalFunds = campaigns.reduce((acc, c) => acc + c.raised, 0);
  const totalContributors = contributions.length;
  const totalBlocks = blocks.length;
  const genesisBlock = blocks[0];

  return (
    <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900/40 via-slate-950 to-slate-950">
      {/* Background subtle cryptographic grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-medium">Genesis Ledger Active</span>
              <span className="text-slate-500">·</span>
              <span className="font-mono text-cyan-400">SHA-256 Verified</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.12]">
              Fund Ideas.{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                Verify Every Transaction.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Transparent crowdfunding powered by blockchain. Every single rupee donated is permanently recorded in an immutable ledger with previous-hash cryptographic proofs, tamper detection, and public verifiable history.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('explore')}
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all whitespace-nowrap"
              >
                <span>Explore Campaigns</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('create')}
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl active:scale-95 transition-all whitespace-nowrap"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Create Campaign</span>
              </button>

              <button
                onClick={() => setActiveTab('explorer')}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-900/60 rounded-xl transition-all whitespace-nowrap"
              >
                <Box className="w-4 h-4" />
                <span>Blockchain Explorer</span>
              </button>
            </div>

            {/* Educational Genesis Block Callout Card */}
            {genesisBlock && (
              <div className="pt-4">
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 font-mono text-[11px] font-semibold border border-cyan-800/50">
                        Block #0
                      </span>
                      <span className="font-semibold text-white">Genesis Block</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400 text-[11px]">The Immutable Root</span>
                    </div>
                    <button
                      onClick={() => setSelectedProof({ block: genesisBlock })}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium"
                    >
                      Inspect Root
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/60">
                    <div>
                      <span className="text-slate-500">Prev Hash:</span>{' '}
                      <span className="text-amber-400 font-bold">{genesisBlock.previousHash}</span>{' '}
                      <span className="text-[10px] text-slate-500">(No previous block)</span>
                    </div>
                    <div>
                      <span className="text-slate-500">SHA-256:</span>{' '}
                      <span className="text-cyan-300 font-semibold">{truncateHash(genesisBlock.hash, 8, 8)}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    💡 <strong className="text-slate-300">Genesis Concept:</strong> The Genesis Block is the first block in the blockchain and has no previous block (<code className="text-amber-400">previousHash = "0"</code>). All subsequent donation blocks link back to this cryptographic anchor.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Web3 Chain Visualization */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 p-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-200">Live Chain Sequence</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {blocks.length} Blocks Mined
                </span>
              </div>

              {/* Stacked mini visual blocks */}
              <div className="mt-4 space-y-3">
                {blocks.slice(-3).reverse().map((block, idx) => (
                  <div
                    key={block.index}
                    onClick={() => setSelectedProof({ block })}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:translate-x-1 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-400 font-bold">#{block.index}</span>
                        <span className="font-medium text-slate-200 text-xs">
                          {block.blockType === 'GENESIS'
                            ? 'Genesis Anchor'
                            : block.blockType === 'CAMPAIGN_CREATION'
                            ? 'Campaign Created'
                            : 'Contribution Mined'}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    </div>

                    <div className="mt-2 text-[10px] font-mono text-slate-400 space-y-0.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Hash:</span>
                        <span className="text-slate-300 font-semibold">{truncateHash(block.hash, 8, 8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Prev:</span>
                        <span className="text-slate-400">{truncateHash(block.previousHash, 8, 8)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick interactive links */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => setActiveTab('security')}
                  className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 text-[11px]"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Test Security Lab</span>
                </button>
                <button
                  onClick={() => setActiveTab('explorer')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 text-[11px]"
                >
                  <span>Full Ledger ({blocks.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Real Quantitative Stats Grid (Adjacent to hero claim) */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 block font-medium">Total Campaigns</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums mt-1 block">
              {formatNumber(campaigns.length)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Active & Verified Projects</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 block font-medium">Total Funds Raised</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono tabular-nums mt-1 block">
              {formatINR(totalFunds)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">100% on-chain transparency</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 block font-medium">Total Contributors</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums mt-1 block">
              {formatNumber(totalContributors)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Verified micro-donations</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-xs text-slate-400 block font-medium">Blockchain Blocks</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums mt-1 block">
              {formatNumber(totalBlocks)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">From Genesis (#0) to Head</span>
          </div>
        </div>
      </div>
    </div>
  );
};
