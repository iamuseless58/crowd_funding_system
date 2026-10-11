import { Campaign, Contribution, Block } from '../types/blockchain';
import { computeBlockHash } from '../utils/crypto';

export interface SeedInitialData {
  campaigns: Campaign[];
  contributions: Contribution[];
  blocks: Block[];
}

export async function generateSeedData(): Promise<SeedInitialData> {
  const blocks: Block[] = [];
  const contributions: Contribution[] = [];

  // 1. Genesis Block (Block #0)
  const genesisTimestamp = '2026-01-01T00:00:00.000Z';
  const genesisData = 'FUNDCHAIN Genesis Block';
  const genesisHash = await computeBlockHash(0, genesisTimestamp, genesisData, '0', 0);

  blocks.push({
    index: 0,
    timestamp: genesisTimestamp,
    data: genesisData,
    previousHash: '0',
    hash: genesisHash,
    nonce: 0,
    blockType: 'GENESIS',
  });

  // Base campaigns definition
  const rawCampaigns: Array<{
    id: string;
    title: string;
    creator: string;
    description: string;
    category: Campaign['category'];
    goal: number;
    raised: number;
    minimumContribution: number;
    deadline: string;
    status: Campaign['status'];
    beneficiary: string;
    purpose: string;
    createdAt: string;
    imageEmoji: string;
    seedContributions: Array<{
      contributor: string;
      amount: number;
      message: string;
      timestamp: string;
    }>;
  }> = [
    {
      id: 'cmp_solar_01',
      title: 'Solar Kits for Rural Communities',
      creator: 'Prakash Energy Trust',
      description: 'Deploying off-grid solar micro-kits equipped with lithium storage and LED modules for 120 unelectrified rural households in tribal corridors.',
      category: 'Environment',
      goal: 500000,
      raised: 180000,
      minimumContribution: 500,
      deadline: '2026-11-20T23:59:59.000Z',
      status: 'Active',
      beneficiary: '120 rural village families across Gadchiroli district',
      purpose: 'Procurement of monocrystalline solar panels, 12V LiFePO4 batteries, and DC appliances.',
      createdAt: '2026-01-10T08:30:00.000Z',
      imageEmoji: '☀️',
      seedContributions: [
        { contributor: 'Aarav Sharma', amount: 25000, message: 'Clean power is the bedrock of dignity and study.', timestamp: '2026-01-12T14:20:00.000Z' },
        { contributor: 'Neha Mehta', amount: 15000, message: 'Happy to support lighting up homes.', timestamp: '2026-01-15T09:12:00.000Z' },
        { contributor: 'Sunil Patel', amount: 40000, message: 'Solar rural empowerment is wonderful.', timestamp: '2026-01-20T11:45:00.000Z' },
      ],
    },
    {
      id: 'cmp_ai_edu_02',
      title: 'AI Learning Platform for Students',
      creator: 'OpenEdu Labs',
      description: 'Building an open-source, multilingual AI tutor and adaptive STEM curriculum that works offline in public schools with zero data fees.',
      category: 'Education',
      goal: 300000,
      raised: 215000,
      minimumContribution: 300,
      deadline: '2026-12-05T23:59:59.000Z',
      status: 'Active',
      beneficiary: 'Over 4,500 rural & tier-3 high school students',
      purpose: 'Edge compute device testing, local language translation dataset curation, and open educator licenses.',
      createdAt: '2026-01-14T10:15:00.000Z',
      imageEmoji: '🎓',
      seedContributions: [
        { contributor: 'Vikram Malhotra', amount: 50000, message: 'Every child deserves world-class AI mentoring.', timestamp: '2026-01-16T16:05:00.000Z' },
        { contributor: 'Rohan Verma', amount: 30000, message: 'Excited to see open-source education scale.', timestamp: '2026-01-22T13:30:00.000Z' },
      ],
    },
    {
      id: 'cmp_health_03',
      title: 'Community Healthcare Initiative',
      creator: 'Arogya Mobile Health Clinic',
      description: 'Equipping an electric mobile medical van with point-of-care diagnostics, ultrasound screening, and tele-specialist links for remote forest settlements.',
      category: 'Healthcare',
      goal: 750000,
      raised: 750000,
      minimumContribution: 1000,
      deadline: '2026-10-30T23:59:59.000Z',
      status: 'Successfully Funded',
      beneficiary: 'Mobile clinical access for 18 remote villages without primary health centres',
      purpose: 'Purchase of portable blood chemistry analyzer, digital ECG, and battery-assisted refrigeration for vaccines.',
      createdAt: '2026-01-05T07:45:00.000Z',
      imageEmoji: '🏥',
      seedContributions: [
        { contributor: 'Ananya Deshmukh', amount: 75000, message: 'First-response medical care saves entire communities.', timestamp: '2026-01-07T18:10:00.000Z' },
        { contributor: 'Aditya Kulkarni', amount: 125000, message: 'Honored to fund critical clinical equipment.', timestamp: '2026-01-18T10:00:00.000Z' },
      ],
    },
    {
      id: 'cmp_ocean_04',
      title: 'Ocean Cleanup Technology',
      creator: 'AquaShield Foundation',
      description: 'Developing autonomous solar-powered coastal interceptor booms to capture macro-plastic waste at estuarine river mouths before reaching open seas.',
      category: 'Environment',
      goal: 1000000,
      raised: 420000,
      minimumContribution: 1000,
      deadline: '2027-01-15T23:59:59.000Z',
      status: 'Active',
      beneficiary: 'Coastal marine sanctuaries and artisanal fishing communities',
      purpose: 'Fabrication of marine-grade HDPE containment booms, underwater telemetry sensors, and solar winches.',
      createdAt: '2026-01-20T12:00:00.000Z',
      imageEmoji: '🌊',
      seedContributions: [
        { contributor: 'Kavita Rao', amount: 100000, message: 'Protecting coastal biodiversity through transparent tech.', timestamp: '2026-01-25T15:40:00.000Z' },
        { contributor: 'Devansh Singhal', amount: 20000, message: 'Clear waters for future generations.', timestamp: '2026-01-28T11:20:00.000Z' },
      ],
    },
    {
      id: 'cmp_braille_05',
      title: 'Affordable Braille Smart Reader',
      creator: 'Tactile Innovations Lab',
      description: 'An electro-magnetic refreshable multi-line Braille display designed at 1/10th the commercial cost for visually impaired students.',
      category: 'Technology',
      goal: 450000,
      raised: 310000,
      minimumContribution: 500,
      deadline: '2026-11-15T23:59:59.000Z',
      status: 'Active',
      beneficiary: 'Special education schools and independent visually impaired scholars',
      purpose: 'Tooling of micro-actuator pins, circuit board assembly, and tactile ergonomic casing.',
      createdAt: '2026-01-22T09:00:00.000Z',
      imageEmoji: '⚡',
      seedContributions: [
        { contributor: 'Pooja Hegde', amount: 35000, message: 'Assistive technology changes lives instantly.', timestamp: '2026-01-24T17:15:00.000Z' },
      ],
    },
    {
      id: 'cmp_gardens_06',
      title: 'Urban Agroforestry Micro-Gardens',
      creator: 'GreenTerrace Collective',
      description: 'Converting neglected municipal rooftops into soil-regenerating micro-gardens with drip irrigation and indigenous pollination habitats.',
      category: 'Social Impact',
      goal: 200000,
      raised: 95000,
      minimumContribution: 250,
      deadline: '2026-10-25T23:59:59.000Z',
      status: 'Active',
      beneficiary: 'Community volunteers and local low-income urban food shelters',
      purpose: 'Biochar soil beds, non-hybrid native heirloom seeds, and timer-based automated drip circuits.',
      createdAt: '2026-01-26T11:30:00.000Z',
      imageEmoji: '🌱',
      seedContributions: [
        { contributor: 'Manish Gupta', amount: 12000, message: 'Greening our concrete jungles step by step.', timestamp: '2026-01-27T10:45:00.000Z' },
      ],
    },
  ];

  const campaigns: Campaign[] = [];

  // Build blocks sequentially so hashes link perfectly
  for (const c of rawCampaigns) {
    const prevBlock = blocks[blocks.length - 1];
    const creationData = {
      type: 'CAMPAIGN_CREATION' as const,
      campaignId: c.id,
      title: c.title,
      creator: c.creator,
      category: c.category,
      goal: c.goal,
      minimumContribution: c.minimumContribution,
      beneficiary: c.beneficiary,
      purpose: c.purpose,
      timestamp: c.createdAt,
    };

    const newIndex = blocks.length;
    const blockHash = await computeBlockHash(
      newIndex,
      c.createdAt,
      creationData,
      prevBlock.hash,
      0
    );

    blocks.push({
      index: newIndex,
      timestamp: c.createdAt,
      data: creationData,
      previousHash: prevBlock.hash,
      hash: blockHash,
      nonce: 0,
      blockType: 'CAMPAIGN_CREATION',
    });

    const campaignObj: Campaign = {
      id: c.id,
      title: c.title,
      creator: c.creator,
      description: c.description,
      category: c.category,
      goal: c.goal,
      raised: 0, // will sum from contributions
      contributorCount: c.seedContributions.length,
      minimumContribution: c.minimumContribution,
      deadline: c.deadline,
      status: c.status,
      beneficiary: c.beneficiary,
      purpose: c.purpose,
      blockIndex: newIndex,
      txHash: blockHash,
      createdAt: c.createdAt,
      imageEmoji: c.imageEmoji,
      trustScore: 96,
    };

    // Add each seed contribution as a sequential block
    let campaignTotalRaised = 0;
    for (let i = 0; i < c.seedContributions.length; i++) {
      const item = c.seedContributions[i];
      campaignTotalRaised += item.amount;
      const latestBlock = blocks[blocks.length - 1];
      const contributionIndex = blocks.length;
      const txId = `tx_${c.id}_00${i + 1}`;

      const contribData = {
        type: 'CONTRIBUTION' as const,
        txId,
        campaignId: c.id,
        campaignTitle: c.title,
        contributor: item.contributor,
        amount: item.amount,
        message: item.message,
        timestamp: item.timestamp,
      };

      const cBlockHash = await computeBlockHash(
        contributionIndex,
        item.timestamp,
        contribData,
        latestBlock.hash,
        0
      );

      blocks.push({
        index: contributionIndex,
        timestamp: item.timestamp,
        data: contribData,
        previousHash: latestBlock.hash,
        hash: cBlockHash,
        nonce: 0,
        blockType: 'CONTRIBUTION',
      });

      contributions.push({
        id: `contrib_${c.id}_${i + 1}`,
        txId,
        campaignId: c.id,
        campaignTitle: c.title,
        contributor: item.contributor,
        amount: item.amount,
        message: item.message,
        timestamp: item.timestamp,
        blockIndex: contributionIndex,
        hash: cBlockHash,
        previousHash: latestBlock.hash,
      });
    }

    campaignObj.raised = campaignTotalRaised;
    if (campaignObj.raised >= campaignObj.goal) {
      campaignObj.status = 'Successfully Funded';
    }
    campaigns.push(campaignObj);
  }

  return { campaigns, contributions, blocks };
}
