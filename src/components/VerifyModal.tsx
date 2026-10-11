import React, { useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { formatTimestamp, truncateHash } from '../utils/formatters';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Activity,
  Check,
} from 'lucide-react';

export const VerifyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { verifyBlockchain, validationReport, isValidating, blocks } = useBlockchain();
  const [hasRunAudit, setHasRunAudit] = useState(false);

  const handleRunVerify = async () => {
    await verifyBlockchain();
    setHasRunAudit(true);
  };

  const isHealthy = validationReport ? validationReport.isValid : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isHealthy
                  ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                  : 'bg-rose-950 border border-rose-800 text-rose-400'
              }`}
            >
              {isHealthy ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Full Blockchain Ledger Verification</h3>
              <p className="text-xs text-slate-400">
                Cryptographic audit recalculating all SHA-256 hashes & parent links.
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

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Action Trigger Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                Zero-Trust Audit Engine
              </span>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Recalculates every SHA-256 hash using the Web Crypto API, verifies Genesis root invariants, and checks parent linkages.
              </p>
            </div>
            <button
              onClick={handleRunVerify}
              disabled={isValidating}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 shrink-0 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} />
              <span>{isValidating ? 'Recalculating Hashes...' : 'VERIFY BLOCKCHAIN'}</span>
            </button>
          </div>

          {/* Audit Status Display */}
          <div
            className={`p-5 rounded-2xl border ${
              isHealthy
                ? 'bg-emerald-950/30 border-emerald-800/80'
                : 'bg-rose-950/30 border-rose-800/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isHealthy
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                    : 'bg-rose-900/60 text-rose-300 border border-rose-700'
                }`}
              >
                {isHealthy ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                )}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {isHealthy
                    ? '✓ Blockchain Integrity Verified'
                    : '⚠ Blockchain Tampering Detected'}
                </h4>
                <p className="text-xs text-slate-300">
                  {isHealthy
                    ? 'All blocks in the chain match their cryptographic hashes and parent pointers.'
                    : `Discrepancy identified! First broken invariant detected at Block #${validationReport?.firstBrokenIndex}.`}
                </p>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="mt-5 grid grid-cols-4 gap-2 font-mono text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">TOTAL BLOCKS</span>
                <span className="text-white font-bold text-sm">
                  {validationReport?.totalBlocks ?? blocks.length}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">VALID BLOCKS</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {validationReport?.validBlocks ?? blocks.length}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">INVALID</span>
                <span
                  className={`font-bold text-sm ${
                    (validationReport?.invalidBlocks || 0) > 0
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}
                >
                  {validationReport?.invalidBlocks ?? 0}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">INTEGRITY</span>
                <span
                  className={`font-bold text-sm ${
                    isHealthy ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isHealthy
                    ? '100%'
                    : `${Math.round(
                        ((validationReport?.validBlocks || 0) /
                          (validationReport?.totalBlocks || 1)) *
                          100
                      )}%`}
                </span>
              </div>
            </div>
          </div>

          {/* Block-by-block audit trail */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Cryptographic Invariant Check Log:
            </h5>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {blocks.map((b) => {
                const isTampered = !!b.isTampered;
                return (
                  <div
                    key={b.index}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
                      isTampered
                        ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                        : 'bg-slate-950 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">Block #{b.index}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400 text-[11px]">{b.blockType}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400">
                        {truncateHash(b.hash, 6, 6)}
                      </span>
                      {isTampered ? (
                        <span className="text-rose-400 font-bold flex items-center gap-1 text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>FAILED</span>
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                          <Check className="w-3.5 h-3.5" />
                          <span>PASSED</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
