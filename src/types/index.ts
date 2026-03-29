export interface TransferTax {
  rate: number;
  description: string;
  whoPays: 'seller' | 'buyer' | 'split' | 'varies' | 'n/a';
  tiered?: boolean;
  tiers?: { max: number; rate: number }[];
}

export interface StateData {
  name: string;
  abbreviation: string;
  attorneyRequired: 'yes' | 'no' | 'varies' | 'customary';
  closingAgent: 'attorney' | 'title' | 'escrow' | 'hybrid';
  transferTax: TransferTax;
  disclosureForm: string;
  disclosureRequired: boolean;
  specialRules: string;
  homesteadExemption: string;
  effectivePropertyTaxRate: number;
}

export interface ChecklistStep {
  id: number;
  phase: number;
  phaseName: string;
  title: string;
  description: string;
  estimatedCost: string;
  estimatedTime: string;
  professionalNeeded: boolean;
  professionalType?: string;
  tip?: string;
}

export interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

export interface CalculatorInputs {
  salePrice: number;
  mortgageBalance: number;
  state: string;
  buyerAgentCommission: number;
  flatFeeMLS: number;
  attorneyFees: number;
  repairCosts: number;
  photography: number;
}

export interface CalculatorResult {
  salePrice: number;
  transferTax: number;
  titleInsurance: number;
  attorneyFees: number;
  flatFeeMLS: number;
  buyerAgentCommission: number;
  photography: number;
  repairCosts: number;
  otherClosingCosts: number;
  totalCosts: number;
  mortgagePayoff: number;
  netProceeds: number;
}
