import { stateArticles } from '../../data/stateArticles';
import { states, stateList } from '../../data/states';

interface ArticleIndexProps {
  onNavigateHome: () => void;
  onSelectState: (abbr: string) => void;
}

export function ArticleIndex({ onNavigateHome, onSelectState }: ArticleIndexProps) {
  // Group states by first letter for easier scanning
  const sortedStates = stateList.map(s => s.abbreviation);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <nav className="text-sm text-blue-200 mb-3 flex items-center gap-2">
            <button onClick={onNavigateHome} className="hover:text-white transition-colors">Home</button>
            <span>/</span>
            <span className="text-white">State Guides</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">FSBO Guides for All 50 States</h1>
          <p className="text-blue-200 mt-1 text-sm sm:text-base">
            Comprehensive For Sale By Owner guides with state-specific legal requirements, costs, and step-by-step instructions.
          </p>
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedStates.map(abbr => {
            const article = stateArticles[abbr];
            const state = states[abbr];
            if (!article || !state) return null;

            const attorneyBadge = state.attorneyRequired === 'yes'
              ? 'Attorney Required'
              : state.attorneyRequired === 'customary'
                ? 'Attorney Customary'
                : null;

            const transferTaxLabel = state.transferTax.rate === 0 && !state.transferTax.tiered
              ? 'No Transfer Tax'
              : state.transferTax.description.split('(')[0].trim();

            return (
              <button
                key={abbr}
                onClick={() => onSelectState(abbr)}
                className="bg-white rounded-lg border border-gray-200 p-5 text-left hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {state.name}
                  </h3>
                  <span className="text-xs text-gray-400 font-mono">{abbr}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {attorneyBadge && (
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {attorneyBadge}
                    </span>
                  )}
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {transferTaxLabel}
                  </span>
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {state.effectivePropertyTaxRate}% property tax
                  </span>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {article.metaDescription}
                </p>

                <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                  Read Guide &rarr;
                </span>
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 text-xs text-gray-500 text-center">
          <p>This website provides educational information only and does not constitute legal, financial, or real estate advice. Always consult a licensed attorney or CPA.</p>
          <p className="mt-1">Content developed by First Door Key — financial planning and real estate professionals.</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} First Door Key — firstdoorkey.com</p>
        </div>
      </footer>
    </div>
  );
}
