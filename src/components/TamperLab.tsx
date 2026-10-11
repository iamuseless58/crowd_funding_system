import React, { useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { formatINR, formatTimestamp, truncateHash } from '../utils/formatters';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  Database,
  Lock,
  Unlock,
  CheckCircle2,
  HelpCircle,
  Hash,
  Link2Off,
  Link as LinkIcon,
} from 'lucide-react';

export const TamperLab: React.FC = () => {
  const {
    blocks,
    simulateTamper,
    restoreBlock,
    restoreAllBlocks,
    validationReport,
    verifyBlockchain,
  } = useBlockchain();

  // Pick the first non-genesis donation block as default target
  const nonGenesisBlocks = blocks.filter((b) => b.index > 0);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>(
    nonGenesisBlocks.length > 0 ? nonGenesisBlocks[1]?.index || nonGenesisBlocks[0].index : 1
  );

  const [tamperAmount, setTamperAmount] = useState<string>('999999');
  const [tamperContributor, setTamperContributor] = useState<string>('Attacker (Modified)');
  const [tamperMessage, setTamperMessage] = useState<string>('Fraudulent data injection test');

  const targetBlock = blocks.find((b) => b.index === selectedBlockIndex) || blocks[1];
  const isTargetTampered = !!targetBlock?.isTampered;
  const isChainTampered = validationReport ? !validationReport.isValid : false;

  const handleSimulateTamper = async () => {
    if (!targetBlock) return;
    await simulateTamper(selectedBlockIndex, {
      amount: parseFloat(tamperAmount) || 999999,
      contributor: tamperContributor,
      message: tamperMessage,
    });
  };

  const handleRestore = async () => {
    if (!targetBlock) return;
    await restoreBlock(selectedBlockIndex);
  };

  const payload = targetBlock?.data;
  const isContribution =
    typeof payload === 'object' && payload !== null && 'amount' in payload;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Blockchain Security Lab
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-950/80 text-amber-300 border border-amber-800/80">
              Tamper Detection Simulation
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Test and prove the cryptographic immutability of the FundChain ledger. Modify any block's transaction payload and watch the SHA-256 cascade break downstream consensus in real-time.
          </p>
        </div>

        {/* Global Action to restore all */}
        {isChainTampered && (
          <button
            onClick={restoreAllBlocks}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800 rounded-xl transition-all self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Complete Chain</span>
          </button>
        )}
      </div>

      {/* Main Lab Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Tampering Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Target Block Selector */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Block to Attack
              </label>
              <span className="text-xs font-mono text-cyan-400">
                {nonGenesisBlocks.length} targetable blocks
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {nonGenesisBlocks.slice(0, 8).map((b) => {
                const isSelected = b.index === selectedBlockIndex;
                const isTampered = !!b.isTampered;

                return (
                  <button
                    key={b.index}
                    onClick={() => setSelectedBlockIndex(b.index)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs font-mono ${
                      isSelected
                        ? 'bg-cyan-950 border-cyan-500 text-white shadow-sm'
                        : isTampered
                        ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">#{b.index}</span>
                      {isTampered ? (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-700" />
                      )}
                    </div>
                    <span className="block text-[10px] truncate text-slate-500 mt-1">
                      {b.blockType === 'CAMPAIGN_CREATION' ? 'Campaign' : 'Donation'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Target Block Current Details */}
            {targetBlock && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Selected Block:</span>
                  <span className="text-cyan-400 font-bold">Block #{targetBlock.index}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Original Timestamp:</span>
                  <span className="text-slate-300 font-sans">{formatTimestamp(targetBlock.timestamp)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Status:</span>
                  <span className={isTargetTampered ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {isTargetTampered ? 'TAMPERED (MODIFIED)' : 'AUTHENTIC (VERIFIED)'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Tamper Form */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Zap className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">Modify Transaction Payload</h3>
            </div>
            <p className="text-xs text-slate-400">
              Change the values in this block to simulate a malicious database modification or man-in-the-middle attack:
            </p>

            <div className="space-y-3 text-xs">
              {isContribution ? (
                <>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Tampered Contribution Amount (₹)</label>
                    <input
                      type="number"
                      value={tamperAmount}
                      onChange={(e) => setTamperAmount(e.target.value)}
                      placeholder="999999"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[11px] text-slate-500 font-mono">
                      Current recorded: {formatINR((payload as any).amount)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Tampered Contributor Name</label>
                    <input
                      type="text"
                      value={tamperContributor}
                      onChange={(e) => setTamperContributor(e.target.value)}
                      placeholder="Attacker (Modified)"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Tampered Message</label>
                    <input
                      type="text"
                      value={tamperMessage}
                      onChange={(e) => setTamperMessage(e.target.value)}
                      placeholder="Fraudulent note"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </>
              ) : (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                  <p className="text-xs">
                    This block is a Campaign Creation block. Tampering will modify its campaign metadata.
                  </p>
                </div>
              )}
            </div>

            {/* Simulation Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSimulateTamper}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 rounded-xl transition-all shadow-md shadow-rose-950/40 flex items-center justify-center gap-2 active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>SIMULATE TAMPERING</span>
              </button>

              <button
                onClick={handleRestore}
                disabled={!isTargetTampered}
                className="py-2.5 px-4 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESTORE ORIGINAL DATA</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Diagnostic Impact Analysis */}
        <div className="lg:col-span-6 space-y-6">
          {/* Diagnostic Status Box */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              isChainTampered
                ? 'bg-rose-950/30 border-rose-800 shadow-2xl shadow-rose-950/30'
                : 'bg-emerald-950/30 border-emerald-800 shadow-2xl shadow-emerald-950/20'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                  isChainTampered
                    ? 'bg-rose-900/60 text-rose-300 border-rose-700'
                    : 'bg-emerald-900/60 text-emerald-300 border-emerald-700'
                }`}
              >
                {isChainTampered ? (
                  <ShieldAlert className="w-6 h-6" />
                ) : (
                  <ShieldCheck className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold block text-slate-400">
                  Cryptographic Audit State
                </span>
                <h3 className="text-lg font-bold text-white">
                  {isChainTampered
                    ? '⚠ Blockchain Tampering Detected'
                    : '✓ Blockchain Integrity Verified'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isChainTampered
                    ? `Consensus broken at Block #${validationReport?.firstBrokenIndex}. The recorded hash does not match recalculated SHA-256.`
                    : 'All blocks in the chain are cryptographically valid, linked by authentic previous-hashes back to the Genesis Block.'}
                </p>
              </div>
            </div>

            {/* Quantitative Audit breakdown */}
            <div className="mt-6 grid grid-cols-3 gap-3 font-mono text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">TOTAL BLOCKS</span>
                <span className="text-white font-bold text-sm">
                  {validationReport?.totalBlocks || blocks.length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">VALID BLOCKS</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {validationReport?.validBlocks || blocks.length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block">INVALID BLOCKS</span>
                <span
                  className={`font-bold text-sm ${
                    (validationReport?.invalidBlocks || 0) > 0
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}
                >
                  {validationReport?.invalidBlocks || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Educational Cryptographic Explanation Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Why Tampering Fails in Blockchain</span>
            </h4>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2.5 leading-relaxed font-sans">
              <p>
                "<strong>Changing blockchain data changes its hash.</strong> Because the next block stores the previous block's hash, altering even 1 byte invalidates all subsequent links in the chain."
              </p>

              <div className="pt-2 border-t border-slate-800 space-y-2 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2 text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>1. Block data modified in memory</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>2. SHA-256(Block #{selectedBlockIndex}) changes completely</span>
                </div>
                <div className="flex items-center gap-2 text-rose-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>3. Block #{selectedBlockIndex + 1}.previousHash !== new hash!</span>
                </div>
              </div>
            </div>

            {/* Error Log Viewer if tampered */}
            {validationReport && validationReport.errors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-rose-400 font-mono">
                  Ledger Verification Violations:
                </span>
                <div className="space-y-2">
                  {validationReport.errors.map((err, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-rose-950/40 border border-rose-900 text-xs text-rose-200 font-mono space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-rose-300">
                        <span>Block #{err.blockIndex}</span>
                        <span>{err.errorType}</span>
                      </div>
                      <p className="text-[11px] text-rose-300/80 leading-snug">{err.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
