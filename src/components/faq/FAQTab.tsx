import { useState } from 'react';
import { faqItems, faqCategories } from '../../data/faq';

export function FAQTab() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState(faqCategories[0]);

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {faqCategories.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setExpanded(null); }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-2">
        {faqItems.filter(f => f.category === activeCategory).map(item => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900 text-sm pr-4">{item.question}</span>
              <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${expanded === item.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {expanded === item.id && (
              <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-5 text-center">
        <h3 className="font-semibold text-blue-900 mb-1">Have a complex tax or legal question?</h3>
        <p className="text-sm text-blue-700 mb-3">Our team can help with 1031 exchanges, cost segregation, FIRPTA compliance, and more.</p>
        <a href="mailto:ryan@rsfundmanagement.com" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium text-sm transition-colors">Contact ryan@rsfundmanagement.com</a>
      </div>
    </div>
  );
}
