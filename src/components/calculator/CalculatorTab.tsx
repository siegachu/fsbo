import { useState } from 'react';
import type { StateData } from '../../types';
import { calculateNetProceeds, formatCurrency } from '../../utils/calculator';

export function CalculatorTab({ state }: { state: StateData }) {
  const [salePrice, setSalePrice] = useState(400000);
  const [mortgage, setMortgage] = useState(250000);
  const [buyerComm, setBuyerComm] = useState(0);
  const [flatFee, setFlatFee] = useState(399);
  const [attorneyFees, setAttorneyFees] = useState(state.attorneyRequired !== 'no' ? 1200 : 750);
  const [repairs, setRepairs] = useState(2000);
  const [photography, setPhotography] = useState(400);

  const result = calculateNetProceeds({
    salePrice, mortgageBalance: mortgage, state: state.abbreviation,
    buyerAgentCommission: buyerComm, flatFeeMLS: flatFee, attorneyFees, repairCosts: repairs, photography,
  });

  const Field = ({ label, value, onChange, prefix, suffix, step, min, max }: { label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string; step?: number; min?: number; max?: number }) => (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-0.5">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          step={step || 1}
          min={min}
          max={max}
          className={`w-full border border-gray-300 rounded-lg py-1.5 text-xs ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{suffix}</span>}
      </div>
    </div>
  );

  const Row = ({ label, amount, highlight, negative }: { label: string; amount: number; highlight?: boolean; negative?: boolean }) => (
    <div className={`flex justify-between py-1 ${highlight ? 'font-bold text-base' : 'text-xs'} ${highlight ? (amount >= 0 ? 'text-green-700' : 'text-red-700') : negative ? 'text-red-600' : 'text-gray-700'}`}>
      <span>{label}</span>
      <span>{negative && amount > 0 ? '−' : ''}{formatCurrency(Math.abs(amount))}</span>
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 gap-3">
      {/* Inputs */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-xs text-gray-900 mb-2">Your Sale Details</h3>
        <div className="space-y-2">
          <Field label="Sale Price" value={salePrice} onChange={setSalePrice} prefix="$" step={5000} min={0} />
          <Field label="Mortgage Balance" value={mortgage} onChange={setMortgage} prefix="$" step={5000} min={0} />
          <Field label="Buyer Agent Commission" value={buyerComm} onChange={setBuyerComm} suffix="%" step={0.1} min={0} max={6} />
          <Field label="Flat-Fee MLS Listing" value={flatFee} onChange={setFlatFee} prefix="$" step={50} min={0} />
          <Field label="Attorney / Title Fees" value={attorneyFees} onChange={setAttorneyFees} prefix="$" step={100} min={0} />
          <Field label="Repairs & Staging" value={repairs} onChange={setRepairs} prefix="$" step={500} min={0} />
          <Field label="Photography & Marketing" value={photography} onChange={setPhotography} prefix="$" step={50} min={0} />
        </div>
        <p className="text-[10px] text-gray-400 mt-2">Transfer tax and title insurance are auto-calculated based on {state.name} rates.</p>
      </div>

      {/* Results */}
      <div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-xs text-gray-900 mb-2">Estimated Net Proceeds</h3>
          <div className="divide-y divide-gray-100">
            <Row label="Sale Price" amount={result.salePrice} />
            <div className="pt-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Costs & Fees</p>
              <Row label={`Transfer Tax (${state.name})`} amount={result.transferTax} negative />
              <Row label="Title Insurance (est.)" amount={result.titleInsurance} negative />
              <Row label="Attorney / Title Fees" amount={result.attorneyFees} negative />
              <Row label="Flat-Fee MLS" amount={result.flatFeeMLS} negative />
              <Row label={`Buyer Agent Commission (${buyerComm}%)`} amount={result.buyerAgentCommission} negative />
              <Row label="Photography & Marketing" amount={result.photography} negative />
              <Row label="Repairs & Staging" amount={result.repairCosts} negative />
              <Row label="Other Closing Costs (est.)" amount={result.otherClosingCosts} negative />
            </div>
            <Row label="Total Costs" amount={result.totalCosts} negative />
            <Row label="Mortgage Payoff" amount={result.mortgagePayoff} negative />
            <div className="pt-2">
              <Row label="Estimated Net Proceeds" amount={result.netProceeds} highlight />
            </div>
          </div>
        </div>

        <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
          <strong>Capital gains tax not included.</strong> Most primary residence sellers qualify for the $250K/$500K exclusion.
          For complex tax situations (investment properties, 1031 exchanges, cost segregation), consult a tax professional at <a href="https://www.hrblock.com" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:underline">hrblock.com</a>.
        </div>

        {/* Comparison */}
        <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3">
          <h4 className="font-semibold text-green-900 text-xs mb-1">FSBO vs Full-Service Agent Comparison</h4>
          <div className="text-xs text-green-800 space-y-0.5">
            <div className="flex justify-between"><span>Your FSBO costs:</span><span className="font-mono">{formatCurrency(result.totalCosts)}</span></div>
            <div className="flex justify-between"><span>Full-service agent costs (5.5%):</span><span className="font-mono">{formatCurrency(salePrice * 0.055 + result.titleInsurance + result.transferTax + result.otherClosingCosts)}</span></div>
            <div className="flex justify-between font-bold border-t border-green-300 pt-1 mt-1"><span>You save approximately:</span><span className="font-mono text-green-700">{formatCurrency(salePrice * 0.055 + result.titleInsurance + result.transferTax + result.otherClosingCosts - result.totalCosts)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
