import { useMemo } from 'react';
import { stateArticles } from '../../data/stateArticles';
import { states } from '../../data/states';

interface StateArticleProps {
  stateAbbr: string;
  onNavigateHome: (stateAbbr?: string) => void;
  onNavigateIndex: () => void;
}

function renderMarkdown(text: string): React.ReactElement[] {
  return text.split('\n\n').map((paragraph, i) => {
    // Handle list items
    if (paragraph.startsWith('- ')) {
      const items = paragraph.split('\n').filter(l => l.startsWith('- '));
      return (
        <ul key={i} className="list-disc list-inside space-y-2 text-gray-700">
          {items.map((item, j) => {
            const content = item.replace(/^- /, '');
            return <li key={j} dangerouslySetInnerHTML={{ __html: boldify(linkify(content)) }} />;
          })}
        </ul>
      );
    }
    // Handle step headers (bold at start)
    if (paragraph.startsWith('**Step ')) {
      return (
        <p key={i} className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: boldify(linkify(paragraph)) }} />
      );
    }
    return (
      <p key={i} className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: boldify(linkify(paragraph)) }} />
    );
  });
}

function boldify(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
}

function linkify(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>');
}

export function StateArticle({ stateAbbr, onNavigateHome, onNavigateIndex }: StateArticleProps) {
  const article = stateArticles[stateAbbr];
  const state = states[stateAbbr];

  const sectionIds = useMemo(() => {
    if (!article) return [];
    return article.sections.map(s => s.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
  }, [article]);

  if (!article || !state) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
        <p className="text-gray-500 mb-6">We don't have a guide for that state.</p>
        <button onClick={onNavigateIndex} className="text-blue-600 hover:underline">Browse all state guides</button>
      </div>
    );
  }

  return (
    <>
      {/* Schema.org Article markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.metaDescription,
            author: {
              '@type': 'Organization',
              name: 'First Door Key',
              url: 'https://firstdoorkey.com',
            },
            publisher: {
              '@type': 'Organization',
              name: 'First Door Key',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://firstdoorkey.com/#guide-${stateAbbr}`,
            },
          }),
        }}
      />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-blue-200 mb-3 flex items-center gap-2">
              <button onClick={() => onNavigateHome()} className="hover:text-white transition-colors">Home</button>
              <span>/</span>
              <button onClick={onNavigateIndex} className="hover:text-white transition-colors">State Guides</button>
              <span>/</span>
              <span className="text-white">{state.name}</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{article.title}</h1>
            <p className="text-blue-200 mt-2 text-sm">{article.metaDescription}</p>
          </div>
        </header>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto px-4 py-8 flex-1 w-full">
          {/* Table of Contents */}
          <nav className="mb-8 bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">In This Guide</h2>
            <ol className="space-y-2">
              {article.sections.map((section, i) => (
                <li key={i}>
                  <a
                    href={`#${sectionIds[i]}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                  >
                    {i + 1}. {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* State Quick Facts */}
          <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Attorney Required</div>
              <div className="font-semibold text-sm mt-1 capitalize text-gray-900">
                {state.attorneyRequired === 'yes' ? 'Yes' : state.attorneyRequired === 'customary' ? 'Customary' : 'No'}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Transfer Tax</div>
              <div className="font-semibold text-sm mt-1 text-gray-900">
                {state.transferTax.rate === 0 && !state.transferTax.tiered ? 'None' : state.transferTax.description.split('(')[0].trim()}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Closing Agent</div>
              <div className="font-semibold text-sm mt-1 capitalize text-gray-900">{state.closingAgent}</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Property Tax Rate</div>
              <div className="font-semibold text-sm mt-1 text-gray-900">{state.effectivePropertyTaxRate}%</div>
            </div>
          </div>

          {/* Sections */}
          {article.sections.map((section, i) => (
            <section key={i} id={sectionIds[i]} className="mb-8 scroll-mt-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                {section.heading}
              </h2>
              <div className="space-y-4">
                {renderMarkdown(section.content)}
              </div>
            </section>
          ))}

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 text-center">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Ready to sell your home in {state.name}?</h3>
            <p className="text-blue-700 text-sm mb-4">
              Use our free FSBO toolkit — customized checklists, net proceeds calculator, disclosure templates, and more.
            </p>
            <button
              onClick={() => onNavigateHome(stateAbbr)}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors"
            >
              Open {state.name} FSBO Toolkit
            </button>
          </div>

          {/* Back link */}
          <div className="mt-8 text-center">
            <button onClick={onNavigateIndex} className="text-blue-600 hover:underline text-sm">
              &larr; Browse all 50 state guides
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-100 border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4 py-4 text-xs text-gray-500 text-center">
            <p>This website provides educational information only and does not constitute legal, financial, or real estate advice. Always consult a licensed attorney or CPA.</p>
            <p className="mt-1">Content developed by First Door Key — financial planning and real estate professionals.</p>
            <p className="mt-1">&copy; {new Date().getFullYear()} First Door Key — firstdoorkey.com</p>
          </div>
        </footer>
      </div>
    </>
  );
}
