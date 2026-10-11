import React, { useState, useMemo } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { Campaign, CampaignCategory, CampaignStatus } from '../types/blockchain';
import { formatINR, formatNumber, getDaysRemaining, truncateHash } from '../utils/formatters';
import {
  Search,
  Filter,
  ArrowUpDown,
  ShieldCheck,
  Users,
  Calendar,
  CheckCircle,
  ExternalLink,
  Heart,
  TrendingUp,
} from 'lucide-react';

const CATEGORIES: ('All' | CampaignCategory)[] = [
  'All',
  'Technology',
  'Education',
  'Healthcare',
  'Environment',
  'Social Impact',
  'Creative',
  'Business',
];

const STATUS_FILTERS: ('All' | CampaignStatus)[] = [
  'All',
  'Active',
  'Successfully Funded',
  'Completed',
];

type SortOption = 'progress' | 'contributors' | 'newest' | 'goal';

export const CampaignList: React.FC = () => {
  const { campaigns, setSelectedCampaignId, setContributeTargetCampaign, setSelectedProof, blocks } =
    useBlockchain();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | CampaignCategory>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | CampaignStatus>('All');
  const [sortBy, setSortBy] = useState<SortOption>('progress');

  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter((camp) => {
        // Search text matching
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          camp.title.toLowerCase().includes(q) ||
          camp.creator.toLowerCase().includes(q) ||
          camp.description.toLowerCase().includes(q) ||
          camp.beneficiary.toLowerCase().includes(q);

        // Category matching
        const matchesCategory =
          selectedCategory === 'All' || camp.category === selectedCategory;

        // Status matching
        const matchesStatus =
          selectedStatus === 'All' || camp.status === selectedStatus;

        return matchesQuery && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'progress') {
          const progressA = (a.raised / a.goal) * 100;
          const progressB = (b.raised / b.goal) * 100;
          return progressB - progressA;
        }
        if (sortBy === 'contributors') {
          return b.contributorCount - a.contributorCount;
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'goal') {
          return b.goal - a.goal;
        }
        return 0;
      });
  }, [campaigns, searchQuery, selectedCategory, selectedStatus, sortBy]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Campaign Discovery
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Discover verified crowdfunding initiatives anchored to the Genesis blockchain.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Showing <span className="text-cyan-400 font-semibold">{filteredCampaigns.length}</span> of {campaigns.length} initiatives
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by campaign title, creator, or beneficiary..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {STATUS_FILTERS.map((status) => (
                <option key={status} value={status}>
                  Status: {status}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Selector */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-500 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="progress">Sort: Funding Progress</option>
                <option value="contributors">Sort: Contributors Count</option>
                <option value="newest">Sort: Newest First</option>
                <option value="goal">Sort: Goal Size</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs (Zero-pill segmented buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap shrink-0 transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Campaign Cards Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <p className="text-slate-400 text-sm">No campaigns match your search criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedStatus('All');
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((camp) => {
            const progressPct = Math.min(100, Math.round((camp.raised / camp.goal) * 100));
            const deadlineInfo = getDaysRemaining(camp.deadline);
            const blockObj = blocks.find((b) => b.index === camp.blockIndex);

            return (
              <div
                key={camp.id}
                className="group flex flex-col justify-between rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90 transition-all p-5 shadow-sm hover:shadow-lg hover:shadow-cyan-950/20 relative"
              >
                {/* Header Information */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800/60">
                    <span className="font-medium text-slate-300">{camp.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px] text-cyan-400">
                      Block #{camp.blockIndex}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-medium ${
                        camp.status === 'Successfully Funded'
                          ? 'text-emerald-400'
                          : deadlineInfo.isExpired
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>

                  {/* Title & Creator */}
                  <div className="mt-3.5 space-y-1.5">
                    <div className="flex items-start gap-2.5">
                      <span className="text-2xl select-none" role="img" aria-label="icon">
                        {camp.imageEmoji || '🌱'}
                      </span>
                      <h3
                        onClick={() => setSelectedCampaignId(camp.id)}
                        className="text-base font-bold text-white group-hover:text-cyan-300 cursor-pointer transition-colors leading-snug line-clamp-2"
                      >
                        {camp.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400">
                      by <strong className="text-slate-300 font-medium">{camp.creator}</strong>
                    </p>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {camp.description}
                  </p>

                  {/* Trust Score & Beneficiary */}
                  <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Blockchain Trust Score:</span>
                      <span className="font-mono font-bold text-cyan-400 text-xs">
                        {camp.trustScore || 96}/100
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 truncate">
                      <strong className="text-slate-300">Beneficiary:</strong> {camp.beneficiary}
                    </div>
                  </div>
                </div>

                {/* Progress & Funding Section */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-baseline justify-between text-xs mb-1.5">
                      <span className="font-bold text-white font-mono tabular-nums text-sm">
                        {formatINR(camp.raised)}
                      </span>
                      <span className="text-slate-400 text-[11px] font-mono">
                        {progressPct}% of {formatINR(camp.goal)}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
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

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <div className="flex items-center gap-1 font-mono">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{camp.contributorCount} contributors</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{deadlineInfo.text}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => setContributeTargetCampaign(camp)}
                      className="w-full py-2 px-3 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>Contribute</span>
                    </button>

                    <button
                      onClick={() => setSelectedCampaignId(camp.id)}
                      className="w-full py-2 px-3 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg active:scale-95 transition-all text-center flex items-center justify-center gap-1"
                    >
                      <span>Ledger Proof</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
