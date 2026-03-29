import { states } from '../data/states';
import type { CalculatorInputs, CalculatorResult } from '../types/index';

export function calculateTransferTax(salePrice: number, stateAbbr: string): number {
  const state = states[stateAbbr];
  if (!state) return 0;
  const tax = state.transferTax;
  if (tax.tiered && tax.tiers) {
    let total = 0;
    let remaining = salePrice;
    let prevMax = 0;
    for (const tier of tax.tiers) {
      const taxable = Math.min(remaining, tier.max - prevMax);
      if (taxable <= 0) break;
      total += taxable * tier.rate;
      remaining -= taxable;
      prevMax = tier.max;
    }
    return total;
  }
  return salePrice * tax.rate;
}

export function calculateNetProceeds(inputs: CalculatorInputs): CalculatorResult {
  const { salePrice, mortgageBalance, state, buyerAgentCommission, flatFeeMLS, attorneyFees, repairCosts, photography } = inputs;
  const transferTax = calculateTransferTax(salePrice, state);
  const titleInsurance = salePrice * 0.005;
  const agentComm = salePrice * (buyerAgentCommission / 100);
  const otherClosingCosts = salePrice * 0.005; // recording, prorated taxes, misc
  const totalCosts = transferTax + titleInsurance + attorneyFees + flatFeeMLS + agentComm + photography + repairCosts + otherClosingCosts;
  const netProceeds = salePrice - totalCosts - mortgageBalance;
  return {
    salePrice,
    transferTax,
    titleInsurance,
    attorneyFees,
    flatFeeMLS,
    buyerAgentCommission: agentComm,
    photography,
    repairCosts,
    otherClosingCosts,
    totalCosts,
    mortgagePayoff: mortgageBalance,
    netProceeds,
  };
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}
