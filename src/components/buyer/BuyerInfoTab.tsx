import type { StateData } from '../../types';
import { buyerSections } from '../../data/buyerInfo';

export function BuyerInfoTab({ state }: { state: StateData }) {
  return (
    <div>
      <div className="mb-3">
        <h2 className="text-lg font-bold text-gray-900 mb-0.5">Information Packet for Your Buyer</h2>
        <p className="text-xs text-gray-600">Share this information with potential buyers so the sale can proceed smoothly without agents on either side. Customize for {state.name}.</p>
      </div>

      <div className="space-y-3">
        {buyerSections.map((section, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-xs text-gray-900 mb-1.5 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{i + 1}</span>
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* State-specific closing note */}
      <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-xs text-gray-900 mb-1">{state.name}-Specific Information for Buyers</h3>
        <div className="text-xs text-gray-700 space-y-1">
          <p><strong>Closing Agent:</strong> In {state.name}, closings are typically handled by {state.closingAgent === 'attorney' ? 'a real estate attorney' : state.closingAgent === 'escrow' ? 'an escrow company' : state.closingAgent === 'title' ? 'a title company' : 'either an attorney or title company'}.</p>
          <p><strong>Attorney:</strong> {state.attorneyRequired === 'yes' ? `An attorney is required at closing in ${state.name}.` : state.attorneyRequired === 'customary' ? `While not legally required, attorneys are customary at closing in ${state.name}.` : `An attorney is not required at closing in ${state.name}, but is recommended for FSBO transactions.`}</p>
          <p><strong>Disclosure Form:</strong> The seller is required to provide the "{state.disclosureForm}" in {state.name}.</p>
          <p><strong>Transfer Tax:</strong> {state.transferTax.rate === 0 ? `${state.name} has no state transfer tax.` : `${state.name}'s transfer tax is ${state.transferTax.description}. This is typically paid by the ${state.transferTax.whoPays}.`}</p>
        </div>
      </div>

      {/* Professional Resources */}
      <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
        <strong>Buyer resources:</strong> Find a real estate attorney at <a href="https://www.legalzoom.com" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:underline">legalzoom.com</a>, compare mortgage rates at <a href="https://www.bankrate.com" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:underline">bankrate.com</a>, or find an agent at <a href="https://www.coldwellbanker.com" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:underline">coldwellbanker.com</a>.
      </div>
    </div>
  );
}
