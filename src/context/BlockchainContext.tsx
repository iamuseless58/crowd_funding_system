import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Block,
  Campaign,
  Contribution,
  BlockchainValidationReport,
  CampaignCategory,
  CampaignStatus,
} from '../types/blockchain';
import { Blockchain } from '../blockchain/Blockchain';
import { generateSeedData } from '../data/seedData';
import { calculateCampaignTrustScore } from '../utils/formatters';

const STORAGE_KEY_BLOCKS = 'fundchain_blocks_v2';
const STORAGE_KEY_CAMPAIGNS = 'fundchain_campaigns_v2';
const STORAGE_KEY_CONTRIBUTIONS = 'fundchain_contributions_v2';

export type NavigationTab =
  | 'home'
  | 'explore'
  | 'create'
  | 'explorer'
  | 'security'
  | 'analytics'
  | 'portfolio';

export interface ProofTarget {
  block: Block;
  contribution?: Contribution;
  campaign?: Campaign;
}

interface BlockchainContextType {
  // Navigation & UI state
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedCampaignId: string | null;
  setSelectedCampaignId: (id: string | null) => void;
  selectedProof: ProofTarget | null;
  setSelectedProof: (proof: ProofTarget | null) => void;
  contributeTargetCampaign: Campaign | null;
  setContributeTargetCampaign: (campaign: Campaign | null) => void;
  
  // Data
  blockchain: Blockchain;
  blocks: Block[];
  campaigns: Campaign[];
  contributions: Contribution[];
  validationReport: BlockchainValidationReport | null;
  isInitializing: boolean;
  isValidating: boolean;

  // Actions
  verifyBlockchain: () => Promise<BlockchainValidationReport>;
  createCampaign: (data: {
    title: string;
    creator: string;
    description: string;
    category: CampaignCategory;
    goal: number;
    minimumContribution: number;
    deadline: string;
    beneficiary: string;
    purpose: string;
    imageEmoji?: string;
  }) => Promise<{ campaign: Campaign; block: Block }>;
  contributeToCampaign: (
    campaignId: string,
    contributor: string,
    amount: number,
    message?: string
  ) => Promise<{ contribution: Contribution; block: Block }>;
  simulateTamper: (
    blockIndex: number,
    modifiedValues: { amount?: number; contributor?: string; message?: string; title?: string }
  ) => Promise<void>;
  restoreBlock: (blockIndex: number) => Promise<void>;
  restoreAllBlocks: () => Promise<void>;
  resetToDemo: () => Promise<void>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedProof, setSelectedProof] = useState<ProofTarget | null>(null);
  const [contributeTargetCampaign, setContributeTargetCampaign] = useState<Campaign | null>(null);

  const [blockchainInstance, setBlockchainInstance] = useState<Blockchain>(() => new Blockchain());
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [validationReport, setValidationReport] = useState<BlockchainValidationReport | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  // Load from localStorage or initialize with seed data
  const initializePlatform = useCallback(async () => {
    setIsInitializing(true);
    try {
      const storedBlocks = localStorage.getItem(STORAGE_KEY_BLOCKS);
      const storedCampaigns = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
      const storedContributions = localStorage.getItem(STORAGE_KEY_CONTRIBUTIONS);

      if (storedBlocks && storedCampaigns && storedContributions) {
        const parsedBlocks: Block[] = JSON.parse(storedBlocks);
        const parsedCampaigns: Campaign[] = JSON.parse(storedCampaigns);
        const parsedContributions: Contribution[] = JSON.parse(storedContributions);

        const chainObj = new Blockchain(parsedBlocks);
        setBlockchainInstance(chainObj);
        setBlocks(parsedBlocks);
        setCampaigns(parsedCampaigns);
        setContributions(parsedContributions);

        const initialReport = await chainObj.isChainValid();
        setValidationReport(initialReport);
      } else {
        // First boot: create Genesis block and seed realistic campaigns
        const seed = await generateSeedData();
        const chainObj = new Blockchain(seed.blocks);

        setBlockchainInstance(chainObj);
        setBlocks(seed.blocks);
        setCampaigns(seed.campaigns);
        setContributions(seed.contributions);

        localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(seed.blocks));
        localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(seed.campaigns));
        localStorage.setItem(STORAGE_KEY_CONTRIBUTIONS, JSON.stringify(seed.contributions));

        const initialReport = await chainObj.isChainValid();
        setValidationReport(initialReport);
      }
    } catch (err) {
      console.error('Failed to initialize FundChain ledger:', err);
      // Fallback clean generation
      const seed = await generateSeedData();
      const chainObj = new Blockchain(seed.blocks);
      setBlockchainInstance(chainObj);
      setBlocks(seed.blocks);
      setCampaigns(seed.campaigns);
      setContributions(seed.contributions);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    initializePlatform();
  }, [initializePlatform]);

  // Blockchain verification runner
  const verifyBlockchain = useCallback(async (): Promise<BlockchainValidationReport> => {
    setIsValidating(true);
    try {
      const report = await blockchainInstance.isChainValid();
      setValidationReport(report);
      return report;
    } finally {
      setIsValidating(false);
    }
  }, [blockchainInstance]);

  // Create Campaign Action
  const createCampaign = useCallback(
    async (formData: {
      title: string;
      creator: string;
      description: string;
      category: CampaignCategory;
      goal: number;
      minimumContribution: number;
      deadline: string;
      beneficiary: string;
      purpose: string;
      imageEmoji?: string;
    }): Promise<{ campaign: Campaign; block: Block }> => {
      const campaignId = `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const nowIso = new Date().toISOString();

      const blockPayload = {
        type: 'CAMPAIGN_CREATION' as const,
        campaignId,
        title: formData.title,
        creator: formData.creator,
        category: formData.category,
        goal: formData.goal,
        minimumContribution: formData.minimumContribution,
        beneficiary: formData.beneficiary,
        purpose: formData.purpose,
        timestamp: nowIso,
      };

      const newBlock = await blockchainInstance.addBlock(blockPayload, 'CAMPAIGN_CREATION');

      const newCampaign: Campaign = {
        id: campaignId,
        title: formData.title,
        creator: formData.creator,
        description: formData.description,
        category: formData.category,
        goal: formData.goal,
        raised: 0,
        contributorCount: 0,
        minimumContribution: formData.minimumContribution,
        deadline: formData.deadline,
        status: 'Active',
        beneficiary: formData.beneficiary,
        purpose: formData.purpose,
        blockIndex: newBlock.index,
        txHash: newBlock.hash,
        createdAt: nowIso,
        imageEmoji: formData.imageEmoji || '🚀',
        trustScore: calculateCampaignTrustScore(0, true, !!formData.beneficiary, 'Active'),
      };

      const updatedBlocks = [...blockchainInstance.chain];
      const updatedCampaigns = [newCampaign, ...campaigns];

      setBlocks(updatedBlocks);
      setCampaigns(updatedCampaigns);

      localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(updatedBlocks));
      localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(updatedCampaigns));

      const report = await blockchainInstance.isChainValid();
      setValidationReport(report);

      return { campaign: newCampaign, block: newBlock };
    },
    [blockchainInstance, campaigns]
  );

  // Contribute Action
  const contributeToCampaign = useCallback(
    async (
      campaignId: string,
      contributor: string,
      amount: number,
      message?: string
    ): Promise<{ contribution: Contribution; block: Block }> => {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) {
        throw new Error('Target campaign not found.');
      }
      if (amount < campaign.minimumContribution) {
        throw new Error(`Minimum contribution is ${campaign.minimumContribution}`);
      }

      const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const nowIso = new Date().toISOString();

      const payload = {
        type: 'CONTRIBUTION' as const,
        txId,
        campaignId,
        campaignTitle: campaign.title,
        contributor: contributor.trim() || 'Anonymous Supporter',
        amount,
        message: message?.trim() || '',
        timestamp: nowIso,
      };

      const newBlock = await blockchainInstance.addBlock(payload, 'CONTRIBUTION');

      const newContribution: Contribution = {
        id: `contrib_${Date.now()}`,
        txId,
        campaignId,
        campaignTitle: campaign.title,
        contributor: payload.contributor,
        amount,
        message: payload.message,
        timestamp: nowIso,
        blockIndex: newBlock.index,
        hash: newBlock.hash,
        previousHash: newBlock.previousHash,
      };

      const updatedRaised = campaign.raised + amount;
      let newStatus: CampaignStatus = campaign.status;
      if (updatedRaised >= campaign.goal) {
        newStatus = 'Successfully Funded';
      }

      const updatedCampaigns = campaigns.map(c => {
        if (c.id === campaignId) {
          const newContribCount = c.contributorCount + 1;
          return {
            ...c,
            raised: updatedRaised,
            contributorCount: newContribCount,
            status: newStatus,
            trustScore: calculateCampaignTrustScore(
              newContribCount,
              true,
              !!c.beneficiary,
              newStatus
            ),
          };
        }
        return c;
      });

      const updatedContributions = [newContribution, ...contributions];
      const updatedBlocks = [...blockchainInstance.chain];

      setBlocks(updatedBlocks);
      setCampaigns(updatedCampaigns);
      setContributions(updatedContributions);

      localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(updatedBlocks));
      localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(updatedCampaigns));
      localStorage.setItem(STORAGE_KEY_CONTRIBUTIONS, JSON.stringify(updatedContributions));

      const report = await blockchainInstance.isChainValid();
      setValidationReport(report);

      return { contribution: newContribution, block: newBlock };
    },
    [blockchainInstance, campaigns, contributions]
  );

  // Security Lab: Simulate Tampering
  const simulateTamper = useCallback(
    async (
      blockIndex: number,
      modifiedValues: { amount?: number; contributor?: string; message?: string; title?: string }
    ) => {
      const targetBlock = blockchainInstance.chain[blockIndex];
      if (!targetBlock) return;

      const currentData = JSON.parse(JSON.stringify(targetBlock.data));

      if (typeof currentData === 'object' && currentData !== null) {
        if ('amount' in currentData && modifiedValues.amount !== undefined) {
          currentData.amount = modifiedValues.amount;
        }
        if ('contributor' in currentData && modifiedValues.contributor !== undefined) {
          currentData.contributor = modifiedValues.contributor;
        }
        if ('message' in currentData && modifiedValues.message !== undefined) {
          currentData.message = modifiedValues.message;
        }
        if ('title' in currentData && modifiedValues.title !== undefined) {
          currentData.title = modifiedValues.title;
        }
      }

      await blockchainInstance.tamperBlock(
        blockIndex,
        currentData,
        'Simulated malicious ledger alteration via Security Lab'
      );

      const updatedBlocks = [...blockchainInstance.chain];
      setBlocks(updatedBlocks);
      localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(updatedBlocks));

      // Re-run validation to reveal the tampering
      const report = await blockchainInstance.isChainValid();
      setValidationReport(report);
    },
    [blockchainInstance]
  );

  // Security Lab: Restore single block
  const restoreBlock = useCallback(
    async (blockIndex: number) => {
      await blockchainInstance.restoreBlock(blockIndex);
      const updatedBlocks = [...blockchainInstance.chain];
      setBlocks(updatedBlocks);
      localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(updatedBlocks));

      const report = await blockchainInstance.isChainValid();
      setValidationReport(report);
    },
    [blockchainInstance]
  );

  // Security Lab: Restore all blocks
  const restoreAllBlocks = useCallback(async () => {
    await blockchainInstance.restoreAllBlocks();
    const updatedBlocks = [...blockchainInstance.chain];
    setBlocks(updatedBlocks);
    localStorage.setItem(STORAGE_KEY_BLOCKS, JSON.stringify(updatedBlocks));

    const report = await blockchainInstance.isChainValid();
    setValidationReport(report);
  }, [blockchainInstance]);

  // Reset to demo state
  const resetToDemo = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY_BLOCKS);
    localStorage.removeItem(STORAGE_KEY_CAMPAIGNS);
    localStorage.removeItem(STORAGE_KEY_CONTRIBUTIONS);
    await initializePlatform();
  }, [initializePlatform]);

  return (
    <BlockchainContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCampaignId,
        setSelectedCampaignId,
        selectedProof,
        setSelectedProof,
        contributeTargetCampaign,
        setContributeTargetCampaign,
        blockchain: blockchainInstance,
        blocks,
        campaigns,
        contributions,
        validationReport,
        isInitializing,
        isValidating,
        verifyBlockchain,
        createCampaign,
        contributeToCampaign,
        simulateTamper,
        restoreBlock,
        restoreAllBlocks,
        resetToDemo,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export function useBlockchain() {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
}
