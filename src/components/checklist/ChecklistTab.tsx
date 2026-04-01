import type { StateData } from '../../types';
import { phases } from '../../data/checklist';
import { stateGuides } from '../../data/stateGuides';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useState } from 'react';

export function ChecklistTab({ state }: { state: StateData }) {
  const [completed, setCompleted] = useLocalStorage<Record<number, boolean>>('fsbo-checklist', {});
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);
  const completedCount = Object.values(completed).filter(Boolean).length;

  const toggle = (id: number) => setCompleted(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div>
      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-700">{completedCount} of {totalSteps} steps completed</span>
          <span className="text-xs text-gray-500">{Math.round((completedCount / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(completedCount / totalSteps) * 100}%` }} />
        </div>
      </div>

      {/* Phases */}
      {phases.map(phase => (
        <div key={phase.number} className="mb-2">
          <button
            onClick={() => setExpandedPhase(expandedPhase === phase.number ? null : phase.number)}
            className="w-full flex items-center justify-between bg-white rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {phase.number}
              </span>
              <span className="font-semibold text-xs text-gray-900">{phase.name}</span>
              <span className="text-[10px] text-gray-400">
                {phase.steps.filter(s => completed[s.id]).length}/{phase.steps.length}
              </span>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedPhase === phase.number ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>

          {expandedPhase === phase.number && (
            <div className="mt-1 space-y-1">
              {phase.steps.map(step => (
                <div key={step.id} className={`bg-white rounded-lg border p-3 transition-colors ${completed[step.id] ? 'border-green-200 bg-green-50/50' : 'border-gray-200'}`}>
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!completed[step.id]}
                      onChange={() => toggle(step.id)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                        <h4 className={`text-xs font-medium ${completed[step.id] ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {step.title}
                        </h4>
                        {step.professionalNeeded && (
                          <a
                            href={
                              step.professionalType?.includes('Attorney') ? 'https://www.legalzoom.com' :
                              step.professionalType?.includes('Inspector') ? 'https://www.bankrate.com' :
                              step.professionalType?.includes('Appraiser') ? 'https://www.bankrate.com' :
                              step.professionalType?.includes('Title') ? 'https://www.legalzoom.com' :
                              '#'
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-medium hover:bg-purple-200 transition-colors"
                          >
                            {step.professionalType}
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{step.description}</p>
                      <div className="flex flex-wrap gap-2 text-[10px]">
                        <span className="text-gray-500">💰 {step.estimatedCost}</span>
                        <span className="text-gray-500">⏱ {step.estimatedTime}</span>
                      </div>
                      {step.professionalNeeded && state.attorneyRequired === 'yes' && step.professionalType?.includes('Attorney') && (
                        <div className="mt-1 text-[10px] bg-amber-50 text-amber-800 px-2 py-1 rounded border border-amber-200">
                          ⚠️ {state.name} requires an attorney at closing — this step is mandatory in your state.
                        </div>
                      )}
                      {step.tip && (
                        <div className="mt-1 text-[10px] bg-blue-50 text-blue-800 px-2 py-1 rounded border border-blue-200">
                          💡 {step.tip}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* State Guide */}
      {(() => {
        const guide = stateGuides[state.abbreviation];
        if (!guide) return null;
        return (
          <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center">
                &#x1F4CD;
              </span>
              {state.name} FSBO Guide
            </h3>

            <div className="grid gap-2 sm:grid-cols-2 mb-2">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Attorney Required</div>
                <div className="font-semibold text-xs text-gray-900 capitalize">
                  {state.attorneyRequired === 'yes' ? 'Yes -- mandatory' : state.attorneyRequired === 'customary' ? 'Customary (strongly recommended)' : state.attorneyRequired === 'varies' ? 'Varies by county' : 'No (but recommended for FSBO)'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Transfer Tax</div>
                <div className="font-semibold text-xs text-gray-900">{state.transferTax.rate === 0 ? 'None' : state.transferTax.description}</div>
                {state.transferTax.whoPays !== 'n/a' && (
                  <div className="text-[10px] text-gray-500 mt-0.5">Typically paid by: <span className="capitalize">{state.transferTax.whoPays}</span></div>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Avg. Days on Market</div>
                <div className="font-semibold text-xs text-gray-900">{guide.avgDaysOnMarket} days</div>
                <div className="text-[10px] text-gray-500 mt-0.5">FSBO median (varies by market)</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">Property Tax Rate</div>
                <div className="font-semibold text-xs text-gray-900">{state.effectivePropertyTaxRate}%</div>
                <div className="text-[10px] text-gray-500 mt-0.5">Effective rate (statewide average)</div>
              </div>
            </div>

            {/* Common Pitfalls */}
            <div className="mb-2">
              <h4 className="font-semibold text-gray-900 text-xs mb-1">Common FSBO Pitfalls in {state.name}:</h4>
              <ul className="space-y-1">
                {guide.commonPitfalls.map((pitfall, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">&#x26A0;</span>
                    <span>{pitfall}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* State Commission Link */}
            <div className="border-t border-gray-200 pt-2">
              <a
                href={guide.realEstateCommissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                {guide.commissionName}
              </a>
              <p className="text-[10px] text-gray-500 mt-0.5">Official state regulatory body for real estate transactions</p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
