import { states } from './states';
import { stateGuides } from './stateGuides';

export interface ArticleSection {
  heading: string;
  content: string;
}

export interface StateArticle {
  title: string;
  slug: string;
  metaDescription: string;
  sections: ArticleSection[];
}

// Median home prices by state (approximate 2025-2026 data)
const medianPrices: Record<string, number> = {
  AL: 230000, AK: 365000, AZ: 410000, AR: 195000, CA: 785000,
  CO: 535000, CT: 380000, DE: 350000, FL: 400000, GA: 320000,
  HI: 890000, ID: 450000, IL: 265000, IN: 240000, IA: 210000,
  KS: 225000, KY: 210000, LA: 195000, ME: 355000, MD: 395000,
  MA: 585000, MI: 235000, MN: 330000, MS: 175000, MO: 240000,
  MT: 450000, NE: 255000, NV: 425000, NH: 445000, NJ: 490000,
  NM: 290000, NY: 420000, NC: 325000, ND: 250000, OH: 210000,
  OK: 195000, OR: 480000, PA: 265000, RI: 415000, SC: 295000,
  SD: 295000, TN: 310000, TX: 300000, UT: 485000, VT: 380000,
  VA: 380000, WA: 580000, WV: 145000, WI: 280000, WY: 330000,
  DC: 640000,
};

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

function fmtDollars(n: number): string {
  return '$' + fmt(n);
}

function calcSavings(price: number): number {
  return Math.round(price * 0.05);
}

function calcTransferTax(abbr: string, price: number): number {
  const state = states[abbr];
  if (!state) return 0;
  const tx = state.transferTax;
  if (tx.rate === 0 && !tx.tiered) return 0;
  if (tx.tiered && tx.tiers) {
    let total = 0;
    let remaining = price;
    let prevMax = 0;
    for (const tier of tx.tiers) {
      const bracket = Math.min(remaining, tier.max - prevMax);
      if (bracket <= 0) break;
      total += bracket * tier.rate;
      remaining -= bracket;
      prevMax = tier.max;
    }
    return Math.round(total);
  }
  return Math.round(price * tx.rate);
}

function attorneyText(req: string): string {
  switch (req) {
    case 'yes': return 'an attorney is legally required';
    case 'customary': return 'hiring an attorney is strongly customary (and highly recommended)';
    case 'varies': return 'attorney requirements vary by county';
    default: return 'an attorney is not legally required, though one may be advisable';
  }
}

function closingAgentText(agent: string): string {
  switch (agent) {
    case 'attorney': return 'Closings are handled by attorneys';
    case 'title': return 'Title companies typically handle closings';
    case 'escrow': return 'Escrow companies manage the closing process';
    case 'hybrid': return 'Closings may be handled by title companies, attorneys, or escrow agents';
    default: return 'Closing agents vary';
  }
}

function generateArticle(abbr: string): StateArticle {
  const s = states[abbr];
  const g = stateGuides[abbr];
  const price = medianPrices[abbr] || 300000;
  const savings = calcSavings(price);
  const transferTaxAmt = calcTransferTax(abbr, price);
  const stateName = s.name;
  const slug = stateName.toLowerCase().replace(/\s+/g, '-');

  const sections: ArticleSection[] = [];

  // Section 1: Overview
  const overviewLines: string[] = [];
  overviewLines.push(
    `Selling a home without a realtor in ${stateName} can save you thousands of dollars in commission fees. ` +
    `With a median home price of ${fmtDollars(price)}, a typical 5-6% agent commission would cost you ${fmtDollars(savings)} or more. ` +
    `By going the For Sale By Owner (FSBO) route, you keep that money in your pocket.`
  );
  if (s.attorneyRequired === 'yes') {
    overviewLines.push(
      `${stateName} is an attorney state, meaning you will need to hire a real estate attorney to handle the closing. ` +
      `This actually works in your favor as an FSBO seller — the attorney ensures legal compliance so you can focus on marketing and negotiation.`
    );
  } else if (s.attorneyRequired === 'customary') {
    overviewLines.push(
      `While ${stateName} does not strictly require an attorney, it is strongly customary to use one for real estate transactions. ` +
      `Most FSBO sellers in ${stateName} hire an attorney to protect their interests at closing.`
    );
  } else {
    overviewLines.push(
      `${stateName} does not require an attorney for real estate closings, which keeps your costs lower. ` +
      `${closingAgentText(s.closingAgent)} in ${stateName}, and many FSBO sellers work directly with them.`
    );
  }
  overviewLines.push(
    `The average days on market in ${stateName} is ${g.avgDaysOnMarket} days, so plan your timeline accordingly. ` +
    `This guide walks you through the entire process specific to ${stateName}'s laws and requirements.`
  );
  sections.push({
    heading: `Why Sell FSBO in ${stateName}?`,
    content: overviewLines.join('\n\n'),
  });

  // Section 2: Legal Requirements
  const legalLines: string[] = [];
  legalLines.push(
    `In ${stateName}, ${attorneyText(s.attorneyRequired)} for real estate transactions. ` +
    `${closingAgentText(s.closingAgent)}.`
  );
  if (s.disclosureRequired) {
    legalLines.push(
      `You are required to provide buyers with the ${s.disclosureForm}. ` +
      `This disclosure must be completed honestly and thoroughly — failure to disclose known defects can expose you to legal liability.`
    );
  } else {
    legalLines.push(
      `${stateName} does not have a mandatory state disclosure form, but providing a property condition disclosure is strongly recommended to protect yourself from future claims. ` +
      `Common practice is to use the ${s.disclosureForm}.`
    );
  }
  if (s.transferTax.rate > 0 || s.transferTax.description !== 'None') {
    legalLines.push(
      `The transfer tax in ${stateName} is ${s.transferTax.description}. ` +
      (s.transferTax.whoPays !== 'n/a' ? `This is typically paid by the ${s.transferTax.whoPays}.` : '')
    );
  } else {
    legalLines.push(`${stateName} has no state transfer tax, which reduces your closing costs.`);
  }
  if (s.specialRules) {
    legalLines.push(`Important: ${s.specialRules}`);
  }
  sections.push({
    heading: `Legal Requirements in ${stateName}`,
    content: legalLines.join('\n\n'),
  });

  // Section 3: Step-by-Step Process
  const steps: string[] = [];
  steps.push(
    `**Step 1: Price your home competitively.** Research comparable sales in your ${stateName} market. ` +
    `With the effective property tax rate at ${s.effectivePropertyTaxRate}%, buyers are sensitive to total cost of ownership. ` +
    `Consider hiring an appraiser ($300-$500) for an objective valuation.`
  );
  steps.push(
    `**Step 2: Prepare your property and disclosures.** Complete the ${s.disclosureForm} thoroughly. ` +
    `Address any known issues before listing — buyers in ${stateName} expect transparency, and incomplete disclosures are a top FSBO pitfall.`
  );
  if (s.attorneyRequired === 'yes') {
    steps.push(
      `**Step 3: Hire a real estate attorney.** Since ${stateName} requires an attorney for real estate closings, ` +
      `engage one early in the process. They will prepare the deed, review contracts, and conduct the closing. Budget $500-$1,500 for attorney fees.`
    );
  } else if (s.attorneyRequired === 'customary') {
    steps.push(
      `**Step 3: Consider hiring a real estate attorney.** While not legally mandatory in ${stateName}, it is standard practice. ` +
      `An attorney can review your purchase agreement and handle closing paperwork. Budget $500-$1,000.`
    );
  } else {
    steps.push(
      `**Step 3: Engage a ${s.closingAgent === 'escrow' ? 'escrow company' : s.closingAgent === 'title' ? 'title company' : 'closing agent'}.** ` +
      `${closingAgentText(s.closingAgent)} in ${stateName}. Contact one early to understand their fees and process. ` +
      `You may also optionally hire an attorney for contract review ($300-$800).`
    );
  }
  steps.push(
    `**Step 4: List on the MLS via flat-fee service.** A flat-fee MLS listing ($200-$500) gets your home on the same platforms agents use, ` +
    `including Zillow, Realtor.com, and Redfin. This is the single most important marketing step for FSBO sellers.`
  );
  steps.push(
    `**Step 5: Market aggressively.** Professional photos ($150-$400) are essential. Create a compelling listing description highlighting ` +
    `features ${stateName} buyers care about. Host open houses on weekends and be responsive to showing requests.`
  );
  steps.push(
    `**Step 6: Negotiate and accept an offer.** Review all offers carefully. Consider offering 2-3% buyer's agent commission to attract more buyers. ` +
    `Your attorney or closing agent can help you evaluate contingencies and terms.`
  );
  steps.push(
    `**Step 7: Close the sale.** ` +
    (s.attorneyRequired === 'yes'
      ? `Your attorney will coordinate the closing in ${stateName}. `
      : s.attorneyRequired === 'customary'
        ? `Your attorney or closing agent will coordinate in ${stateName}. `
        : `Your ${s.closingAgent === 'escrow' ? 'escrow company' : s.closingAgent === 'title' ? 'title company' : 'closing agent'} will coordinate the closing. `) +
    `Be prepared to sign the deed, settlement statement, and transfer documents. ` +
    `The average closing takes ${g.avgDaysOnMarket > 60 ? '45-60' : '30-45'} days from accepted offer.`
  );
  sections.push({
    heading: 'Step-by-Step FSBO Process',
    content: steps.join('\n\n'),
  });

  // Section 4: Costs Breakdown
  const costLines: string[] = [];
  costLines.push('Here is what you can expect to pay when selling FSBO in ' + stateName + ':');
  const costItems: string[] = [];
  if (transferTaxAmt > 0) {
    costItems.push(`- **Transfer tax:** ${fmtDollars(transferTaxAmt)} (${s.transferTax.description})`);
  } else {
    costItems.push(`- **Transfer tax:** $0 — ${stateName} has no state transfer tax`);
  }
  costItems.push(`- **Flat-fee MLS listing:** $200-$500`);
  if (s.attorneyRequired === 'yes') {
    costItems.push(`- **Attorney fees:** $500-$1,500 (required in ${stateName})`);
  } else if (s.attorneyRequired === 'customary') {
    costItems.push(`- **Attorney fees:** $500-$1,000 (customary in ${stateName})`);
  } else {
    costItems.push(`- **Attorney fees (optional):** $300-$800`);
  }
  costItems.push(`- **Title insurance:** $${Math.round(price * 0.005 / 100) * 100}-$${Math.round(price * 0.01 / 100) * 100} (varies by sale price)`);
  costItems.push(`- **Professional photography:** $150-$400`);
  costItems.push(`- **Buyer's agent commission (if offered):** ${fmtDollars(Math.round(price * 0.025))}-${fmtDollars(Math.round(price * 0.03))} (2.5-3%)`);
  costItems.push(`- **Other closing costs:** $500-$2,000 (recording fees, prorated taxes, etc.)`);

  const totalLow = transferTaxAmt + 200 + (s.attorneyRequired === 'yes' ? 500 : s.attorneyRequired === 'customary' ? 500 : 0) + Math.round(price * 0.005) + 150 + Math.round(price * 0.025) + 500;
  const totalHigh = transferTaxAmt + 500 + (s.attorneyRequired === 'yes' ? 1500 : s.attorneyRequired === 'customary' ? 1000 : 800) + Math.round(price * 0.01) + 400 + Math.round(price * 0.03) + 2000;

  costLines.push(costItems.join('\n'));
  costLines.push(
    `**Estimated total FSBO costs on a ${fmtDollars(price)} home:** ${fmtDollars(totalLow)}-${fmtDollars(totalHigh)}. ` +
    `Compare that to the ${fmtDollars(Math.round(price * 0.05))}-${fmtDollars(Math.round(price * 0.06))} you would pay in traditional agent commissions alone.`
  );
  sections.push({
    heading: 'Costs Breakdown',
    content: costLines.join('\n\n'),
  });

  // Section 5: Common Mistakes
  const mistakeLines: string[] = [];
  mistakeLines.push(`Avoid these common FSBO mistakes specific to ${stateName}:`);
  const pitfallItems = g.commonPitfalls.map((p: string) => `- **${p.split(' — ')[0]}:** ${p.includes(' — ') ? p.split(' — ')[1] : 'This is a frequent issue that can delay or derail your sale.'}`);
  mistakeLines.push(pitfallItems.join('\n'));
  if (s.attorneyRequired === 'yes') {
    mistakeLines.push(
      `Since ${stateName} requires an attorney for closings, do not try to handle the legal paperwork yourself. ` +
      `The attorney fee is a small price compared to the liability of a poorly drafted contract.`
    );
  }
  if (s.effectivePropertyTaxRate > 1.5) {
    mistakeLines.push(
      `With ${stateName}'s high property tax rate of ${s.effectivePropertyTaxRate}%, be aware that buyers will factor annual property taxes ` +
      `of approximately ${fmtDollars(Math.round(price * s.effectivePropertyTaxRate / 100))} into their offer price. Price accordingly.`
    );
  }
  mistakeLines.push(
    `The biggest universal mistake? Overpricing. Homes that sit on the market too long become stigmatized. ` +
    `With an average of ${g.avgDaysOnMarket} days on market in ${stateName}, price competitively from day one.`
  );
  sections.push({
    heading: `Common FSBO Mistakes in ${stateName}`,
    content: mistakeLines.join('\n\n'),
  });

  // Section 6: Resources
  const resourceLines: string[] = [];
  resourceLines.push(
    `- **${g.commissionName}:** [${g.realEstateCommissionUrl}](${g.realEstateCommissionUrl}) — Your state regulatory body for real estate transactions, licensing complaints, and official forms.`
  );
  resourceLines.push(
    `- **Flat-Fee MLS Services:** Search for "${stateName} flat fee MLS" to find local services that list your home on the MLS for a one-time fee of $200-$500.`
  );
  if (s.attorneyRequired === 'yes' || s.attorneyRequired === 'customary') {
    resourceLines.push(
      `- **Find a Real Estate Attorney:** Contact your local bar association for referrals to attorneys experienced in ${stateName} residential real estate closings.`
    );
  }
  resourceLines.push(
    `- **Home Valuation Tools:** Use Zillow's Zestimate, Redfin Estimate, and recent comparable sales to price your home. Consider a professional appraisal for the most accurate valuation.`
  );
  resourceLines.push(
    `- **First Door Key FSBO Calculator:** Use our Net Proceeds Calculator to estimate your actual take-home amount after all ${stateName} closing costs.`
  );
  sections.push({
    heading: 'Resources',
    content: resourceLines.join('\n\n'),
  });

  // Build meta description
  const metaDescription = `Learn how to sell your home without a realtor in ${stateName}. Save ${fmtDollars(savings)}+ in commissions. ${s.attorneyRequired === 'yes' ? 'Attorney required. ' : ''}Step-by-step FSBO guide with ${stateName} costs and legal requirements.`;

  return {
    title: `How to Sell Your Home Without a Realtor in ${stateName}`,
    slug: `sell-home-without-realtor-${slug}`,
    metaDescription: metaDescription.length > 160 ? metaDescription.substring(0, 157) + '...' : metaDescription,
    sections,
  };
}

// Generate all 51 articles (50 states + DC)
export const stateArticles: Record<string, StateArticle> = {};
for (const abbr of Object.keys(states)) {
  stateArticles[abbr] = generateArticle(abbr);
}
