import { useState } from 'react';
import { states, stateList } from './data/states';
import type { StateData } from './types';
import { ChecklistTab } from './components/checklist/ChecklistTab';
import { CalculatorTab } from './components/calculator/CalculatorTab';
import { FAQTab } from './components/faq/FAQTab';
import { BuyerInfoTab } from './components/buyer/BuyerInfoTab';

const tabs = ['Checklist', 'Net Proceeds Calculator', 'FAQ', 'Buyer Info'] as const;
type Tab = typeof tabs[number];

export default function App() {
  const [selectedState, setSelectedState] = useState<string>(() => localStorage.getItem('fsbo-state') || '');
  const [activeTab, setActiveTab] = useState<Tab>('Checklist');

  const stateData: StateData | null = selectedState ? states[selectedState] : null;

  const handleStateChange = (abbr: string) => {
    setSelectedState(abbr);
    localStorage.setItem('fsbo-state', abbr);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sell Your Home — Your Way</h1>
              <p className="text-blue-200 mt-1 text-sm sm:text-base">The complete For Sale By Owner guide, customized for your state</p>
            </div>
            <div className="flex-shrink-0">
              <select
                value={selectedState}
                onChange={e => handleStateChange(e.target.value)}
                className="w-full sm:w-56 px-4 py-2.5 rounded-lg bg-white text-gray-900 font-medium text-sm border-0 shadow-sm cursor-pointer"
              >
                <option value="">Select your state...</option>
                {stateList.map(s => (
                  <option key={s.abbreviation} value={s.abbreviation}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          {stateData && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <div className="text-xs text-blue-200 uppercase tracking-wide">Attorney Required</div>
                <div className="font-semibold text-sm mt-0.5 capitalize">{stateData.attorneyRequired === 'yes' ? '✓ Yes' : stateData.attorneyRequired === 'customary' ? '~ Customary' : stateData.attorneyRequired === 'varies' ? '~ Varies' : '✗ No'}</div>
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <div className="text-xs text-blue-200 uppercase tracking-wide">Transfer Tax</div>
                <div className="font-semibold text-sm mt-0.5">{stateData.transferTax.rate === 0 ? 'None' : stateData.transferTax.description.split('(')[0].trim()}</div>
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <div className="text-xs text-blue-200 uppercase tracking-wide">Closing Agent</div>
                <div className="font-semibold text-sm mt-0.5 capitalize">{stateData.closingAgent}</div>
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <div className="text-xs text-blue-200 uppercase tracking-wide">Property Tax Rate</div>
                <div className="font-semibold text-sm mt-0.5">{stateData.effectivePropertyTaxRate}%</div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* CTA Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <span className="text-amber-900"><strong>Need help pricing your home?</strong> Get a free consultation from our team.</span>
          <a href="mailto:ryan@rsfundmanagement.com" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap">Contact Ryan →</a>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto -mb-px">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* No State */}
      {!stateData && (
        <div className="max-w-5xl mx-auto px-4 py-16 text-center flex-1">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your State to Get Started</h2>
          <p className="text-gray-500 max-w-md mx-auto">Each state has different requirements for selling a home. Choose your state above to see personalized guidance, costs, and a step-by-step checklist.</p>
        </div>
      )}

      {/* Tab Content */}
      {stateData && (
        <main className="max-w-5xl mx-auto px-4 py-6 flex-1 w-full">
          {stateData.specialRules && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
              <strong>{stateData.name} Note:</strong> {stateData.specialRules}
            </div>
          )}
          {activeTab === 'Checklist' && <ChecklistTab state={stateData} />}
          {activeTab === 'Net Proceeds Calculator' && <CalculatorTab state={stateData} />}
          {activeTab === 'FAQ' && <FAQTab />}
          {activeTab === 'Buyer Info' && <BuyerInfoTab state={stateData} />}
        </main>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-2">Need Help Selling FSBO?</h3>
              <p className="text-sm mb-3">Our team provides flat-fee consulting for every step — pricing, marketing, negotiation, and closing.</p>
              <a href="mailto:ryan@rsfundmanagement.com" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium text-sm transition-colors">Email ryan@rsfundmanagement.com</a>
            </div>
            <div className="text-xs leading-relaxed">
              <p className="font-semibold text-gray-300 mb-1">Disclaimer</p>
              <p>This website provides educational information only and does not constitute legal, financial, or real estate advice. Laws vary by state and change frequently. Always consult a licensed real estate attorney. Tax information is general — consult a CPA for your situation.</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-800 text-xs text-center">© {new Date().getFullYear()} RS Fund Management — rsfundmanagement.com</div>
        </div>
      </footer>
    </div>
  );
}
