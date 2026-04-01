import { useState } from 'react';
import { faqItems, faqCategories } from '../../data/faq';

export function FAQTab() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState(faqCategories[0]);

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {faqCategories.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setExpanded(null); }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-1">
        {faqItems.filter(f => f.category === activeCategory).map(item => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900 text-xs pr-3">{item.question}</span>
              <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${expanded === item.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {expanded === item.id && (
              <div className="px-3 pb-3 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-2">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Flat-Fee MLS Info Box */}
      <div className="mt-4 bg-white rounded-lg border-2 border-blue-200 overflow-hidden">
        <div className="bg-blue-600 px-4 py-2">
          <h3 className="font-bold text-white text-xs">Flat-Fee MLS Listing: The FSBO Seller's Best Tool</h3>
        </div>
        <div className="px-4 py-3 space-y-2">
          <div>
            <h4 className="font-semibold text-gray-900 text-xs mb-0.5">What is a flat-fee MLS listing?</h4>
            <p className="text-xs text-gray-600">Instead of paying a listing agent 2.5-3% commission ($10,000-$12,000 on a $400K home), you pay a one-time flat fee of $200-$500 to get your home listed on the Multiple Listing Service (MLS). The MLS automatically syndicates your listing to Zillow, Realtor.com, Redfin, Trulia, and hundreds of other sites.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-xs mb-0.5">How it works</h4>
            <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
              <li>Choose a flat-fee MLS service and pay $200-$500 (one-time)</li>
              <li>Provide your listing details, photos, and property description</li>
              <li>Your home appears on MLS within 24-48 hours, syndicated to all major sites</li>
              <li>You handle showings, negotiations, and communication directly</li>
              <li>After the 2024 NAR settlement, set buyer agent commission to 0% — buyers pay their own agent</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-xs mb-0.5">Benefits for FSBO sellers</h4>
            <ul className="text-xs text-gray-600 space-y-0.5">
              <li className="flex items-start gap-2"><span className="text-green-600 font-bold">&#x2713;</span> Save $10,000-$24,000 vs. traditional listing agent commission</li>
              <li className="flex items-start gap-2"><span className="text-green-600 font-bold">&#x2713;</span> Same exposure as agent-listed homes (MLS + Zillow/Redfin/Realtor.com)</li>
              <li className="flex items-start gap-2"><span className="text-green-600 font-bold">&#x2713;</span> You retain full control of pricing, showings, and negotiations</li>
              <li className="flex items-start gap-2"><span className="text-green-600 font-bold">&#x2713;</span> Most services include 6-12 month listing period</li>
              <li className="flex items-start gap-2"><span className="text-green-600 font-bold">&#x2713;</span> No obligation to pay buyer agent commission (post-NAR settlement)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-xs mb-0.5">What to look for in a flat-fee service</h4>
            <ul className="text-xs text-gray-600 space-y-0.5">
              <li className="flex items-start gap-2"><span className="text-blue-600">&#x2022;</span> Listing duration (6-12 months is standard)</li>
              <li className="flex items-start gap-2"><span className="text-blue-600">&#x2022;</span> Number of photos allowed (25+ is ideal)</li>
              <li className="flex items-start gap-2"><span className="text-blue-600">&#x2022;</span> Ability to set buyer agent commission to $0</li>
              <li className="flex items-start gap-2"><span className="text-blue-600">&#x2022;</span> No hidden fees at closing (some charge a "success fee")</li>
              <li className="flex items-start gap-2"><span className="text-blue-600">&#x2022;</span> Ability to make unlimited changes to your listing</li>
              <li className="flex items-start gap-2"><span className="text-blue-600">&#x2022;</span> Reviews and BBB rating of the service provider</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-700">
            <strong>Top flat-fee MLS services:</strong> Houzeo ($349-$399), ISoldMyHouse ($299-$399), Beycome ($99-$499). Prices vary by state and package level.
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900">
        <strong>Need professional help?</strong> Find a real estate attorney at <a href="https://www.legalzoom.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">legalzoom.com</a>, a tax professional at <a href="https://www.hrblock.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">hrblock.com</a>, or compare mortgage rates at <a href="https://www.bankrate.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">bankrate.com</a>.
      </div>
    </div>
  );
}
