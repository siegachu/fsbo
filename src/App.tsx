import { useState, useEffect, useCallback } from 'react';
import { states, stateList } from './data/states';
import type { StateData } from './types';
import { ChecklistTab } from './components/checklist/ChecklistTab';
import { CalculatorTab } from './components/calculator/CalculatorTab';
import { FAQTab } from './components/faq/FAQTab';
import { BuyerInfoTab } from './components/buyer/BuyerInfoTab';
import { TemplatesTab } from './components/templates/TemplatesTab';
import { StateArticle } from './components/articles/StateArticle';
import { ArticleIndex } from './components/articles/ArticleIndex';

const tabs = ['Checklist', 'Net Proceeds Calculator', 'FAQ', 'Buyer Info', 'Templates', 'Contact & Help Pricing'] as const;
type Tab = typeof tabs[number];

type View = 'app' | 'guides' | 'guide';

function parseHash(): { view: View; guideState?: string } {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'guides') return { view: 'guides' };
  if (hash.startsWith('guide-')) {
    const abbr = hash.replace('guide-', '').toUpperCase();
    if (states[abbr]) return { view: 'guide', guideState: abbr };
  }
  return { view: 'app' };
}

export default function App() {
  const [selectedState, setSelectedState] = useState<string>(() => localStorage.getItem('fsbo-state') || '');
  const [activeTab, setActiveTab] = useState<Tab>('Checklist');
  const [currentView, setCurrentView] = useState<View>(() => parseHash().view);
  const [guideState, setGuideState] = useState<string>(() => parseHash().guideState || '');

  useEffect(() => {
    const onHashChange = () => {
      const { view, guideState: gs } = parseHash();
      setCurrentView(view);
      setGuideState(gs || '');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateHome = useCallback((stateAbbr?: string) => {
    if (stateAbbr) {
      setSelectedState(stateAbbr);
      localStorage.setItem('fsbo-state', stateAbbr);
    }
    window.location.hash = '';
    setCurrentView('app');
  }, []);

  const navigateGuides = useCallback(() => {
    window.location.hash = 'guides';
    setCurrentView('guides');
    window.scrollTo(0, 0);
  }, []);

  const navigateGuide = useCallback((abbr: string) => {
    window.location.hash = `guide-${abbr}`;
    setGuideState(abbr);
    setCurrentView('guide');
    window.scrollTo(0, 0);
  }, []);

  // Render article views
  if (currentView === 'guides') {
    return <ArticleIndex onNavigateHome={() => navigateHome()} onSelectState={navigateGuide} />;
  }
  if (currentView === 'guide' && guideState) {
    return <StateArticle stateAbbr={guideState} onNavigateHome={navigateHome} onNavigateIndex={navigateGuides} />;
  }

  const stateData: StateData | null = selectedState ? states[selectedState] : null;

  const handleStateChange = (abbr: string) => {
    setSelectedState(abbr);
    localStorage.setItem('fsbo-state', abbr);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-3 py-3">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Sell Your Home — Your Way</h1>
            <p className="text-blue-200 mt-0.5 text-xs sm:text-sm">The complete For Sale By Owner guide, customized for your state</p>
          </div>
          {stateData && (
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-white/10 rounded-lg px-2 py-1.5">
                <div className="text-[10px] text-blue-200 uppercase tracking-wide">Attorney Required</div>
                <div className="font-semibold text-xs mt-0.5 capitalize">{stateData.attorneyRequired === 'yes' ? '✓ Yes' : stateData.attorneyRequired === 'customary' ? '~ Customary' : stateData.attorneyRequired === 'varies' ? '~ Varies' : '✗ No'}</div>
              </div>
              <div className="bg-white/10 rounded-lg px-2 py-1.5">
                <div className="text-[10px] text-blue-200 uppercase tracking-wide">Transfer Tax</div>
                <div className="font-semibold text-xs mt-0.5">{stateData.transferTax.rate === 0 ? 'None' : stateData.transferTax.description.split('(')[0].trim()}</div>
              </div>
              <div className="bg-white/10 rounded-lg px-2 py-1.5">
                <div className="text-[10px] text-blue-200 uppercase tracking-wide">Closing Agent</div>
                <div className="font-semibold text-xs mt-0.5 capitalize">{stateData.closingAgent}</div>
              </div>
              <div className="bg-white/10 rounded-lg px-2 py-1.5">
                <div className="text-[10px] text-blue-200 uppercase tracking-wide">Property Tax Rate</div>
                <div className="font-semibold text-xs mt-0.5">{stateData.effectivePropertyTaxRate}%</div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-3">
          <div className="flex overflow-x-auto -mb-px">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                {tab}
              </button>
            ))}
            <button
              onClick={navigateGuides}
              className="px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors ml-auto"
            >
              State Guides
            </button>
          </div>
        </div>
      </nav>

      {/* State Selector */}
      <div className="max-w-5xl mx-auto px-3 pt-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-gray-700">Your State:</label>
          <select
            value={selectedState}
            onChange={e => handleStateChange(e.target.value)}
            className="w-56 px-3 py-2 rounded-lg bg-white text-gray-900 font-medium text-xs border border-gray-300 shadow-sm cursor-pointer"
          >
            <option value="">Select your state...</option>
            {stateList.map(s => (
              <option key={s.abbreviation} value={s.abbreviation}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* No State */}
      {!stateData && (
        <div className="max-w-5xl mx-auto px-3 py-10 text-center flex-1">
          <div className="text-5xl mb-3">🏠</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1.5">Select Your State to Get Started</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">Each state has different requirements for selling a home. Choose your state to see personalized guidance, costs, and a step-by-step checklist.</p>
        </div>
      )}

      {/* Tab Content */}
      {stateData && (
        <main className="max-w-5xl mx-auto px-3 py-3 flex-1 w-full">
          {stateData.specialRules && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
              <strong>{stateData.name} Note:</strong> {stateData.specialRules}
            </div>
          )}
          {activeTab === 'Checklist' && <ChecklistTab state={stateData} />}
          {activeTab === 'Net Proceeds Calculator' && <CalculatorTab state={stateData} />}
          {activeTab === 'FAQ' && <FAQTab />}
          {activeTab === 'Buyer Info' && <BuyerInfoTab state={stateData} />}
          {activeTab === 'Templates' && <TemplatesTab state={stateData} />}
          {activeTab === 'Contact & Help Pricing' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Need Help Pricing Your Home?</h2>
                <p className="text-gray-600 mb-4">Our team provides flat-fee consulting for every step — pricing, marketing, negotiation, and closing. Get a free consultation to make sure you're pricing competitively and maximizing your net proceeds.</p>
                <a href="mailto:ryan+firstdoorkey@rsfundmanagement.com" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors">Email ryan+firstdoorkey@rsfundmanagement.com →</a>
              </div>
            </div>
          )}
        </main>
      )}

      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-3 py-3 text-xs text-gray-500 text-center">
          <p>This website provides educational information only and does not constitute legal, financial, or real estate advice. Always consult a licensed attorney or CPA.</p>
          <p className="mt-1">Content developed by First Door Key — financial planning and real estate professionals.</p>
          <p className="mt-1">For comments and questions, reach out to <a href="mailto:ryan+firstdoorkey@rsfundmanagement.com" className="text-blue-600 hover:underline">ryan+firstdoorkey@rsfundmanagement.com</a></p>
          <p className="mt-2 text-gray-400">
            Explore our other sites:{" "}
            <a href="https://quotedtruth.com" className="text-blue-600 hover:underline">Quoted Truth</a>
            {" | "}
            <a href="https://askairight.com" className="text-blue-600 hover:underline">Ask It Right</a>
            {" | "}
            <a href="https://stock.rsfundmanagement.com" className="text-blue-600 hover:underline">Stock Research</a>
          </p>
          <p className="mt-1">© {new Date().getFullYear()} First Door Key — firstdoorkey.com</p>
        </div>
      </footer>
    </div>
  );
}
