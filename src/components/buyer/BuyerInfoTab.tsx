import type { StateData } from '../../types';
import { buyerSections } from '../../data/buyerInfo';

export function BuyerInfoTab({ state }: { state: StateData }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Information Packet for Your Buyer</h2>
        <p className="text-sm text-gray-600">Share this information with potential buyers so the sale can proceed smoothly without agents on either side. Customize for {state.name}.</p>
      </div>

      <div className="space-y-6">
        {buyerSections.map((section, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{i + 1}</span>
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* State-specific closing note */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h3 className="font-semibold text-gray-900 mb-2">{state.name}-Specific Information for Buyers</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Closing Agent:</strong> In {state.name}, closings are typically handled by {state.closingAgent === 'attorney' ? 'a real estate attorney' : state.closingAgent === 'escrow' ? 'an escrow company' : state.closingAgent === 'title' ? 'a title company' : 'either an attorney or title company'}.</p>
          <p><strong>Attorney:</strong> {state.attorneyRequired === 'yes' ? `An attorney is required at closing in ${state.name}.` : state.attorneyRequired === 'customary' ? `While not legally required, attorneys are customary at closing in ${state.name}.` : `An attorney is not required at closing in ${state.name}, but is recommended for FSBO transactions.`}</p>
          <p><strong>Disclosure Form:</strong> The seller is required to provide the "{state.disclosureForm}" in {state.name}.</p>
          <p><strong>Transfer Tax:</strong> {state.transferTax.rate === 0 ? `${state.name} has no state transfer tax.` : `${state.name}'s transfer tax is ${state.transferTax.description}. This is typically paid by the ${state.transferTax.whoPays}.`}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-5 text-center">
        <h3 className="font-semibold text-amber-900 mb-1">Want a professionally formatted buyer packet for {state.name}?</h3>
        <p className="text-sm text-amber-700 mb-3">We can prepare a complete buyer information packet customized to your property and state requirements.</p>
        <a href="mailto:ryan@rsfundmanagement.com" className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-md font-medium text-sm transition-colors">Contact ryan@rsfundmanagement.com</a>
      </div>
    </div>
  );
}
