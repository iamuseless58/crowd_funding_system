import React, { useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { Block, BlockType } from '../types/blockchain';
import { formatTimestamp, truncateHash, formatINR } from '../utils/formatters';
import {
  Box,
  Search,
  Filter,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Database,
  Hash,
  Link as LinkIcon,
  HelpCircle,
} from 'lucide-react';

export const BlockchainExplorer: React.FC = () => {
  const { blocks, validationReport, setSelectedProof, campaigns } = useBlockchain();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | BlockType>('ALL');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const filteredBlocks = blocks.filter((b) => {
    // Type filter
    if (selectedType !== 'ALL' && b.blockType !== selectedType) return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();

    const matchesIndex = String(b.index) === q || `#${b.index}` === q;
    const matchesHash = b.hash.toLowerCase().includes(q) || b.previousHash.toLowerCase().includes(q);
    const serialized = JSON.stringify(b.data).toLowerCase();
    const matchesData = serialized.includes(q);

    return matchesIndex || matchesHash || matchesData;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Genesis Tooltip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Blockchain Ledger Explorer
            </h2>
            <div className="relative group">
              <HelpCircle className="w-4 h-4 text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-72 p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 shadow-2xl z-20 leading-relaxed">
                <strong className="text-cyan-300 block mb-1">Genesis Block Rule:</strong>
                The Genesis Block is the first block in the blockchain and has no previous block (previousHash = "0"). Every subsequent transaction cryptographically chains back to this root.
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time visual inspection of all {blocks.length} blocks with cryptographic proof hashes.
          </p>
        </div>

        {/* Global Block Count Metric */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">LATEST BLOCK HEIGHT</span>
            <span className="text-cyan-400 font-bold text-sm">#{blocks.length - 1}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">CONSENSUS STATUS</span>
            <span
              className={`font-bold text-sm ${
                validationReport?.isValid ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {validationReport?.isValid ? '100% VALID' : 'TAMPER DETECTED'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by block #, SHA-256 hash substring, or contributor..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto text-xs">
          {(['ALL', 'GENESIS', 'CAMPAIGN_CREATION', 'CONTRIBUTION'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                selectedType === type
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {type === 'ALL'
                ? 'All Blocks'
                : type === 'GENESIS'
                ? 'Genesis'
                : type === 'CAMPAIGN_CREATION'
                ? 'Campaigns'
                : 'Donations'}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Linear Blockchain Graph */}
      <div className="space-y-4">
        {filteredBlocks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
            No blocks found matching "{searchQuery}".
          </div>
        ) : (
          filteredBlocks.map((block, idx) => {
            const isGenesis = block.index === 0;
            const isExpanded = expandedIndex === block.index;
            const isTampered = !!block.isTampered;
            const payload = block.data;

            const isDonation =
              typeof payload === 'object' && payload !== null && 'amount' in payload;
            const isCampaign =
              typeof payload === 'object' && payload !== null && 'goal' in payload;

            return (
              <div key={block.index} className="relative">
                {/* Visual cryptographic chain link line to previous block */}
                {idx > 0 && (
                  <div className="flex items-center justify-center py-1">
                    <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[10px]">
                      <span className="w-px h-6 bg-slate-800" />
                      <ArrowDown className="w-3.5 h-3.5 text-cyan-500/60" />
                      <span className="w-px h-6 bg-slate-800" />
                    </div>
                  </div>
                )}

                {/* Block Card Container */}
                <div
                  className={`rounded-2xl transition-all border ${
                    isTampered
                      ? 'bg-rose-950/40 border-rose-800 shadow-lg shadow-rose-950/30'
                      : isGenesis
                      ? 'bg-gradient-to-r from-cyan-950/30 via-slate-900 to-indigo-950/30 border-cyan-800/60'
                      : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Block Header Row */}
                  <div
                    onClick={() => toggleExpand(block.index)}
                    className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    {/* Left: Index & Type Indicator */}
                    <div className="flex items-start sm:items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${
                          isTampered
                            ? 'bg-rose-900/60 text-rose-300 border-rose-700'
                            : isGenesis
                            ? 'bg-cyan-900/50 text-cyan-300 border-cyan-700'
                            : 'bg-slate-950 text-slate-200 border-slate-800'
                        }`}
                      >
                        #{block.index}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {isGenesis
                              ? 'Genesis Block'
                              : block.blockType === 'CAMPAIGN_CREATION'
                              ? 'Campaign Created'
                              : 'Donation Contribution'}
                          </span>

                          {isGenesis && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                              ROOT ANCHOR
                            </span>
                          )}

                          {isTampered && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1 animate-pulse">
                              <AlertTriangle className="w-3 h-3" />
                              TAMPERED
                            </span>
                          )}
                        </div>

                        {/* Summary caption */}
                        <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                          <span>{formatTimestamp(block.timestamp)}</span>
                          <span aria-hidden="true">·</span>

                          {isGenesis && (
                            <span className="text-cyan-300">"FUNDCHAIN Genesis Block"</span>
                          )}

                          {isDonation && (
                            <span>
                              <strong className="text-white font-mono">{formatINR((payload as any).amount)}</strong> by{' '}
                              <span className="text-slate-300">{(payload as any).contributor}</span>
                            </span>
                          )}

                          {isCampaign && (
                            <span>
                              Goal <strong className="text-white font-mono">{formatINR((payload as any).goal)}</strong> for{' '}
                              <span className="text-slate-300 truncate max-w-xs inline-block align-bottom">
                                {(payload as any).title}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Hashes & Expand Icon */}
                    <div className="flex items-center justify-between md:justify-end gap-4 text-xs font-mono shrink-0">
                      <div className="text-left md:text-right space-y-0.5">
                        <div className="text-[11px] text-slate-400">
                          <span className="text-slate-500">Hash: </span>
                          <span className="text-cyan-400 font-semibold">
                            {truncateHash(block.hash, 8, 8)}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          <span>Prev: </span>
                          <span className="text-slate-400">
                            {truncateHash(block.previousHash, 8, 8)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProof({ block });
                          }}
                          className="px-2.5 py-1 text-xs text-cyan-400 hover:text-cyan-300 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span>Proof</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>

                        <div className="p-1 text-slate-500">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-300" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detailed Cryptographic View */}
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-4 text-xs font-mono">
                      {/* Genesis Educational note */}
                      {isGenesis && (
                        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 font-sans text-xs text-cyan-200">
                          💡 <strong>Genesis Block Property:</strong> Has index = 0, previousHash = "0", data = "FUNDCHAIN Genesis Block". It has no preceding block, acting as the root cryptographic state of the entire crowdfunding network.
                        </div>
                      )}

                      {/* Hash Comparison Table */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                          <div className="flex justify-between items-center text-slate-500 text-[11px]">
                            <span className="flex items-center gap-1">
                              <LinkIcon className="w-3 h-3 text-amber-400" />
                              <span>Previous Hash (Parent Pointer):</span>
                            </span>
                            <button
                              onClick={() => handleCopy(block.previousHash)}
                              className="text-slate-400 hover:text-white"
                            >
                              {copiedHash === block.previousHash ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <p className="text-[11px] text-amber-300 break-all select-all font-mono">
                            {block.previousHash}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                          <div className="flex justify-between items-center text-slate-500 text-[11px]">
                            <span className="flex items-center gap-1">
                              <Hash className="w-3 h-3 text-cyan-400" />
                              <span>Current SHA-256 Hash:</span>
                            </span>
                            <button
                              onClick={() => handleCopy(block.hash)}
                              className="text-slate-400 hover:text-white"
                            >
                              {copiedHash === block.hash ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <p className="text-[11px] text-cyan-300 break-all select-all font-mono">
                            {block.hash}
                          </p>
                        </div>
                      </div>

                      {/* Raw Payload JSON Viewer */}
                      <div className="space-y-1">
                        <div className="text-slate-400 text-[11px]">Decoded Block Payload Data:</div>
                        <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] overflow-x-auto max-h-48 leading-relaxed">
                          {typeof block.data === 'string'
                            ? block.data
                            : JSON.stringify(block.data, null, 2)}
                        </pre>
                      </div>

                      {/* Associated Campaign link if any */}
                      {isDonation && (
                        <div className="flex items-center justify-between text-xs text-slate-400 font-sans pt-1">
                          <span>
                            Campaign:{' '}
                            <strong className="text-white">
                              {(payload as any).campaignTitle}
                            </strong>
                          </span>
                          <span className="font-mono text-emerald-400 font-bold">
                            {formatINR((payload as any).amount)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
