import { Partner, CalculationResult } from "@/types/merchant";

// Helper to sanitize and validate turnover input
export const sanitizeTurnover = (input: string | number): number => {
  let value: number;
  
  if (typeof input === 'string') {
    // Remove £, commas, and spaces
    let cleaned = input.replace(/[£,\s]/g, '');
    
    // Handle "k" suffix (e.g., "13k" -> 13000)
    if (cleaned.toLowerCase().endsWith('k')) {
      cleaned = cleaned.slice(0, -1);
      value = parseFloat(cleaned) * 1000;
    } else {
      value = parseFloat(cleaned);
    }
  } else {
    value = input;
  }
  
  // Ensure it's a valid number
  if (isNaN(value) || value < 0) {
    value = 0;
  }
  
  // Cap between £5,000 and £200,000
  if (value > 0 && value < 5000) {
    value = 5000;
  } else if (value > 200000) {
    value = 200000;
  }
  
  return value;
};

// Helper to get the fee based on turnover tiers (for providers like Teya)
const getFeeFromTiers = (turnoverTiers: any[] | undefined, monthlyTurnover: number): number | null => {
  if (!turnoverTiers || turnoverTiers.length === 0) return null;
  
  // Find the matching tier
  for (const tier of turnoverTiers) {
    if (tier.eligible === false) continue;
    
    // Support both regular hyphen (-) and en-dash (–)
    const rangeMatch = tier.range.match(/(\d+)(?:[-–](\d+)|\+)?/);
    if (!rangeMatch) continue;
    
    const minValue = parseInt(rangeMatch[1]);
    const maxValue = rangeMatch[2] ? parseInt(rangeMatch[2]) : Infinity;
    
    if (monthlyTurnover >= minValue && monthlyTurnover <= maxValue) {
      return tier.fee;
    }
  }
  
  return null;
};

// Helper to calculate dynamic scaling rate for providers without tiers
const getDynamicScaledRate = (
  minRate: number,
  maxRate: number,
  turnover: number,
  minTurnover: number = 5000,
  maxTurnover: number = 100000
): number => {
  // Ensure turnover is within bounds
  const cappedTurnover = Math.max(minTurnover, Math.min(maxTurnover, turnover));
  
  // Calculate ratio (higher turnover = lower ratio = lower rate)
  const ratio = (maxTurnover - cappedTurnover) / (maxTurnover - minTurnover);
  
  // Calculate rate (rate decreases as turnover increases)
  const rate = minRate + (maxRate - minRate) * ratio;
  
  return rate;
};

// Export helper to get actual rates being used for display purposes
export const getCalculatedRates = (
  partner: Partner,
  monthlyTurnover: number
): { debitRate?: number; creditRate?: number; blendedRate?: number } => {
  const sanitizedTurnover = sanitizeTurnover(monthlyTurnover);
  
  // TIER-BASED: Check for turnover tiers first
  if (partner.turnover_tiers && partner.turnover_tiers.length > 0) {
    const tierFee = getFeeFromTiers(partner.turnover_tiers, sanitizedTurnover);
    if (tierFee !== null) {
      return { blendedRate: tierFee };
    }
  }
  
  // DYNAMIC SCALING: Debit/credit split
  if (partner.fees.debit && partner.fees.credit) {
    const debitRate = partner.fees.debit.avg ?? getDynamicScaledRate(
      partner.fees.debit.min,
      partner.fees.debit.max,
      sanitizedTurnover
    );
    const creditRate = partner.fees.credit.avg ?? getDynamicScaledRate(
      partner.fees.credit.min,
      partner.fees.credit.max,
      sanitizedTurnover
    );
    return { debitRate, creditRate };
  }
  
  // DYNAMIC SCALING: Blended rate
  if (partner.fees.blended_rate) {
    const blendedRate = partner.fees.blended_rate.avg ?? getDynamicScaledRate(
      partner.fees.blended_rate.min,
      partner.fees.blended_rate.max,
      sanitizedTurnover
    );
    return { blendedRate };
  }
  
  // Flat transaction fee
  if (partner.fees.transaction_fee) {
    return { blendedRate: partner.fees.transaction_fee };
  }
  
  // Legacy support
  if (partner.transactionFeeDebit !== undefined && partner.transactionFeeCredit !== undefined) {
    return { 
      debitRate: partner.transactionFeeDebit / 100, 
      creditRate: partner.transactionFeeCredit / 100 
    };
  }
  
  return {};
};

export const calculateMerchantCosts = (
  partner: Partner,
  monthlyTurnover: number,
  averageTransactionValue: number = 25,
  debitPercentage: number = 0.7
): CalculationResult => {
  // Sanitize the turnover input
  const sanitizedTurnover = sanitizeTurnover(monthlyTurnover);
  
  const numberOfTransactions = sanitizedTurnover / averageTransactionValue;
  const debitTurnover = sanitizedTurnover * debitPercentage;
  const creditTurnover = sanitizedTurnover * (1 - debitPercentage);

  let transactionCosts = 0;

  // TIER-BASED: Handle providers with turnover tiers (Teya, SumUp, Zettle, etc.)
  if (partner.turnover_tiers && partner.turnover_tiers.length > 0) {
    const tierFee = getFeeFromTiers(partner.turnover_tiers, sanitizedTurnover);
    if (tierFee !== null) {
      transactionCosts = sanitizedTurnover * tierFee;
    } else if (partner.fees.transaction_fee) {
      transactionCosts = sanitizedTurnover * partner.fees.transaction_fee;
    } else if (partner.fees.blended_rate) {
      const blendedRate = partner.fees.blended_rate.avg || partner.fees.blended_rate.min;
      transactionCosts = sanitizedTurnover * blendedRate;
    }
  }
  // DYNAMIC SCALING: Handle debit/credit split with dynamic rate calculation
  else if (partner.fees.debit && partner.fees.credit) {
    // Use dynamic scaling if min/max rates exist
    const debitRate = partner.fees.debit.avg ?? getDynamicScaledRate(
      partner.fees.debit.min,
      partner.fees.debit.max,
      sanitizedTurnover
    );
    const creditRate = partner.fees.credit.avg ?? getDynamicScaledRate(
      partner.fees.credit.min,
      partner.fees.credit.max,
      sanitizedTurnover
    );
    
    transactionCosts = 
      (debitTurnover * debitRate) +
      (creditTurnover * creditRate);
  }
  // DYNAMIC SCALING: Handle blended rate with dynamic scaling
  else if (partner.fees.blended_rate) {
    const blendedRate = partner.fees.blended_rate.avg ?? getDynamicScaledRate(
      partner.fees.blended_rate.min,
      partner.fees.blended_rate.max,
      sanitizedTurnover
    );
    transactionCosts = sanitizedTurnover * blendedRate;
  }
  // Handle flat transaction fee
  else if (partner.fees.transaction_fee) {
    transactionCosts = sanitizedTurnover * partner.fees.transaction_fee;
  }
  // Legacy support
  else if (partner.transactionFeeDebit !== undefined && partner.transactionFeeCredit !== undefined) {
    transactionCosts = 
      (debitTurnover * partner.transactionFeeDebit) / 100 +
      (creditTurnover * partner.transactionFeeCredit) / 100;
  }

  // Add per-transaction tap/auth fees
  if (partner.fees.tap_fee) {
    const tapFee = Array.isArray(partner.fees.tap_fee) 
      ? partner.fees.tap_fee.reduce((a, b) => a + b, 0) / partner.fees.tap_fee.length
      : partner.fees.tap_fee;
    transactionCosts += numberOfTransactions * tapFee;
  }

  // Calculate monthly fees
  let monthlyFees = 0;
  
  if (partner.fees.monthly_rental) {
    monthlyFees += partner.fees.monthly_rental;
  }
  
  if (partner.fees.maintenance_fee) {
    monthlyFees += partner.fees.maintenance_fee;
  }
  
  if (partner.fees.dashboard_fee) {
    monthlyFees += partner.fees.dashboard_fee;
  }
  
  if (partner.fees.pci_fee) {
    monthlyFees += partner.fees.pci_fee;
  }
  
  if (partner.fees.non_compliance_fee) {
    monthlyFees += partner.fees.non_compliance_fee;
  }
  
  if (partner.fees.sim_fee) {
    monthlyFees += partner.fees.sim_fee;
  }
  
  if (partner.fees.min_monthly_charge) {
    monthlyFees += partner.fees.min_monthly_charge;
  }

  const totalMonthlyCost = transactionCosts + monthlyFees;
  const annualCost = totalMonthlyCost * 12;

  return {
    transactionCosts,
    monthlyFees,
    totalMonthlyCost,
    annualCost
  };
};