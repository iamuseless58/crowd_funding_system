import React, { useState, useEffect } from 'react';
import { calculateSHA256 } from '../utils/crypto';
import { truncateHash } from '../utils/formatters';
import {
  Layers,
  Link as LinkIcon,
  Hash,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

export const EducationalPanel: React.FC = () => {
  const [inputText, setInputText] = useState('FUNDCHAIN Transparency');
  const [liveHash, setLiveHash] = useState('');
  const [activeConcept, setActiveConcept] = useState<number>(0);

  useEffect(() => {
    let active = true;
    calculateSHA256(inputText).then((hash) => {
      if (active) setLiveHash(hash);
    });
    return () => {
      active = false;
    };
  }, [inputText]);

  const concepts = [
    {
      title: '01. The Genesis Block Root',
      icon: Layers,
      highlight: 'previousHash = "0"',
      description:
        'The Genesis Block (Block #0) is the foundational cornerstone of the blockchain. Because it has no predecessor, its previousHash is hardcoded to "0". Every crowdfunding transaction that ever follows is cryptographically anchored to this root.',
    },
    {
      title: '02. Previous Hash Linkage',
      icon: LinkIcon,
      highlight: 'Parent Invariant',
      description:
        'Each block records the unique cryptographic hash of its predecessor. This creates a rigid linear dependency graph. An attacker cannot slip in a rogue block or reorder transactions without breaking this invariant.',
    },
    {
      title: '03. SHA-256 Cryptography',
      icon: Hash,
      highlight: 'Deterministic & One-Way',
      description:
        'Secure Hash Algorithm 256 generates a 64-character hexadecimal digest. It is mathematically impossible to reverse (one-way function) and exhibits the "avalanche effect"—altering a single comma changes the output entirely.',
    },
    {
      title: '04. Instant Tamper Detection',
      icon: ShieldCheck,
      highlight: 'Cascading Invalidation',
      description:
        'If a malicious actor alters a donation from ₹5,000 to ₹50,000 in Block #2, Block #2\'s hash changes. Immediately, Block #3 points to the old hash, throwing a verification error. The entire network detects the tampering instantly.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
          Blockchain Architecture Fundamentals
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          How Immutable Crowdfunding Works
        </h2>
        <p className="text-sm text-slate-400">
          Visualizing the cryptographic mechanisms that safeguard public donations.
        </p>
      </div>

      {/* Visual Chain Progression Diagram */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-3">
          <div className="flex-1 p-4 rounded-xl bg-slate-950 border border-cyan-800/80 space-y-1.5 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold text-[10px]">
              BLOCK #0
            </span>
            <div className="font-sans font-bold text-white text-sm">Genesis Block</div>
            <div className="text-[11px] text-slate-400">
              Prev Hash: <span className="text-amber-400 font-bold">"0"</span>
            </div>
            <div className="text-[11px] text-cyan-300 truncate">SHA-256 Anchor</div>
          </div>

          <div className="flex flex-col items-center justify-center text-cyan-500 px-1">
            <LinkIcon className="w-4 h-4 animate-pulse" />
            <ArrowRight className="w-4 h-4 -mt-1" />
          </div>

          <div className="flex-1 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-bold text-[10px]">
              BLOCK #1
            </span>
            <div className="font-sans font-bold text-white text-sm">Campaign Created</div>
            <div className="text-[11px] text-slate-400">
              Prev: <span className="text-amber-300 font-semibold">Block 0 Hash</span>
            </div>
            <div className="text-[11px] text-cyan-300 truncate">Payload: Goal & Beneficiary</div>
          </div>

          <div className="flex flex-col items-center justify-center text-cyan-500 px-1">
            <LinkIcon className="w-4 h-4" />
            <ArrowRight className="w-4 h-4 -mt-1" />
          </div>

          <div className="flex-1 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px]">
              BLOCK #2
            </span>
            <div className="font-sans font-bold text-white text-sm">Donation Recorded</div>
            <div className="text-[11px] text-slate-400">
              Prev: <span className="text-amber-300 font-semibold">Block 1 Hash</span>
            </div>
            <div className="text-[11px] text-emerald-400 truncate">Payload: Backer & ₹ Amount</div>
          </div>

          <div className="flex flex-col items-center justify-center text-cyan-500 px-1">
            <LinkIcon className="w-4 h-4" />
            <ArrowRight className="w-4 h-4 -mt-1" />
          </div>

          <div className="flex-1 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px]">
              BLOCK #3
            </span>
            <div className="font-sans font-bold text-white text-sm">Next Contribution</div>
            <div className="text-[11px] text-slate-400">
              Prev: <span className="text-amber-300 font-semibold">Block 2 Hash</span>
            </div>
            <div className="text-[11px] text-emerald-400 truncate">Payload: Backer & ₹ Amount</div>
          </div>
        </div>
      </div>

      {/* Interactive Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {concepts.map((concept, index) => {
          const Icon = concept.icon;
          return (
            <div
              key={index}
              onClick={() => setActiveConcept(index)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                activeConcept === index
                  ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-950/30'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 mb-3">
                <Icon className="w-4 h-4" />
              </div>

              <span className="text-[11px] font-mono text-cyan-400 font-semibold block mb-1">
                {concept.highlight}
              </span>
              <h3 className="text-sm font-bold text-white mb-2">{concept.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{concept.description}</p>
            </div>
          );
        })}
      </div>

      {/* Live Interactive SHA-256 Avalanche Simulator */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400">
          <Zap className="w-4 h-4" />
          <h3 className="text-sm font-bold text-white">Live SHA-256 Avalanche Effect Playground</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Type or modify anything below. Watch how modifying a single letter completely scrambles all 64 hexadecimal characters computed by the browser's Web Crypto API.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Raw Input Text Payload:</label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type any message..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="md:col-span-7 space-y-1">
            <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
              <span>Resulting 256-bit Hash:</span>
              <span className="text-cyan-400 font-semibold">{liveHash.length * 4} bits</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs break-all select-all leading-relaxed">
              {liveHash}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
