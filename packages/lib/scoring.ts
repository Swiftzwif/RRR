export type Domain = 'identity' | 'health' | 'finances' | 'relationships' | 'emotions' | 'focus';
export type Avatar = 'Drifter' | 'Balancer' | 'Architect';

export const TIE_BREAK_ORDER: Domain[] = [
  'identity', 'health', 'finances', 'relationships', 'emotions', 'focus'
];

export interface ScoringResult {
  domainScores: Record<Domain, number>;
  overall: number;
  avatar: Avatar;
  lowestTwoDomains: [Domain, Domain];
}

// Main scoring function
export function scoreDomains(answers: Record<string, number>): ScoringResult {
  const domainScores = computeDomainAverages(answers);
  const overall = overallAverage(domainScores);
  const avatar = avatarFromOverall(overall);
  const lowestTwoDomains = getLowestTwoDomains(domainScores);

  return {
    domainScores,
    overall: Number(overall.toFixed(2)),
    avatar,
    lowestTwoDomains,
  };
}

export function computeDomainAverages(answers: Record<string, number>): Record<Domain, number> {
  // Map question IDs to domains based on the questions.json structure
  const questionMap: Record<string, Domain> = {
    'Q1': 'identity', 'Q2': 'identity', 'Q3': 'identity',
    'Q4': 'health', 'Q5': 'health',
    'Q6': 'finances', 'Q7': 'finances', 'Q8': 'finances',
    'Q9': 'relationships', 'Q10': 'relationships', 'Q11': 'relationships',
    'Q12': 'emotions', 'Q13': 'emotions',
    'Q14': 'focus', 'Q15': 'focus',
  };

  const byDomain: Record<Domain, number[]> = {
    identity: [], health: [], finances: [], relationships: [], emotions: [], focus: []
  };

  for (const [qid, val] of Object.entries(answers)) {
    const domain = questionMap[qid];
    if (domain) byDomain[domain].push(val);
  }

  return Object.fromEntries(
    Object.entries(byDomain).map(([domain, values]) => [
      domain, 
      values.length ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)) : 0
    ])
  ) as Record<Domain, number>;
}

export function overallAverage(domainAverages: Record<Domain, number>): number {
  const values = Object.values(domainAverages);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function avatarFromOverall(overall: number): Avatar {
  // Drifter 1.0–3.1, Balancer 3.2–4.1, Architect 4.2–5.0
  if (overall <= 3.1) return 'Drifter';
  if (overall <= 4.1) return 'Balancer';
  return 'Architect';
}

export function getLowestTwoDomains(domainAverages: Record<Domain, number>): [Domain, Domain] {
  const sorted = Object.entries(domainAverages).sort((a, b) => {
    const scoreDiff = a[1] - b[1];
    if (scoreDiff !== 0) return scoreDiff;
    return TIE_BREAK_ORDER.indexOf(a[0] as Domain) - TIE_BREAK_ORDER.indexOf(b[0] as Domain);
  });
  
  return [sorted[0][0] as Domain, sorted[1][0] as Domain];
}

export function labelForScore(score: number): 'Unacceptable' | 'Acceptable' | 'Desirable' {
  if (score <= 3.1) return 'Unacceptable';
  if (score <= 4.1) return 'Acceptable';
  return 'Desirable';
}

// Get suggested actions based on lowest domains
export function getSuggestedActions(lowestDomains: [Domain, Domain]): {
  sevenDay: string[];
  thirtyDay: string[];
} {
  const actionMap: Record<Domain, { sevenDay: string[]; thirtyDay: string[] }> = {
    identity: {
      sevenDay: [
        'Write down your top 3 values',
        'Identify one daily choice that aligns with your values',
        'Practice positive self-talk for 5 minutes daily'
      ],
      thirtyDay: [
        'Create a personal mission statement',
        'Set 3 identity-aligned goals for the next quarter',
        'Establish a daily values check-in routine'
      ]
    },
    health: {
      sevenDay: [
        'Go to bed 30 minutes earlier',
        'Take a 10-minute walk daily',
        'Drink one extra glass of water each day'
      ],
      thirtyDay: [
        'Establish a consistent sleep schedule',
        'Create a sustainable exercise routine',
        'Develop stress management techniques'
      ]
    },
    finances: {
      sevenDay: [
        'Track all expenses for one week',
        'Calculate your net worth',
        'Set up automatic savings transfer'
      ],
      thirtyDay: [
        'Create a monthly budget',
        'Build a 3-month emergency fund',
        'Start investing in your future'
      ]
    },
    relationships: {
      sevenDay: [
        'Reach out to one person who lifts your energy',
        'Have one meaningful conversation',
        'Express gratitude to someone important'
      ],
      thirtyDay: [
        'Strengthen relationships with positive people',
        'Address one relationship tension with care',
        'Find a mentor or accountability partner'
      ]
    },
    emotions: {
      sevenDay: [
        'Practice 5 minutes of deep breathing daily',
        'Identify your emotional triggers',
        'Use the 5-4-3-2-1 grounding technique'
      ],
      thirtyDay: [
        'Develop emotional regulation strategies',
        'Practice mindfulness meditation',
        'Create an emotional support system'
      ]
    },
    focus: {
      sevenDay: [
        'Eliminate one major distraction',
        'Use the Pomodoro technique for focused work',
        'Create a distraction-free workspace'
      ],
      thirtyDay: [
        'Establish a daily priority-setting routine',
        'Implement time-blocking for important tasks',
        'Develop systems to minimize decision fatigue'
      ]
    }
  };

  const [primary, secondary] = lowestDomains;
  
  return {
    sevenDay: [
      ...actionMap[primary].sevenDay.slice(0, 2),
      ...actionMap[secondary].sevenDay.slice(0, 1)
    ],
    thirtyDay: [
      ...actionMap[primary].thirtyDay.slice(0, 2),
      ...actionMap[secondary].thirtyDay.slice(0, 1)
    ]
  };
}
