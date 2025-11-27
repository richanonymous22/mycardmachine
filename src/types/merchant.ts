export interface Partner {
  id: string;
  name: string;
  logo_url?: string | null;
  machine_models?: string[];
  contract_length?: string;
  settlement_time?: string;
  auto_renewal?: boolean;
  early_termination_fee?: string | null;
  fees: {
    debit?: { min: number; max: number; avg?: number };
    credit?: { min: number; max: number; avg?: number };
    transaction_fee?: number;
    blended_rate?: { min: number; max: number; avg?: number };
    business_card?: number | null;
    tap_fee?: number[] | number;
    refund_fee?: number;
    chargeback_fee?: number;
    monthly_rental?: number;
    maintenance_fee?: number;
    setup_fee?: number | null;
    dashboard_fee?: number;
    pci_fee?: number;
    non_compliance_fee?: number;
    sim_fee?: number | null;
    min_monthly_charge?: number | null;
  };
  turnover_tiers?: Array<{
    range: string;
    fee?: number;
    eligible?: boolean;
    note?: string;
  }>;
  contract_terms?: {
    auto_renewal?: boolean;
    early_termination?: string;
    settlement_payout?: string;
  };
  device_info?: {
    device_name: string;
    type: string;
    buy_price?: number | null;
    rental_price?: number;
    delivery_time_days?: number;
  } | Array<{
    device_name: string;
    buy_price?: number;
    rental_price?: number;
  }>;
  documents_required?: {
    proof_of_id?: boolean;
    proof_of_business?: boolean;
    proof_of_bank?: boolean;
    proof_of_address?: boolean;
  };
  features?: string[];
  transactionFeeDebit?: number;
  transactionFeeCredit?: number;
  benefits?: string[];
  problems?: string[];
  notes?: string;
}

export interface ComparisonData {
  currentPartner: Partner | null;
  newPartner: Partner | null;
  monthlyTurnover: number;
}

export interface CalculationResult {
  transactionCosts: number;
  monthlyFees: number;
  totalMonthlyCost: number;
  annualCost: number;
}