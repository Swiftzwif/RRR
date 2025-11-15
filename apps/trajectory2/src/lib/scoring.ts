/**
 * Life domain types for the assessment system.
 * Each domain measures a key life pillar from 1-5.
 *
 * Domains:
 * - identity: Core values, self-concept, authenticity
 * - health: Physical wellbeing, sleep, exercise
 * - finances: Money management, wealth building, financial security
 * - relationships: Social connections, intimacy, community
 * - emotions: Emotional regulation, resilience, mental state
 * - focus: Attention, productivity, purpose clarity
 */
export type Domain = 'identity' | 'health' | 'finances' | 'relationships' | 'emotions' | 'focus';

/**
 * User avatar types based on overall assessment score.
 *
 * - Drifter: 1.0 - 3.1 (lost, lacking direction)
 * - Balancer: 3.2 - 4.1 (stable but not optimized)
 * - Architect: 4.2 - 5.0 (mastery, life by design)
 */
export type Avatar = 'Drifter' | 'Balancer' | 'Architect';

/**
 * Domain tie-breaking order for determining lowest two domains.
 * Used when domains have equal scores to ensure consistent results.
 */
export const TIE_BREAK_ORDER: Domain[] = [
  'identity', 'health', 'finances', 'relationships', 'emotions', 'focus'
];

/**
 * Result of the complete assessment scoring process.
 *
 * @interface ScoringResult
 * @property {Record<Domain, number>} domainScores - Average score (1-5) for each of 6 domains
 * @property {number} overall - Average of all domain scores (1-5)
 * @property {Avatar} avatar - User's avatar tier based on overall score
 * @property {[Domain, Domain]} lowestTwoDomains - Two lowest-scoring domains for intervention focus
 */
export interface ScoringResult {
  domainScores: Record<Domain, number>;
  overall: number;
  avatar: Avatar;
  lowestTwoDomains: [Domain, Domain];
}

/**
 * Main scoring function for assessment results.
 *
 * Orchestrates the complete scoring process:
 * 1. Computes average score for each of 6 domains from answers (Q1-Q15)
 * 2. Calculates overall score as average of all domain scores
 * 3. Assigns user avatar based on overall score tier
 * 4. Identifies two lowest domains for personalized recommendations
 *
 * @param answers - Object mapping question IDs (Q1-Q15) to numeric responses (1-5)
 * @returns Complete scoring result with all metrics
 *
 * @example
 * ```typescript
 * const result = scoreDomains({
 *   Q1: 4, Q2: 3, Q3: 5,  // identity
 *   Q4: 4, Q5: 3,          // health
 *   Q6: 2, Q7: 3, Q8: 2,  // finances
 *   Q9: 4, Q10: 3, Q11: 4, // relationships
 *   Q12: 3, Q13: 2,        // emotions
 *   Q14: 2, Q15: 3         // focus
 * });
 * // => {
 * //   domainScores: { identity: 4, health: 3.5, finances: 2.33, ... },
 * //   overall: 3.22,
 * //   avatar: 'Balancer',
 * //   lowestTwoDomains: ['finances', 'focus']
 * // }
 * ```
 */
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

/**
 * Computes average score for each domain from raw assessment answers.
 *
 * Maps each question (Q1-Q15) to its corresponding domain and calculates
 * the average score for all questions in that domain. Rounds to 2 decimal places.
 *
 * Question-to-domain mapping:
 * - Q1-Q3: identity
 * - Q4-Q5: health
 * - Q6-Q8: finances
 * - Q9-Q11: relationships
 * - Q12-Q13: emotions
 * - Q14-Q15: focus
 *
 * @param answers - Object mapping question IDs to numeric answers (1-5)
 * @returns Object with average score (0-5) for each of 6 domains
 *
 * @example
 * ```typescript
 * const scores = computeDomainAverages({
 *   Q1: 4, Q2: 3, Q3: 5,
 *   Q4: 2, Q5: 3,
 *   // ... other questions
 * });
 * // => { identity: 4, health: 2.5, finances: 3, relationships: 3, emotions: 3, focus: 3 }
 * ```
 */
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

/**
 * Calculates overall assessment score as the average of all domain scores.
 *
 * This represents the user's overall life management capability across all domains.
 * Used to determine avatar tier and intervention priority.
 *
 * @param domainAverages - Object with average score for each of 6 domains (1-5)
 * @returns Overall score, average of all domains (1-5)
 */
export function overallAverage(domainAverages: Record<Domain, number>): number {
  const values = Object.values(domainAverages);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Assigns user avatar type based on overall assessment score.
 *
 * Avatar tiers reflect user's current life stage and readiness:
 * - Drifter (1.0–3.1): Lost, reactive, lacking clear direction
 * - Balancer (3.2–4.1): Stable and functional but not optimized
 * - Architect (4.2–5.0): Mastery level, intentional life design
 *
 * @param overall - Overall assessment score (1.0 - 5.0)
 * @returns Avatar type representing user's life management tier
 *
 * @example
 * ```typescript
 * assignAvatar(2.5);  // => 'Drifter'
 * assignAvatar(3.7);  // => 'Balancer'
 * assignAvatar(4.5);  // => 'Architect'
 * ```
 */
export function avatarFromOverall(overall: number): Avatar {
  // Drifter 1.0–3.1, Balancer 3.2–4.1, Architect 4.2–5.0
  if (overall <= 3.1) return 'Drifter';
  if (overall <= 4.1) return 'Balancer';
  return 'Architect';
}

/**
 * Identifies the two lowest-scoring domains to focus intervention efforts.
 *
 * Domains are sorted by score (ascending), with ties broken by TIE_BREAK_ORDER.
 * This ensures consistent, reproducible results even when scores are equal.
 * The two lowest domains become the focus for personalized action recommendations.
 *
 * @param domainAverages - Object with average score for each domain
 * @returns Tuple of [lowestDomain, secondLowestDomain]
 *
 * @example
 * ```typescript
 * getLowestTwoDomains({
 *   identity: 4, health: 3.5, finances: 2, relationships: 3,
 *   emotions: 3, focus: 2.5
 * });
 * // => ['finances', 'focus']
 * ```
 */
export function getLowestTwoDomains(domainAverages: Record<Domain, number>): [Domain, Domain] {
  const sorted = Object.entries(domainAverages).sort((a, b) => {
    const scoreDiff = a[1] - b[1];
    if (scoreDiff !== 0) return scoreDiff;
    return TIE_BREAK_ORDER.indexOf(a[0] as Domain) - TIE_BREAK_ORDER.indexOf(b[0] as Domain);
  });
  
  return [sorted[0][0] as Domain, sorted[1][0] as Domain];
}

/**
 * Labels a domain score with a performance tier.
 *
 * Provides user-friendly interpretation of domain scores:
 * - Unacceptable (≤3.1): Requires immediate intervention
 * - Acceptable (3.2–4.1): Functional but room for growth
 * - Desirable (≥4.2): Mastery and optimization level
 *
 * @param score - Domain score (1-5)
 * @returns Performance label
 */
export function labelForScore(score: number): 'Unacceptable' | 'Acceptable' | 'Desirable' {
  if (score <= 3.1) return 'Unacceptable';
  if (score <= 4.1) return 'Acceptable';
  return 'Desirable';
}

/**
 * Generates personalized action recommendations based on lowest-scoring domains.
 *
 * Creates a 7-day quick-win action plan and 30-day deep transformation plan
 * tailored to the user's two lowest domains. Actions are domain-specific and
 * pragmatic, designed for immediate implementation.
 *
 * Recommendations follow the pattern:
 * - 7-day: Quick wins (habit starters, immediate actions)
 * - 30-day: Sustainable transformation (systems, deep changes)
 *
 * @param lowestDomains - Tuple of [lowestDomain, secondLowestDomain]
 * @returns Object with array of 7-day and 30-day actions
 *
 * @example
 * ```typescript
 * getSuggestedActions(['finances', 'focus']);
 * // => {
 * //   sevenDay: [
 * //     'Track all expenses for one week',
 * //     'Calculate your net worth',
 * //     'Eliminate one major distraction'
 * //   ],
 * //   thirtyDay: [
 * //     'Create a monthly budget',
 * //     'Build a 3-month emergency fund',
 * //     'Establish a daily priority-setting routine'
 * //   ]
 * // }
 * ```
 */
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
