export type CampaignCategory =
  | 'Technology'
  | 'Education'
  | 'Healthcare'
  | 'Environment'
  | 'Social Impact'
  | 'Creative'
  | 'Business';

export type CampaignStatus =
  | 'Active'
  | 'Successfully Funded'
  | 'Goal Not Reached'
  | 'Completed'
  | 'Expired';

export type BlockType = 'GENESIS' | 'CAMPAIGN_CREATION' | 'CONTRIBUTION';

export interface GenesisBlockData {
  type: 'GENESIS';
  message: string;
  network: string;
  initialSupply: string;
  timestamp: string;
}

export interface CampaignCreationData {
  type: 'CAMPAIGN_CREATION';
  campaignId: string;
  title: string;
  creator: string;
  category: CampaignCategory;
  goal: number;
  minimumContribution: number;
  beneficiary: string;
  purpose: string;
  timestamp: string;
}

export interface ContributionData {
  type: 'CONTRIBUTION';
  txId: string;
  campaignId: string;
  campaignTitle: string;
  contributor: string;
  amount: number;
  message?: string;
  timestamp: string;
}

export type BlockPayload = GenesisBlockData | CampaignCreationData | ContributionData | string;

export interface Block {
  index: number;
  timestamp: string;
  data: BlockPayload;
  previousHash: string;
  hash: string;
  nonce: number;
  blockType: BlockType;
  // Security Lab properties for tampering demonstration
  isTampered?: boolean;
  originalData?: BlockPayload;
  originalHash?: string;
  tamperReason?: string;
}

export interface Campaign {
  id: string;
  title: string;
  creator: string;
  description: string;
  category: CampaignCategory;
  goal: number;
  raised: number;
  contributorCount: number;
  minimumContribution: number;
  deadline: string; // ISO date string
  status: CampaignStatus;
  beneficiary: string;
  purpose: string;
  blockIndex: number;
  txHash: string;
  createdAt: string;
  imageEmoji?: string;
  trustScore?: number;
}

export interface Contribution {
  id: string;
  txId: string;
  campaignId: string;
  campaignTitle: string;
  contributor: string;
  amount: number;
  message?: string;
  timestamp: string;
  blockIndex: number;
  hash: string;
  previousHash: string;
}

export interface BlockValidationError {
  blockIndex: number;
  errorType: 'GENESIS_CORRUPTED' | 'HASH_MISMATCH' | 'PREVIOUS_HASH_MISMATCH';
  details: string;
  expectedHash?: string;
  actualHash?: string;
}

export interface BlockchainValidationReport {
  isValid: boolean;
  totalBlocks: number;
  validBlocks: number;
  invalidBlocks: number;
  firstBrokenIndex: number | null;
  errors: BlockValidationError[];
  checkedAt: string;
}
