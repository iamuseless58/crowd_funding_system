import React, { useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { Campaign, Block, Contribution } from '../types/blockchain';
import { formatINR, truncateHash } from '../utils/formatters';
import { Heart, X, CheckCircle2, Shield, Loader2, ArrowRight, Copy, Check, Sparkles } from 'lucide-react';

export const ContributeModal: React.FC<{ campaign: Campaign; onClose: () => void }> = ({
  campaign,
  onClose,
}) => {
  const { contributeToCampaign, setSelectedProof, setActiveTab } = useBlockchain();

  const [contributorName, setContributorName] = useState('Alex Sharma');
  const [amount, setAmount] = useState<string>('5000');
  const [message, setMessage] = useState('Proud to back transparent grassroots innovation!');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<{
    block: Block;
    contribution: Contribution;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const quickAmounts = [500, 1000, 2500, 5000, 10000, 25000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount < campaign.minimumContribution) {
      return;
    }

    setIsSubmitting(true);
    try {
      const finalName = isAnonymous ? 'Anonymous Contributor' : (contributorName.trim() || 'Anonymous Contributor');
      const res = await contributeToCampaign(
        campaign.id,
        finalName,
        numericAmount,
        message.trim()
      );

      setSuccessReceipt(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Contribute to Campaign</h2>
              <p className="text-xs text-slate-400 truncate max-w-xs">{campaign.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transaction Success View */}
        {successReceipt ? (
          <div className="p-6 space-y-6">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-emerald-200">
                  Blockchain Transaction Inscribed!
                </h4>
                <p className="text-xs text-emerald-300/80 leading-relaxed">
                  Your contribution of <strong className="text-white font-mono">{formatINR(successReceipt.contribution.amount)}</strong> was mined into Block #{successReceipt.block.index}.
                </p>
              </div>
            </div>

            {/* Cryptographic Transaction Receipt */}
            <div className="space-y-2.5 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
                <span>Transaction ID</span>
                <span className="text-slate-200">{successReceipt.contribution.txId}</span>
              </div>

              <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
                <span>Block Height</span>
                <span className="text-cyan-400 font-bold">#{successReceipt.block.index}</span>
              </div>

              <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
                <span>Contributor</span>
                <span className="text-white font-medium">{successReceipt.contribution.contributor}</span>
              </div>

              <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
                <span>Previous Hash</span>
                <span className="text-slate-400">{truncateHash(successReceipt.block.previousHash, 8, 8)}</span>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-slate-400">
                  <span>SHA-256 Block Hash:</span>
                  <button
                    onClick={() => handleCopyHash(successReceipt.block.hash)}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-cyan-300 text-[11px] break-all leading-normal select-all">
                  {successReceipt.block.hash}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedProof({
                    block: successReceipt.block,
                    contribution: successReceipt.contribution,
                    campaign,
                  });
                  onClose();
                }}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Inspect Proof
              </button>

              <button
                onClick={() => {
                  onClose();
                  setActiveTab('explorer');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 rounded-lg transition-all flex items-center gap-1.5"
              >
                <span>View in Explorer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Contribution Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Quick Amount Selector */}
            <div className="space-y-2">
              <label className="text-slate-300 font-medium flex items-center justify-between">
                <span>Contribution Amount (₹ INR) *</span>
                <span className="text-slate-400 font-normal">
                  Min: {formatINR(campaign.minimumContribution)}
                </span>
              </label>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min={campaign.minimumContribution}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-base font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(String(q))}
                    className={`py-1.5 px-2 rounded-lg font-mono text-[11px] border transition-colors ${
                      amount === String(q)
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    ₹{q >= 1000 ? `${q / 1000}k` : q}
                  </button>
                ))}
              </div>
            </div>

            {/* Contributor Name & Anonymous Toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium">Contributor Name</label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Donate Anonymously</span>
                </label>
              </div>

              <input
                type="text"
                disabled={isAnonymous}
                value={contributorName}
                onChange={(e) => setContributorName(e.target.value)}
                placeholder="Your full name or organization"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 disabled:opacity-40"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Encouraging Message (Optional)</label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave a word of encouragement for the creator and community..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            {/* Blockchain Transparency Notice */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                This transaction creates a dedicated block linked to the latest ledger block using SHA-256. Publicly auditable forever.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !parseFloat(amount)}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-lg disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mining Transaction...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>Confirm & Mine Block</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
