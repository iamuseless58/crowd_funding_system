# FUNDCHAIN – Transparent Blockchain Crowdfunding Platform

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8.svg)](https://tailwindcss.com/)

FUNDCHAIN is a decentralized, transparent crowdfunding platform built on an immutable blockchain ledger using real SHA-256 cryptography and a foundational **Genesis Block (Block #0)**. Every campaign creation and backer contribution is recorded as a cryptographically signed block with previous-hash pointers, tamper detection, and public verifiable history.

---

## Key Features

### 1. Cryptographic Genesis Block & Blockchain Architecture
- **Real Genesis Block (Block #0)**: Initializes with `index = 0`, `previousHash = "0"`, `timestamp`, and `data = "FUNDCHAIN Genesis Block"`.
- **Deterministic SHA-256 Hashing**: Powered by the native browser **Web Crypto API** (`crypto.subtle.digest('SHA-256', ...)`).
- **Previous-Hash Linkage**: Each block strictly points to its predecessor's SHA-256 hash, forming an immutable parent-child dependency graph.
- **Persistent Ledger**: Automatic local browser storage synchronization (`localStorage`) with a safe one-click demo reset.

### 2. Campaign Discovery & Marketplace
- **Curated Initiatives**: Discover campaigns across Technology, Education, Healthcare, Environment, Social Impact, Creative, and Business sectors.
- **Search & Filters**: Real-time filtering by category, funding status (Active, Successfully Funded, Completed), and multi-criteria sorting (progress %, backer count, newest, goal).
- **Transparent Progress**: Live tracking of funding goals, funds raised, backer counts, and deadlines.

### 3. Campaign Creation & On-Chain Inscription
- **Interactive Creation**: Creators define their mission, beneficiary details, purpose of capital, goal in INR (₹), minimum contribution, and deadline.
- **On-Chain Mining**: Creating a campaign instantly computes a dedicated `CAMPAIGN_CREATION` block linked to the latest ledger state and generates a transaction receipt.

### 4. Transparent Contribution System
- **Micro-Donations**: Backers enter custom contribution amounts (with quick selectors: ₹500, ₹1k, ₹5k, ₹10k, ₹25k) with optional anonymous mode and encouragement messages.
- **Atomic Ledger Updates**: Adds a `CONTRIBUTION` block to the chain, linking back to the campaign and updating funding totals.
- **Transaction Receipt**: Instant receipt generation with transaction ID, block height, previous hash, and full copyable 64-character SHA-256 digest.

### 5. Blockchain Proof & Trust Score
- **Cryptographic Proof Modal**: Every transaction and campaign provides a "View Blockchain Proof" dialog detailing:
  - Transaction ID
  - Block Height & Timestamp
  - Previous Block Hash
  - Current Block Hash
  - Raw Block Payload (JSON)
- **Campaign Trust Score (e.g. 96/100)**: Dynamically calculated based on cryptographic chain validity, transaction count, beneficiary transparency, and milestone progress.

### 6. Blockchain Explorer
- **Interactive Visual Chain**: Linear graph from Block #0 (Genesis Root) to the latest block head.
- **Search & Type Filters**: Filter blocks by type (Genesis, Campaign Creation, Contribution) or search by block number, hash, or contributor name.
- **Deep Inspector**: Expandable inspection view for raw block data, parent linkages, and payload decoders.

### 7. Blockchain Security Lab (Tamper Detection Demonstration)
- **Simulate Malicious Tampering**: Select any non-genesis block and alter contribution amounts, donor names, or messages.
- **Real-Time Cascading Invalidation**: Demonstrates the avalanche effect—changing block data changes its hash, breaking the next block's `previousHash` link and invalidating subsequent blocks.
- **Zero-Trust Verification**: Displays exact violation details (`HASH_MISMATCH`, `PREVIOUS_HASH_MISMATCH`) and affected block indices.
- **One-Click Restoration**: Reverts malicious modifications back to original authentic values and restores 100% cryptographic integrity.

### 8. Funding Analytics & Contributor Portfolio
- **Capital Allocation**: Visual charts breaking down capital raised by category and sector.
- **Performance KPIs**: Total funds raised, average donation size, total contributors, and consensus depth.
- **Contributor Portfolio**: Personalized dashboard showing campaigns supported, active vs. funded milestones, and personal on-chain contribution certificates.

### 9. Educational Fundamentals & Avalanche Playground
- **Visual Concepts**: Interactive architectural explanations of the Genesis Block, parent pointers, SHA-256 properties, and consensus immutability.
- **Live SHA-256 Playground**: Type any string and observe real-time recalculation of the 256-bit hash, demonstrating the cryptographic avalanche effect.

---

## Tech Stack

- **Framework**: React 19 (TypeScript)
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4
- **Cryptography**: Web Crypto API (`crypto.subtle`) with pure JS RFC 6234 fallback
- **Icons**: Lucide React
- **Persistence**: Browser LocalStorage

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

# Install dependencies
npm install

# Start the local development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Production Build

```bash
# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## Cryptographic Structure

### Block Schema

```typescript
interface Block {
  index: number;                    // 0 for Genesis block
  timestamp: string;                // ISO 8601 UTC timestamp
  data: BlockPayload;               // Transaction data (Genesis, Campaign, or Contribution)
  previousHash: string;             // Hash of preceding block ("0" for Genesis)
  hash: string;                     // Deterministic SHA-256 digest
  nonce: number;                    // Mining nonce (0 for standard ledger blocks)
  blockType: BlockType;             // 'GENESIS' | 'CAMPAIGN_CREATION' | 'CONTRIBUTION'
}
```

### Deterministic Hash Formula

$$\text{Hash} = \text{SHA-256}(\text{index} \parallel \text{timestamp} \parallel \text{JSON.stringify}(\text{data}) \parallel \text{previousHash} \parallel \text{nonce})$$

---

## License

This project is licensed under the Apache 2.0 License.
