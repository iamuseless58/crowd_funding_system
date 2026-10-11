import React, { useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { CampaignCategory, Block } from '../types/blockchain';
import { formatINR, truncateHash } from '../utils/formatters';
import { Plus, CheckCircle2, Shield, X, ArrowRight, Loader2, Sparkles, Copy, Check } from 'lucide-react';

const CATEGORIES: CampaignCategory[] = [
  'Technology',
  'Education',
  'Healthcare',
  'Environment',
  'Social Impact',
  'Creative',
  'Business',
];

const EMOJI_OPTIONS = ['☀️', '🎓', '🏥', '🌊', '⚡', '🌱', '🚀', '💡', '🤖', '🌍'];

export const CreateCampaignModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { createCampaign, setSelectedProof, setActiveTab } = useBlockchain();

  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CampaignCategory>('Technology');
  const [goal, setGoal] = useState<string>('250000');
  const [minimumContribution, setMinimumContribution] = useState<string>('500');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [beneficiary, setBeneficiary] = useState('');
  const [purpose, setPurpose] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🚀');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creationReceipt, setCreationReceipt] = useState<{
    block: Block;
    campaignId: string;
    title: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !creator.trim() || !goal) return;

    setIsSubmitting(true);
    try {
      const numericGoal = parseFloat(goal) || 100000;
      const numericMin = parseFloat(minimumContribution) || 100;

      const { campaign, block } = await createCampaign({
        title: title.trim(),
        creator: creator.trim(),
        description: description.trim(),
        category,
        goal: numericGoal,
        minimumContribution: numericMin,
        deadline: new Date(deadline).toISOString(),
        beneficiary: beneficiary.trim() || `${creator.trim()} Community Program`,
        purpose: purpose.trim() || 'Direct equipment procurement and operational milestone implementation',
        imageEmoji: selectedEmoji,
      });

      setCreationReceipt({
        block,
        campaignId: campaign.id,
        title: campaign.title,
      });
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
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create Crowdfunding Campaign</h2>
              <p className="text-xs text-slate-400">
                Instantly registered onto the FUNDCHAIN ledger with a dedicated Genesis-linked block.
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

        {/* Confirmation Receipt View */}
        {creationReceipt ? (
          <div className="p-6 space-y-6">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-emerald-200">
                  Campaign Block Mined Successfully!
                </h4>
                <p className="text-xs text-emerald-300/80 leading-relaxed">
                  Your initiative <strong className="text-white">"{creationReceipt.title}"</strong> has been permanently inscribed in Block #{creationReceipt.block.index} with verified cryptographic hash.
                </p>
              </div>
            </div>

            {/* Cryptographic Ledger Summary */}
            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-slate-400">
                <span>Block Number</span>
                <span className="text-cyan-400 font-bold">#{creationReceipt.block.index}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-slate-400">
                <span>Block Type</span>
                <span className="text-slate-200">CAMPAIGN_CREATION</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-slate-400">
                <span>Previous Block Hash</span>
                <span className="text-slate-300">{truncateHash(creationReceipt.block.previousHash, 8, 8)}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Current SHA-256 Hash:</span>
                  <button
                    onClick={() => handleCopyHash(creationReceipt.block.hash)}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-cyan-300 text-[11px] break-all leading-normal select-all">
                  {creationReceipt.block.hash}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedProof({ block: creationReceipt.block });
                  onClose();
                }}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Inspect Proof
              </button>
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('explore');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>View in Discovery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Campaign Creation Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Title & Creator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Solar Kits for Rural Communities"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Creator / Organization Name *</label>
                <input
                  type="text"
                  required
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  placeholder="e.g. Prakash Energy Trust"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Campaign Description *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the mission, problem statement, and why transparent funding is critical..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            {/* Category, Goal & Min Contribution */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CampaignCategory)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Funding Goal (₹ INR) *</label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={500}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="500000"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Min Contribution (₹) *</label>
                <input
                  type="number"
                  required
                  min={10}
                  step={50}
                  value={minimumContribution}
                  onChange={(e) => setMinimumContribution(e.target.value)}
                  placeholder="500"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            {/* Deadline & Emoji Icon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Campaign Deadline *</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Visual Emblem / Emoji</label>
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                        selectedEmoji === emoji
                          ? 'bg-cyan-500/30 border border-cyan-400 scale-110'
                          : 'bg-slate-950 border border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Beneficiary & Purpose Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Beneficiary Details *</label>
                <input
                  type="text"
                  required
                  value={beneficiary}
                  onChange={(e) => setBeneficiary(e.target.value)}
                  placeholder="e.g. 120 rural village families in Gadchiroli"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Purpose of Funding *</label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Solar panels, batteries & certified LED modules"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Immutability Notice */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
              <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                By creating this campaign, an immutable block will be mined on the FundChain ledger with deterministic SHA-256 calculation.
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
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-lg disabled:opacity-50 transition-all shadow-md shadow-cyan-500/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mining Block...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Create & Mine Block</span>
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
