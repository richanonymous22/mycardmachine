import { Partner } from "@/types/merchant";

export const partners: Partner[] = [
  {
    id: "custom",
    name: "Custom Provider",
    transactionFeeDebit: 0,
    transactionFeeCredit: 0,
    fees: {},
    benefits: ["Custom rates", "Flexible comparison"],
  },
  {
    id: "dojo",
    name: "Dojo",
    machine_models: ["PAX920"],
    contract_length: "12 months or no contract",
    settlement_time: "Working day and everyday both option",
    auto_renewal: false,
    early_termination_fee: null,
    fees: {
      debit: { min: 0.004, max: 0.014, avg: 0.0075 },
      credit: { min: 0.0075, max: 0.015, avg: 0.01 },
      business_card: null,
      tap_fee: [0.02, 0.03, 0.05],
      refund_fee: 0.5,
      chargeback_fee: 28,
      monthly_rental: 15,
      maintenance_fee: 5,
      dashboard_fee: 10,
      pci_fee: 0,
      non_compliance_fee: 0,
      sim_fee: null,
      setup_fee: null,
      min_monthly_charge: null
    },
    features: [
      "Fast settlement options",
      "Dashboard access",
      "No hidden fees",
      "12-month or rolling contract"
    ],
  },
  {
    id: "sumup",
    name: "SumUp",
    machine_models: ["SumUp Air", "SumUp Solo"],
    contract_length: "No contract",
    settlement_time: "2 working days",
    auto_renewal: false,
    early_termination_fee: null,
    fees: {
      transaction_fee: 0.0175,
      monthly_rental: 0,
      setup_fee: 70,
      pci_fee: 0,
      non_compliance_fee: 0,
      sim_fee: 0,
    },
    turnover_tiers: [
      { range: "0–5000", fee: 0.0175 },
      { range: "5000+", fee: 0.0175 }
    ],
    features: [
      "Pay-as-you-go model",
      "No contract",
      "Fast setup",
      "Free dashboard access"
    ],
  },
  {
    id: "zettle",
    name: "Zettle",
    machine_models: ["Zettle Reader 2"],
    contract_length: "No contract",
    settlement_time: "2 working days",
    auto_renewal: false,
    early_termination_fee: null,
    fees: {
      transaction_fee: 0.0175,
      monthly_rental: 0,
      setup_fee: 70,
      pci_fee: 0,
      non_compliance_fee: 0,
      sim_fee: 0,
    },
    turnover_tiers: [
      { range: "0–5000", fee: 0.0175 },
      { range: "5000+", fee: 0.0175 }
    ],
    features: [
      "No monthly fee",
      "Free business app",
      "Fast deposits",
      "Works with smartphones and tablets"
    ],
  },
  {
    id: "square",
    name: "Square",
    machine_models: ["Square Reader", "Square Terminal"],
    contract_length: "No contract",
    settlement_time: "2 working days",
    auto_renewal: false,
    early_termination_fee: null,
    fees: {
      transaction_fee: 0.0175,
      monthly_rental: 0,
      setup_fee: 70,
      pci_fee: 0,
      non_compliance_fee: 0,
      sim_fee: 0,
    },
    turnover_tiers: [
      { range: "0–5000", fee: 0.0175 },
      { range: "5000+", fee: 0.0175 }
    ],
    features: [
      "Instant setup",
      "Free analytics dashboard",
      "Simple pricing",
      "No monthly fees"
    ],
  },
  {
    id: "evo",
    name: "EVO Payments",
    machine_models: ["PAX920", "Castle Terminal"],
    contract_length: "18 months or no contract",
    settlement_time: "Next working day",
    auto_renewal: true,
    early_termination_fee: "Remaining rental fees",
    fees: {
      debit: { min: 0.005, max: 0.0145, avg: 0.0075 },
      credit: { min: 0.007, max: 0.02, avg: 0.013 },
      business_card: 0.025,
      tap_fee: [0.01, 0.02, 0.04, 0.05],
      refund_fee: 5,
      monthly_rental: 20,
      setup_fee: 0,
      pci_fee: 0,
      non_compliance_fee: 0,
    },
    features: [
      "Next-day settlements",
      "Business card support",
      "Trusted UK provider"
    ],
  },
  {
    id: "handepay",
    name: "Handepay",
    machine_models: ["Castle Terminal"],
    contract_length: "No contract",
    settlement_time: "Next working day",
    auto_renewal: true,
    early_termination_fee: null,
    fees: {
      debit: { min: 0.005, max: 0.0145, avg: 0.0075 },
      credit: { min: 0.007, max: 0.02, avg: 0.013 },
      business_card: 0.025,
      tap_fee: [0.01, 0.02, 0.04, 0.05],
      refund_fee: 5,
      monthly_rental: 20,
      setup_fee: 0,
      pci_fee: 0,
      non_compliance_fee: 0,
    },
    features: [
      "No long contracts",
      "Next-day payouts",
      "Simple pricing",
      "Transparent fees"
    ],
  },
  {
    id: "takepayments",
    name: "TakePayments",
    machine_models: ["Castle Terminal"],
    contract_length: "18 months",
    settlement_time: "Next working day",
    auto_renewal: true,
    early_termination_fee: "Remaining rental fees",
    fees: {
      debit: { min: 0.005, max: 0.0145, avg: 0.0075 },
      credit: { min: 0.007, max: 0.02, avg: 0.013 },
      business_card: 0.025,
      tap_fee: [0.01, 0.02, 0.04, 0.05],
      refund_fee: 5,
      monthly_rental: 20,
      setup_fee: 0,
      pci_fee: 0,
      non_compliance_fee: 0,
    },
    features: [
      "Fast settlement times",
      "Integrated dashboard",
      "Custom pricing options"
    ],
  },
  {
    id: "clover",
    name: "Clover",
    machine_models: ["Clover Flex", "Clover Mini"],
    contract_length: "18 months (free cancel after 12 months)",
    settlement_time: "Next working day",
    auto_renewal: true,
    early_termination_fee: "Remaining rental fees",
    fees: {
      debit: { min: 0.003, max: 0.0145, avg: 0.0075 },
      credit: { min: 0.007, max: 0.02, avg: 0.013 },
      business_card: 0.025,
      tap_fee: [0.03, 0.04, 0.05],
      refund_fee: 5,
      chargeback_fee: 28,
      monthly_rental: 15,
      setup_fee: 70,
      dashboard_fee: 10,
      pci_fee: 5,
      non_compliance_fee: 25,
      sim_fee: 10,
      min_monthly_charge: 35
    },
    features: [
      "Next-day settlement",
      "Free cancellation after 12 months",
      "Smart touchscreen terminals",
      "Modern user interface"
    ],
  },
  {
    id: "worldpay",
    name: "Worldpay",
    machine_models: ["DX8000", "Ingenico 5000"],
    contract_length: "18 months (can be cancelled after 1 year)",
    settlement_time: "Next working day",
    auto_renewal: true,
    early_termination_fee: "Up to £150",
    fees: {
      debit: { min: 0.0049, max: 0.014 },
      credit: { min: 0.0079, max: 0.016 },
      tap_fee: [0.01, 0.02],
      refund_fee: 5,
      chargeback_fee: 20,
      monthly_rental: 14.5,
      setup_fee: 0,
      dashboard_fee: 10,
      pci_fee: 5,
      non_compliance_fee: 22.5,
      sim_fee: null,
      min_monthly_charge: 10
    },
    turnover_tiers: [
      { range: "0–5000", fee: 0.0075 },
      { range: "5001–34999", fee: 0.0075 },
      { range: "35000–49999", fee: 0.0065 },
      { range: "50000+", fee: 0.0065 }
    ],
    features: [
      "Next-day settlement",
      "Free first-year rental",
      "Optional dashboard portal",
      "Established UK provider"
    ],
  },
  {
    id: "teya",
    name: "Teya",
    machine_models: ["Teya Go", "Teya Essential"],
    contract_length: "No contract – cancel anytime",
    settlement_time: "Next working day",
    auto_renewal: false,
    early_termination_fee: null,
    fees: {
      transaction_fee: 0.012,
      monthly_rental: 15,
      setup_fee: 0,
      tap_fee: 0,
      pci_fee: 0,
      non_compliance_fee: 0,
      min_monthly_charge: 0
    },
    turnover_tiers: [
      { range: "5000–9999", fee: 0.012 },
      { range: "10000–14999", fee: 0.01 },
      { range: "15000–24999", fee: 0.009 },
      { range: "25000–34999", fee: 0.008 },
      { range: "35000–49999", fee: 0.007 },
      { range: "50000+", fee: 0.005 }
    ],
    device_info: [
      {
        device_name: "Teya Go",
        buy_price: 69,
        rental_price: 10
      },
      {
        device_name: "Teya Essential",
        buy_price: 89,
        rental_price: 10
      }
    ],
    documents_required: {
      proof_of_id: true,
      proof_of_business: true,
      proof_of_address: true
    },
    features: [
      "Next-day settlement",
      "No setup or PCI fees",
      "No minimum charges",
      "Cancel anytime",
      "Live app access",
      "Fast and reliable terminals",
      "100% transparent pricing"
    ],
  }
];
