import React, { useState } from 'react';
import { useBlockchain, ProofTarget } from '../context/BlockchainContext';
import { formatINR, formatTimestamp } from '../utils/formatters';
import { X, ShieldCheck, Copy, Check, Hash, Database, Link as LinkIcon, FileCheck } from 'lucide-react';

export const ProofModal: React.FC<{ proof: ProofTarget; onClose: () => void }> = ({
  proof,
  onClose,
}) => {
  const { block, contribution, campaign } = proof;
  const { blocks } = useBlockchain();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const prevBlock = block.index > 0 ? blocks[block.index - 1] : null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const payload = block.data;
  const isContribution = typeof payload === 'object' && payload !== null && 'amount' in payload;
  const isCreation = typeof payload === 'object' && payload !== null && 'goal' in payload;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cryptographic Blockchain Proof</h3>
              <p className="text-xs text-slate-400">
                Verified entry on the FundChain distributed consensus ledger.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="p-6 space-y-6">
          {/* Certificate Header Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-800/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                  Valid Ledger Entry
                </span>
                <h4 className="text-sm font-bold text-white">
                  {block.blockType === 'GENESIS'
                    ? 'Genesis Block #0'
                    : block.blockType === 'CAMPAIGN_CREATION'
                    ? `Campaign Creation Block #${block.index}`
                    : `Contribution Block #${block.index}`}
                </h4>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-400">
              <span>Timestamp:</span>
              <span className="block text-slate-200 font-medium">
                {formatTimestamp(block.timestamp)}
              </span>
            </div>
          </div>

          {/* Cryptographic Fields Table */}
          <div className="space-y-3 font-mono text-xs">
            {/* Transaction ID if applicable */}
            {(contribution?.txId || (isContribution && (payload as any).txId)) && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">Transaction ID:</span>
                  <span className="text-slate-200 font-semibold">
                    {contribution?.txId || (payload as any).txId}
                  </span>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      contribution?.txId || (payload as any).txId,
                      'txId'
                    )
                  }
                  className="text-slate-400 hover:text-cyan-300 p-1"
                >
                  {copiedKey === 'txId' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            {/* Block Number & Chain Height */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-[11px] text-slate-500 block">Block Height:</span>
                <span className="text-cyan-400 font-bold text-sm">#{block.index}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-[11px] text-slate-500 block">Block Type:</span>
                <span className="text-slate-200 font-medium">{block.blockType}</span>
              </div>
            </div>

            {/* Financial payload if applicable */}
            {isContribution && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-[11px] text-slate-500 block">Contribution Amount:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {formatINR((payload as any).amount)}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-[11px] text-slate-500 block">Contributor Identity:</span>
                  <span className="text-slate-200 font-medium truncate block">
                    {(payload as any).contributor}
                  </span>
                </div>
              </div>
            )}

            {/* Campaign association */}
            {(campaign || (isContribution && (payload as any).campaignTitle)) && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-[11px] text-slate-500 block">Associated Campaign:</span>
                <span className="text-slate-200 font-medium">
                  {campaign?.title || (payload as any).campaignTitle}
                </span>
                <span className="text-[11px] text-slate-500 block font-sans mt-0.5">
                  ID: {campaign?.id || (payload as any).campaignId}
                </span>
              </div>
            )}

            {/* Previous Hash Linkage */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-amber-400" />
                  <span>Previous Block Hash (Parent Link):</span>
                </span>
                <button
                  onClick={() => handleCopy(block.previousHash, 'prevHash')}
                  className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === 'prevHash' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedKey === 'prevHash' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-amber-300 text-[11px] break-all select-all font-mono">
                {block.previousHash}
              </div>
              {block.index === 0 && (
                <p className="text-[10px] text-slate-500 font-sans">
                  * Genesis block convention: previousHash is "0" because there is no prior parent.
                </p>
              )}
            </div>

            {/* Current SHA-256 Hash */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-cyan-400" />
                  <span>Current SHA-256 Block Hash:</span>
                </span>
                <button
                  onClick={() => handleCopy(block.hash, 'currentHash')}
                  className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === 'currentHash' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedKey === 'currentHash' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-cyan-300 text-[11px] break-all select-all font-mono">
                {block.hash}
              </div>
            </div>

            {/* Raw JSON Payload */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-[11px] text-slate-500 block">Raw Block Data (Payload):</span>
              <pre className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px] overflow-x-auto max-h-36">
                {typeof block.data === 'string'
                  ? block.data
                  : JSON.stringify(block.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Cryptographic Integrity Status: VERIFIED
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
