import React from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { formatINR, formatNumber, truncateHash } from '../utils/formatters';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Layers,
  Award,
  Users,
  Wallet,
  ArrowUpRight,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { campaigns, contributions, blocks } = useBlockchain();

  const totalFunds = campaigns.reduce((acc, c) => acc + c.raised, 0);
  const totalContributors = contributions.length;
  const avgContribution = totalContributors > 0 ? Math.round(totalFunds / totalContributors) : 0;

  // Most funded campaign
  const mostFunded = [...campaigns].sort((a, b) => b.raised - a.raised)[0];

  // Category breakdown
  const categoryMap: Record<string, { count: number; raised: number }> = {};
  campaigns.forEach((c) => {
    if (!categoryMap[c.category]) {
      categoryMap[c.category] = { count: 0, raised: 0 };
    }
    categoryMap[c.category].count += 1;
    categoryMap[c.category].raised += c.raised;
  });

  const categoryEntries = Object.entries(categoryMap).sort((a, b) => b[1].raised - a[1].raised);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Crowdfunding & Ledger Analytics
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Deep transparent intelligence derived directly from confirmed blockchain blocks.
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Capital Raised</span>
            <Wallet className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-2xl font-bold text-white font-mono tabular-nums block">
            {formatINR(totalFunds)}
          </span>
          <span className="text-[11px] text-slate-400 block font-mono">
            Across {campaigns.length} campaigns
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Average Contribution</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold text-emerald-400 font-mono tabular-nums block">
            {formatINR(avgContribution)}
          </span>
          <span className="text-[11px] text-slate-400 block font-mono">Per confirmed block</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Ledger Contributors</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl font-bold text-white font-mono tabular-nums block">
            {formatNumber(totalContributors)}
          </span>
          <span className="text-[11px] text-slate-400 block font-mono">100% uniquely identified</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Chain Consensus Depth</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-bold text-amber-300 font-mono tabular-nums block">
            {formatNumber(blocks.length)} Blocks
          </span>
          <span className="text-[11px] text-slate-400 block font-mono">Rooted at Genesis #0</span>
        </div>
      </div>

      {/* Grid: Category Distribution & Most Funded Feature */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Funding Breakdown Bar Visualizer */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Capital Allocation by Sector</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{categoryEntries.length} Sectors</span>
          </div>

          <div className="space-y-4">
            {categoryEntries.map(([cat, data]) => {
              const pct = totalFunds > 0 ? Math.round((data.raised / totalFunds) * 100) : 0;

              return (
                <div key={cat} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-baseline font-mono">
                    <span className="text-slate-300 font-sans font-medium">{cat}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">{data.count} campaigns</span>
                      <span className="text-white font-bold">{formatINR(data.raised)}</span>
                      <span className="text-cyan-400 text-[11px]">({pct}%)</span>
                    </div>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Funded Initiative Spotlight */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-amber-400 pb-3 border-b border-slate-800">
              <span className="font-semibold flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>Premier Initiative</span>
              </span>
              <span className="font-mono text-slate-400">Block #{mostFunded?.blockIndex}</span>
            </div>

            {mostFunded && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-2xl select-none">
                  {mostFunded.imageEmoji || '🌟'}
                </div>
                <h4 className="text-base font-bold text-white leading-snug">{mostFunded.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {mostFunded.description}
                </p>

                <div className="pt-3 border-t border-slate-800/80 space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Raised:</span>
                    <span className="text-emerald-400 font-bold">{formatINR(mostFunded.raised)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Goal:</span>
                    <span className="text-slate-200">{formatINR(mostFunded.goal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Backers:</span>
                    <span className="text-cyan-400 font-bold">{mostFunded.contributorCount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
            <span>TX Root: </span>
            <span className="text-cyan-300">{truncateHash(mostFunded?.txHash || '', 10, 10)}</span>
          </div>
        </div>
      </div>

      {/* Recent Blockchain Activity Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Recent On-Chain Contribution Activity</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {contributions.length} total logged events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-3 font-semibold">BLOCK #</th>
                <th className="pb-3 font-semibold">TRANSACTION ID</th>
                <th className="pb-3 font-semibold">CAMPAIGN</th>
                <th className="pb-3 font-semibold">CONTRIBUTOR</th>
                <th className="pb-3 font-semibold text-right">AMOUNT (₹)</th>
                <th className="pb-3 font-semibold text-right">HASH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {contributions.slice(0, 8).map((c) => (
                <tr key={c.id} className="hover:bg-slate-950/60 transition-colors">
                  <td className="py-3 text-cyan-400 font-bold">#{c.blockIndex}</td>
                  <td className="py-3 text-slate-400">{c.txId}</td>
                  <td className="py-3 font-sans text-white max-w-xs truncate">{c.campaignTitle}</td>
                  <td className="py-3 font-sans text-slate-200">{c.contributor}</td>
                  <td className="py-3 text-right text-emerald-400 font-bold">{formatINR(c.amount)}</td>
                  <td className="py-3 text-right text-slate-400 text-[11px]">
                    {truncateHash(c.hash, 6, 6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
