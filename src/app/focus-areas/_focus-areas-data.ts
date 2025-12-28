export type FocusArea = {
  slug: string;
  title: string;
  summary: string;
  pillars: string[];
  commonQuestions: Array<{ q: string; a: string }>;
};

export const focusAreas: FocusArea[] = [
  {
    slug: 'taxpayer-rights-state-authority',
    title: 'Taxpayer Rights & State Authority',
    summary:
      'Clarifying what taxpayers are entitled to, what tax authorities may lawfully do, and where the limits of administrative power lie.',
    pillars: [
      'Rights, duties, and lawful expectations',
      'Scope and limits of tax authority powers',
      'Due process, transparency, and accountability',
      'Common triggers for disputes and how to prevent them',
    ],
    commonQuestions: [
      {
        q: 'What does “due process” mean in tax administration?',
        a: 'It means decisions (assessment, collection, enforcement) must follow the law and fair procedures—proper notice, reasons, timelines, and access to review/appeal where available.',
      },
      {
        q: 'Can a tax authority act outside its statutory powers?',
        a: 'No. Administrative powers exist only to the extent granted by law; actions beyond that scope are vulnerable to challenge through internal review and dispute resolution mechanisms.',
      },
    ],
  },
  {
    slug: 'tax-process-administration',
    title: 'Tax Process & Administration',
    summary:
      'A practical explanation of how tax works in real life—from registration and filing to assessment, audit, and enforcement—so obligations are predictable and manageable.',
    pillars: [
      'Registration, filing, and record-keeping',
      'Assessment mechanics and timelines',
      'Audit, information requests, and verification',
      'Enforcement pathways and compliance options',
    ],
    commonQuestions: [
      {
        q: 'How is an assessment typically raised and communicated?',
        a: 'Usually by formal notice stating the basis, amount, and timelines. Taxpayers should understand the stated grounds, request clarification where needed, and respond within prescribed time.',
      },
      {
        q: 'What should businesses do first when they receive an audit request?',
        a: 'Confirm scope and period, organize records, designate a point of contact, and respond in writing. The goal is accuracy and a clear paper trail.',
      },
    ],
  },
  {
    slug: 'dispute-prevention-resolution',
    title: 'Dispute Prevention & Resolution',
    summary:
      'Reducing conflict through clarity and early engagement, and explaining the formal dispute pathways when disagreements arise.',
    pillars: [
      'Pre-dispute risk spotting and documentation',
      'Administrative review and objection processes',
      'Settlement, mediation, and practical resolution',
      'Escalation pathways and decision points',
    ],
    commonQuestions: [
      {
        q: 'When should a taxpayer object to an assessment?',
        a: 'When the facts or law applied are wrong, incomplete, or unreasonable—especially if timelines are running. Objections should be structured and evidence-based.',
      },
      {
        q: 'Is settlement compatible with compliance?',
        a: 'Yes—where legally permitted. Settlement can reduce costs and uncertainty, provided it is transparent, properly documented, and within lawful boundaries.',
      },
    ],
  },
  {
    slug: 'tax-adjudication-insights',
    title: 'Tax Adjudication Insights',
    summary:
      'How tax disputes are decided—what adjudicators look for, how evidence is weighed, and what makes positions persuasive.',
    pillars: [
      'How tribunals/courts reason in tax matters',
      'Evidence, documentation, and burden of proof',
      'Procedural fairness and jurisdiction questions',
      'Practical lessons from decided disputes',
    ],
    commonQuestions: [
      {
        q: 'What usually determines outcomes in tax disputes?',
        a: 'A mix of clear facts, credible records, and correct legal interpretation. Poor documentation and inconsistent positions often undermine even valid arguments.',
      },
      {
        q: 'Does “technicality” matter in tax adjudication?',
        a: 'Procedure often matters because tax powers are statutory; failures in notice, timelines, or jurisdiction can invalidate actions even before the merits are reached.',
      },
    ],
  },
  {
    slug: 'tax-policy-governance',
    title: 'Tax Policy & Governance',
    summary:
      'Explaining the “why” behind tax rules—policy trade-offs, governance, accountability, and how reforms affect institutions and taxpayers.',
    pillars: [
      'Policy objectives and trade-offs',
      'Institutional roles and coordination',
      'Transparency, accountability, and trust',
      'Reform impact on taxpayers and administration',
    ],
    commonQuestions: [
      {
        q: 'Why do policy design and administration have to align?',
        a: 'Because good rules can fail if implementation is unclear or inconsistent. Alignment improves predictability, fairness, and voluntary compliance.',
      },
      {
        q: 'How does transparency affect compliance?',
        a: 'Transparent rules and processes reduce uncertainty and disputes, increase trust, and encourage voluntary compliance over fear-driven behavior.',
      },
    ],
  },
];

export function getFocusAreaBySlug(slug: string): FocusArea | undefined {
  return focusAreas.find((fa) => fa.slug === slug);
}




