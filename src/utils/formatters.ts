/**
 * Number & Currency Formatters with Indian Rupee (₹) standard
 */

export function formatINR(amount: number): string {
  // Format in standard Indian numbering system (e.g. 5,00,000)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-IN').format(val);
}

export function truncateHash(hash: string, startLength: number = 8, endLength: number = 8): string {
  if (!hash) return '';
  if (hash.length <= startLength + endLength) return hash;
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
}

export function formatTimestamp(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return isoString;
  }
}

export function getDaysRemaining(deadlineIso: string): { days: number; text: string; isExpired: boolean } {
  try {
    const deadline = new Date(deadlineIso).getTime();
    const now = Date.now();
    const diff = deadline - now;
    
    if (diff <= 0) {
      return { days: 0, text: 'Campaign ended', isExpired: true };
    }
    
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return {
      days,
      text: days === 1 ? '1 day left' : `${days} days left`,
      isExpired: false,
    };
  } catch {
    return { days: 0, text: 'No deadline', isExpired: false };
  }
}

/**
 * Calculates deterministic visual trust/transparency score:
 * Base: 70
 * + Transactions count (+2 per tx, max +16)
 * + Beneficiary & purpose clarity (+6)
 * + Blockchain verification (+8)
 * Normalized to 0-100 scale
 */
export function calculateCampaignTrustScore(
  contributorCount: number,
  isChainValid: boolean,
  hasBeneficiary: boolean,
  status: string
): number {
  let score = 78;
  if (isChainValid) score += 10;
  if (contributorCount > 0) score += Math.min(10, contributorCount * 2);
  if (hasBeneficiary) score += 4;
  if (status === 'Successfully Funded') score += 2;
  return Math.min(99, Math.max(50, score));
}
