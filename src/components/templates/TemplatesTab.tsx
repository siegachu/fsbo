import type { StateData } from '../../types';

interface Template {
  id: number;
  title: string;
  description: string;
  icon: string;
  stateRequired: boolean;
  requiredStates?: string[];
  universal: boolean;
}

const templates: Template[] = [
  {
    id: 1,
    title: 'Purchase & Sale Agreement',
    description: 'The core contract between buyer and seller. Covers price, contingencies, closing date, and terms. Customizable for your state\'s legal requirements.',
    icon: '\u{1F4DD}',
    stateRequired: false,
    universal: true,
  },
  {
    id: 2,
    title: 'Seller Disclosure Form',
    description: 'State-specific property condition disclosure. Required in most states to disclose known defects, environmental hazards, and material facts about the property.',
    icon: '\u{1F4CB}',
    stateRequired: true,
    universal: false,
  },
  {
    id: 3,
    title: 'Lead Paint Disclosure',
    description: 'Federally required for all homes built before 1978. Discloses known lead-based paint hazards and provides the EPA pamphlet to buyers.',
    icon: '\u{26A0}\u{FE0F}',
    stateRequired: false,
    universal: true,
  },
  {
    id: 4,
    title: 'Counter-Offer Form',
    description: 'Respond to a buyer\'s offer with modified terms. Covers price adjustments, closing date changes, contingency modifications, and repair requests.',
    icon: '\u{1F504}',
    stateRequired: false,
    universal: true,
  },
  {
    id: 5,
    title: 'Property Condition Addendum',
    description: 'Supplements the purchase agreement with detailed property condition terms. Addresses inspection results, repair agreements, and as-is provisions.',
    icon: '\u{1F3E0}',
    stateRequired: false,
    universal: true,
  },
  {
    id: 6,
    title: 'Home Inspection Checklist',
    description: 'Comprehensive checklist covering structural, electrical, plumbing, HVAC, roof, and foundation items. Use before listing to identify and address issues proactively.',
    icon: '\u{1F50D}',
    stateRequired: false,
    universal: true,
  },
  {
    id: 7,
    title: 'Buyer Pre-Qualification Letter Template',
    description: 'Template to verify buyer financing before accepting an offer. Outlines what information to request and how to evaluate buyer financial readiness.',
    icon: '\u{1F4B0}',
    stateRequired: false,
    universal: true,
  },
  {
    id: 8,
    title: 'FSBO Marketing Checklist',
    description: 'Step-by-step marketing plan: professional photos, MLS listing, yard signs, social media, open house planning, and online listing optimization.',
    icon: '\u{1F4E3}',
    stateRequired: false,
    universal: true,
  },
];

const stateDisclosureNotes: Record<string, string> = {
  AL: 'Alabama requires a Property Disclosure Statement for all residential sales.',
  AK: 'Alaska requires disclosure of risk zones (avalanche, flood).',
  AZ: 'Arizona\'s SPDS is one of the most detailed in the US -- accuracy is critical.',
  CA: 'California has the most extensive disclosure requirements: TDS, Natural Hazard, earthquake, flood, and fire zone disclosures all required.',
  CO: 'Colorado requires state-mandated contract forms and a Water Rights Addendum.',
  CT: 'Connecticut is an attorney state -- all documents must be reviewed by counsel. Flood risk disclosure required since 2024.',
  DE: 'Delaware is an attorney state with the highest combined transfer tax (4%). Attorney must conduct settlement.',
  FL: 'Florida requires condo-specific disclosures from the HOA. Homestead status affects closing documents.',
  IL: 'Illinois is an attorney state. Radon and carbon monoxide hazard disclosures are mandatory.',
  LA: 'Louisiana is a civil law state -- attorney required for authentic act of sale. Flood zone disclosure mandatory.',
  MA: 'Massachusetts customarily requires an attorney. Smoke/CO certificate and lead paint inspection (pre-1978, child under 6) required.',
  NJ: 'New Jersey is an attorney state. CAFRA and Wetlands disclosures may be required.',
  NY: 'New York is an attorney state. The $500 PCDS opt-out has been eliminated. NYC has additional transfer taxes.',
  NC: 'North Carolina requires an attorney to close. The Due Diligence Fee is a critical contract component.',
  SC: 'South Carolina is an attorney state. A Legal Occupancy Letter from the county is required.',
  TX: 'Texas requires mandatory use of state-promulgated contract forms.',
  WA: 'Washington\'s Form 17 is extensive and legally binding. Highest tiered transfer tax rates in the US.',
};

function getStateRequirements(state: StateData): string[] {
  const reqs: string[] = [];
  if (state.disclosureRequired) {
    reqs.push(`Seller Disclosure Form (${state.disclosureForm}) -- required in ${state.name}`);
  }
  if (state.attorneyRequired === 'yes') {
    reqs.push(`Attorney review of all documents -- mandatory in ${state.name}`);
  } else if (state.attorneyRequired === 'customary') {
    reqs.push(`Attorney review -- customary in ${state.name} (strongly recommended)`);
  }
  return reqs;
}

export function TemplatesTab({ state }: { state: StateData }) {
  const stateNote = stateDisclosureNotes[state.abbreviation];
  const stateReqs = getStateRequirements(state);

  const mailtoBase = 'ryan+firstdoorkey@rsfundmanagement.com';

  const getMailtoLink = (template: Template) => {
    const subject = encodeURIComponent(`Template Request: ${template.title} (${state.name})`);
    const body = encodeURIComponent(
      `Hi,\n\nI'd like to request the "${template.title}" template for ${state.name}.\n\nThank you.`
    );
    return `mailto:${mailtoBase}?subject=${subject}&body=${body}`;
  };

  return (
    <div>
      {/* State Notice */}
      {stateNote && (
        <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
          <strong>{state.name} Note:</strong> {stateNote}
        </div>
      )}

      {/* State Requirements */}
      {stateReqs.length > 0 && (
        <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h3 className="font-semibold text-blue-900 text-xs mb-1">Required in {state.name}:</h3>
          <ul className="text-xs text-blue-800 space-y-0.5">
            {stateReqs.map((req, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">&#x2713;</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Intro */}
      <div className="mb-3">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Free FSBO Document Templates</h2>
        <p className="text-xs text-gray-600">
          These templates cover the essential documents you need to sell your home without an agent.
          Request any template and we will send you a version customized for {state.name}.
        </p>
      </div>

      {/* Template Cards */}
      <div className="grid gap-2 sm:grid-cols-2">
        {templates.map(template => {
          const isStateRequired = template.stateRequired && state.disclosureRequired;
          return (
            <div
              key={template.id}
              className={`bg-white rounded-lg border p-4 flex flex-col ${
                isStateRequired ? 'border-blue-300 ring-1 ring-blue-100' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-2 mb-1.5">
                <span className="text-xl flex-shrink-0">{template.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                    <h3 className="font-semibold text-gray-900 text-xs">{template.title}</h3>
                    {isStateRequired && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                        Required in {state.abbreviation}
                      </span>
                    )}
                    {template.universal && !template.stateRequired && (
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-medium">
                        All States
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{template.description}</p>
                </div>
              </div>
              <div className="mt-auto pt-1.5">
                <a
                  href={getMailtoLink(template)}
                  className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-medium text-xs transition-colors"
                >
                  Request Free Template
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700">
        <strong>Need a contract review?</strong> Find a real estate attorney at <a href="https://www.legalzoom.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">legalzoom.com</a>. For tax questions, visit <a href="https://www.hrblock.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">hrblock.com</a>.
      </div>
    </div>
  );
}
