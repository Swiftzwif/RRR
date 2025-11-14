import { describe, it, expect } from 'vitest';
import {
  scoreDomains,
  computeDomainAverages,
  overallAverage,
  avatarFromOverall,
  getLowestTwoDomains,
  labelForScore,
  getSuggestedActions,
  type Domain,
} from './scoring';

describe('computeDomainAverages', () => {
  it('should calculate correct domain averages', () => {
    const answers = {
      Q1: 3, Q2: 4, Q3: 5, // identity (avg: 4.0)
      Q4: 2, Q5: 3, // health (avg: 2.5)
      Q6: 5, Q7: 5, Q8: 5, // finances (avg: 5.0)
      Q9: 3, Q10: 3, Q11: 3, // relationships (avg: 3.0)
      Q12: 2, Q13: 2, // emotions (avg: 2.0)
      Q14: 4, Q15: 4, // focus (avg: 4.0)
    };

    const result = computeDomainAverages(answers);

    expect(result.identity).toBe(4.0);
    expect(result.health).toBe(2.5);
    expect(result.finances).toBe(5.0);
    expect(result.relationships).toBe(3.0);
    expect(result.emotions).toBe(2.0);
    expect(result.focus).toBe(4.0);
  });

  it('should handle all 1s (lowest possible scores)', () => {
    const answers = {
      Q1: 1, Q2: 1, Q3: 1,
      Q4: 1, Q5: 1,
      Q6: 1, Q7: 1, Q8: 1,
      Q9: 1, Q10: 1, Q11: 1,
      Q12: 1, Q13: 1,
      Q14: 1, Q15: 1,
    };

    const result = computeDomainAverages(answers);

    Object.values(result).forEach((score) => {
      expect(score).toBe(1.0);
    });
  });

  it('should handle all 5s (highest possible scores)', () => {
    const answers = {
      Q1: 5, Q2: 5, Q3: 5,
      Q4: 5, Q5: 5,
      Q6: 5, Q7: 5, Q8: 5,
      Q9: 5, Q10: 5, Q11: 5,
      Q12: 5, Q13: 5,
      Q14: 5, Q15: 5,
    };

    const result = computeDomainAverages(answers);

    Object.values(result).forEach((score) => {
      expect(score).toBe(5.0);
    });
  });

  it('should round to 2 decimal places', () => {
    const answers = {
      Q1: 3, Q2: 4, Q3: 5, // 12/3 = 4.0
      Q4: 2, Q5: 3, // 5/2 = 2.5
      Q6: 3, Q7: 4, Q8: 5, // 12/3 = 4.0
      Q9: 2, Q10: 3, Q11: 3, // 8/3 = 2.666... → 2.67
      Q12: 2, Q13: 3, // 5/2 = 2.5
      Q14: 3, Q15: 4, // 7/2 = 3.5
    };

    const result = computeDomainAverages(answers);

    expect(result.relationships).toBe(2.67);
  });

  it('should ignore unknown question IDs', () => {
    const answers = {
      Q1: 3, Q2: 4, Q3: 5,
      Q4: 2, Q5: 3,
      Q6: 5, Q7: 5, Q8: 5,
      Q9: 3, Q10: 3, Q11: 3,
      Q12: 2, Q13: 2,
      Q14: 4, Q15: 4,
      Q999: 1, // Should be ignored
    };

    const result = computeDomainAverages(answers);

    expect(result.identity).toBe(4.0);
  });
});

describe('overallAverage', () => {
  it('should calculate overall average correctly', () => {
    const domainAverages = {
      identity: 4.0,
      health: 2.5,
      finances: 5.0,
      relationships: 3.0,
      emotions: 2.0,
      focus: 4.0,
    };

    const result = overallAverage(domainAverages);

    // (4.0 + 2.5 + 5.0 + 3.0 + 2.0 + 4.0) / 6 = 3.416666...
    expect(result).toBeCloseTo(3.42, 2);
  });

  it('should handle all same scores', () => {
    const domainAverages = {
      identity: 3.0,
      health: 3.0,
      finances: 3.0,
      relationships: 3.0,
      emotions: 3.0,
      focus: 3.0,
    };

    const result = overallAverage(domainAverages);

    expect(result).toBe(3.0);
  });
});

describe('avatarFromOverall', () => {
  it('should assign Drifter for score 1.0', () => {
    expect(avatarFromOverall(1.0)).toBe('Drifter');
  });

  it('should assign Drifter for score 3.1', () => {
    expect(avatarFromOverall(3.1)).toBe('Drifter');
  });

  it('should assign Balancer for score 3.2', () => {
    expect(avatarFromOverall(3.2)).toBe('Balancer');
  });

  it('should assign Balancer for score 4.0', () => {
    expect(avatarFromOverall(4.0)).toBe('Balancer');
  });

  it('should assign Balancer for score 4.1', () => {
    expect(avatarFromOverall(4.1)).toBe('Balancer');
  });

  it('should assign Architect for score 4.2', () => {
    expect(avatarFromOverall(4.2)).toBe('Architect');
  });

  it('should assign Architect for score 5.0', () => {
    expect(avatarFromOverall(5.0)).toBe('Architect');
  });

  it('should handle edge case at Drifter/Balancer boundary', () => {
    expect(avatarFromOverall(3.10001)).toBe('Balancer');
    expect(avatarFromOverall(3.09999)).toBe('Drifter');
  });
});

describe('getLowestTwoDomains', () => {
  it('should return two lowest domains', () => {
    const domainAverages = {
      identity: 4.0,
      health: 2.5,
      finances: 5.0,
      relationships: 3.0,
      emotions: 2.0,
      focus: 4.0,
    };

    const result = getLowestTwoDomains(domainAverages);

    expect(result).toEqual(['emotions', 'health']);
  });

  it('should handle tie-breaking with TIE_BREAK_ORDER', () => {
    const domainAverages = {
      identity: 3.0,
      health: 3.0,
      finances: 3.0,
      relationships: 3.0,
      emotions: 3.0,
      focus: 3.0,
    };

    const result = getLowestTwoDomains(domainAverages);

    // Should follow TIE_BREAK_ORDER: identity, health, finances, relationships, emotions, focus
    expect(result).toEqual(['identity', 'health']);
  });

  it('should break tie correctly for partial ties', () => {
    const domainAverages = {
      identity: 3.0,
      health: 2.0,
      finances: 3.0,
      relationships: 4.0,
      emotions: 3.0,
      focus: 5.0,
    };

    const result = getLowestTwoDomains(domainAverages);

    // health is lowest (2.0), then identity (3.0, first in TIE_BREAK_ORDER)
    expect(result).toEqual(['health', 'identity']);
  });
});

describe('labelForScore', () => {
  it('should return Unacceptable for scores <= 3.1', () => {
    expect(labelForScore(1.0)).toBe('Unacceptable');
    expect(labelForScore(2.5)).toBe('Unacceptable');
    expect(labelForScore(3.1)).toBe('Unacceptable');
  });

  it('should return Acceptable for scores 3.2-4.1', () => {
    expect(labelForScore(3.2)).toBe('Acceptable');
    expect(labelForScore(3.7)).toBe('Acceptable');
    expect(labelForScore(4.1)).toBe('Acceptable');
  });

  it('should return Desirable for scores >= 4.2', () => {
    expect(labelForScore(4.2)).toBe('Desirable');
    expect(labelForScore(4.5)).toBe('Desirable');
    expect(labelForScore(5.0)).toBe('Desirable');
  });
});

describe('getSuggestedActions', () => {
  it('should return 3 seven-day actions (2 primary, 1 secondary)', () => {
    const lowestDomains: [Domain, Domain] = ['identity', 'health'];
    const result = getSuggestedActions(lowestDomains);

    expect(result.sevenDay).toHaveLength(3);
    expect(result.sevenDay[0]).toContain('Write down your top 3 values');
    expect(result.sevenDay[1]).toContain('Identify one daily choice');
    expect(result.sevenDay[2]).toContain('Go to bed 30 minutes earlier');
  });

  it('should return 3 thirty-day actions (2 primary, 1 secondary)', () => {
    const lowestDomains: [Domain, Domain] = ['finances', 'emotions'];
    const result = getSuggestedActions(lowestDomains);

    expect(result.thirtyDay).toHaveLength(3);
    expect(result.thirtyDay[0]).toContain('Create a monthly budget');
    expect(result.thirtyDay[1]).toContain('Build a 3-month emergency fund');
    expect(result.thirtyDay[2]).toContain('Develop emotional regulation');
  });

  it('should prioritize primary domain over secondary', () => {
    const lowestDomains: [Domain, Domain] = ['relationships', 'focus'];
    const result = getSuggestedActions(lowestDomains);

    // First 2 should be from relationships (primary)
    expect(result.sevenDay[0]).toContain('Reach out to one person');
    expect(result.sevenDay[1]).toContain('meaningful conversation');
    // Third should be from focus (secondary)
    expect(result.sevenDay[2]).toContain('Eliminate one major distraction');
  });
});

describe('scoreDomains (integration)', () => {
  it('should return complete scoring result', () => {
    const answers = {
      Q1: 3, Q2: 4, Q3: 5,
      Q4: 2, Q5: 3,
      Q6: 5, Q7: 5, Q8: 5,
      Q9: 3, Q10: 3, Q11: 3,
      Q12: 2, Q13: 2,
      Q14: 4, Q15: 4,
    };

    const result = scoreDomains(answers);

    expect(result).toHaveProperty('domainScores');
    expect(result).toHaveProperty('overall');
    expect(result).toHaveProperty('avatar');
    expect(result).toHaveProperty('lowestTwoDomains');

    expect(result.domainScores.identity).toBe(4.0);
    expect(result.domainScores.health).toBe(2.5);
    expect(result.overall).toBeCloseTo(3.42, 2);
    expect(result.avatar).toBe('Balancer');
    expect(result.lowestTwoDomains).toEqual(['emotions', 'health']);
  });

  it('should classify Drifter correctly', () => {
    const answers = {
      Q1: 2, Q2: 2, Q3: 2,
      Q4: 2, Q5: 2,
      Q6: 2, Q7: 2, Q8: 2,
      Q9: 2, Q10: 2, Q11: 2,
      Q12: 2, Q13: 2,
      Q14: 2, Q15: 2,
    };

    const result = scoreDomains(answers);

    expect(result.overall).toBe(2.0);
    expect(result.avatar).toBe('Drifter');
  });

  it('should classify Architect correctly', () => {
    const answers = {
      Q1: 5, Q2: 5, Q3: 5,
      Q4: 4, Q5: 4,
      Q6: 5, Q7: 5, Q8: 5,
      Q9: 4, Q10: 4, Q11: 4,
      Q12: 4, Q13: 5,
      Q14: 5, Q15: 5,
    };

    const result = scoreDomains(answers);

    expect(result.overall).toBeGreaterThanOrEqual(4.2);
    expect(result.avatar).toBe('Architect');
  });

  it('should round overall score to 2 decimal places', () => {
    const answers = {
      Q1: 3, Q2: 4, Q3: 5,
      Q4: 2, Q5: 3,
      Q6: 3, Q7: 4, Q8: 5,
      Q9: 2, Q10: 3, Q11: 3,
      Q12: 2, Q13: 3,
      Q14: 3, Q15: 4,
    };

    const result = scoreDomains(answers);

    // Overall should be rounded to 2 decimals
    expect(result.overall.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
  });
});
