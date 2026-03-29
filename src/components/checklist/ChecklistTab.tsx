import type { StateData } from '../../types';
import { phases } from '../../data/checklist';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useState } from 'react';

export function ChecklistTab({ state }: { state: StateData }) {
  const [completed, setCompleted] = useLocalStorage<Record<number, boolean>>('fsbo-checklist', {});
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);
  const completedCount = Object.values(completed).filter(Boolean).length;

  const toggle = (id: number) => setCompleted(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{completedCount} of {totalSteps} steps completed</span>
          <span className="text-sm text-gray-500">{Math.round((completedCount / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${(completedCount / totalSteps) * 100}%` }} />
        </div>
      </div>

      {/* Phases */}
      {phases.map(phase => (
        <div key={phase.number} className="mb-4">
          <button
            onClick={() => setExpandedPhase(expandedPhase === phase.number ? null : phase.number)}
            className="w-full flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                {phase.number}
              </span>
              <span className="font-semibold text-gray-900">{phase.name}</span>
              <span className="text-xs text-gray-400">
                {phase.steps.filter(s => completed[s.id]).length}/{phase.steps.length}
              </span>
            </div>
            <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedPhase === phase.number ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>

          {expandedPhase === phase.number && (
            <div className="mt-2 space-y-2">
              {phase.steps.map(step => (
                <div key={step.id} className={`bg-white rounded-lg border p-4 transition-colors ${completed[step.id] ? 'border-green-200 bg-green-50/50' : 'border-gray-200'}`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={!!completed[step.id]}
                      onChange={() => toggle(step.id)}
                      className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 cursor-pointer flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className={`font-medium ${completed[step.id] ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {step.title}
                        </h4>
                        {step.professionalNeeded && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                            Pro: {step.professionalType}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <span className="text-gray-500">💰 {step.estimatedCost}</span>
                        <span className="text-gray-500">⏱ {step.estimatedTime}</span>
                      </div>
                      {step.professionalNeeded && state.attorneyRequired === 'yes' && step.professionalType?.includes('Attorney') && (
                        <div className="mt-2 text-xs bg-amber-50 text-amber-800 px-3 py-1.5 rounded border border-amber-200">
                          ⚠️ {state.name} requires an attorney at closing — this step is mandatory in your state.
                        </div>
                      )}
                      {step.tip && (
                        <div className="mt-2 text-xs bg-blue-50 text-blue-800 px-3 py-1.5 rounded border border-blue-200">
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
    </div>
  );
}
