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
  type Avatar,
  TIE_BREAK_ORDER,
} from './scoring';

describe('scoring.ts - CRITICAL BUSINESS LOGIC', () => {
  describe('computeDomainAverages', () => {
    it('should correctly compute domain averages for complete answers', () => {
      const answers = {
        Q1: 5, Q2: 4, Q3: 3, // identity: avg 4.0
        Q4: 2, Q5: 3,        // health: avg 2.5
        Q6: 5, Q7: 5, Q8: 5, // finances: avg 5.0
        Q9: 1, Q10: 2, Q11: 1, // relationships: avg 1.33
        Q12: 4, Q13: 4,      // emotions: avg 4.0
        Q14: 3, Q15: 3,      // focus: avg 3.0
      };

      const result = computeDomainAverages(answers);

      expect(result.identity).toBe(4.0);
      expect(result.health).toBe(2.5);
      expect(result.finances).toBe(5.0);
      expect(result.relationships).toBe(1.33);
      expect(result.emotions).toBe(4.0);
      expect(result.focus).toBe(3.0);
    });

    it('should handle partial answers (missing questions)', () => {
      const answers = {
        Q1: 5,           // identity: avg 5.0
        Q4: 3, Q5: 3,    // health: avg 3.0
      };

      const result = computeDomainAverages(answers);

      expect(result.identity).toBe(5.0);
      expect(result.health).toBe(3.0);
      expect(result.finances).toBe(0);
      expect(result.relationships).toBe(0);
      expect(result.emotions).toBe(0);
      expect(result.focus).toBe(0);
    });

    it('should round domain averages to 2 decimal places', () => {
      const answers = {
        Q1: 5, Q2: 4, Q3: 3, // identity: (5+4+3)/3 = 4.00
        Q9: 1, Q10: 2, Q11: 2, // relationships: (1+2+2)/3 = 1.67
      };

      const result = computeDomainAverages(answers);

      expect(result.identity).toBe(4.0);
      expect(result.relationships).toBe(1.67);
    });

    it('should ignore invalid question IDs', () => {
      const answers = {
        Q1: 5,
        Q99: 3, // Invalid question ID
        InvalidKey: 4,
      };

      const result = computeDomainAverages(answers);

      expect(result.identity).toBe(5.0);
      expect(result.health).toBe(0);
    });

    it('should handle all questions with same value', () => {
      const answers = {
        Q1: 3, Q2: 3, Q3: 3,
        Q4: 3, Q5: 3,
        Q6: 3, Q7: 3, Q8: 3,
        Q9: 3, Q10: 3, Q11: 3,
        Q12: 3, Q13: 3,
        Q14: 3, Q15: 3,
      };

      const result = computeDomainAverages(answers);

      Object.values(result).forEach((value) => {
        expect(value).toBe(3.0);
      });
    });

    it('should handle empty answers object', () => {
      const answers = {};
      const result = computeDomainAverages(answers);

      Object.values(result).forEach((value) => {
        expect(value).toBe(0);
      });
    });
  });

  describe('overallAverage', () => {
    it('should compute overall average correctly', () => {
      const domainScores: Record<Domain, number> = {
        identity: 4.0,
        health: 3.0,
        finances: 5.0,
        relationships: 2.0,
        emotions: 4.0,
        focus: 3.0,
      };

      const result = overallAverage(domainScores);

      // (4+3+5+2+4+3)/6 = 21/6 = 3.5
      expect(result).toBe(3.5);
    });

    it('should handle perfect scores', () => {
      const domainScores: Record<Domain, number> = {
        identity: 5.0,
        health: 5.0,
        finances: 5.0,
        relationships: 5.0,
        emotions: 5.0,
        focus: 5.0,
      };

      const result = overallAverage(domainScores);
      expect(result).toBe(5.0);
    });

    it('should handle minimum scores', () => {
      const domainScores: Record<Domain, number> = {
        identity: 1.0,
        health: 1.0,
        finances: 1.0,
        relationships: 1.0,
        emotions: 1.0,
        focus: 1.0,
      };

      const result = overallAverage(domainScores);
      expect(result).toBe(1.0);
    });

    it('should handle mixed scores', () => {
      const domainScores: Record<Domain, number> = {
        identity: 1.5,
        health: 2.5,
        finances: 3.5,
        relationships: 4.5,
        emotions: 3.0,
        focus: 2.0,
      };

      const result = overallAverage(domainScores);
      // (1.5+2.5+3.5+4.5+3.0+2.0)/6 = 17/6 = 2.833...
      expect(result).toBeCloseTo(2.83, 2);
    });
  });

  describe('avatarFromOverall', () => {
    it('should return Drifter for scores <= 3.1', () => {
      expect(avatarFromOverall(1.0)).toBe('Drifter');
      expect(avatarFromOverall(2.5)).toBe('Drifter');
      expect(avatarFromOverall(3.0)).toBe('Drifter');
      expect(avatarFromOverall(3.1)).toBe('Drifter');
    });

    it('should return Balancer for scores 3.2-4.1', () => {
      expect(avatarFromOverall(3.2)).toBe('Balancer');
      expect(avatarFromOverall(3.5)).toBe('Balancer');
      expect(avatarFromOverall(4.0)).toBe('Balancer');
      expect(avatarFromOverall(4.1)).toBe('Balancer');
    });

    it('should return Architect for scores >= 4.2', () => {
      expect(avatarFromOverall(4.2)).toBe('Architect');
      expect(avatarFromOverall(4.5)).toBe('Architect');
      expect(avatarFromOverall(5.0)).toBe('Architect');
    });

    it('should handle edge cases at boundaries', () => {
      expect(avatarFromOverall(3.1)).toBe('Drifter');
      expect(avatarFromOverall(3.15)).toBe('Balancer');
      expect(avatarFromOverall(4.1)).toBe('Balancer');
      expect(avatarFromOverall(4.15)).toBe('Architect');
    });

    it('should handle decimal precision correctly', () => {
      expect(avatarFromOverall(3.100001)).toBe('Balancer');
      expect(avatarFromOverall(4.099999)).toBe('Balancer');
      expect(avatarFromOverall(4.100001)).toBe('Architect'); // 4.1+ is Architect
    });
  });

  describe('getLowestTwoDomains', () => {
    it('should return the two lowest scoring domains', () => {
      const domainScores: Record<Domain, number> = {
        identity: 4.0,
        health: 2.0,      // 2nd lowest
        finances: 5.0,
        relationships: 1.5, // lowest
        emotions: 4.0,
        focus: 3.0,
      };

      const [lowest, secondLowest] = getLowestTwoDomains(domainScores);

      expect(lowest).toBe('relationships');
      expect(secondLowest).toBe('health');
    });

    it('should use tie-break order when scores are equal', () => {
      const domainScores: Record<Domain, number> = {
        identity: 2.0,
        health: 2.0,
        finances: 3.0,
        relationships: 3.0,
        emotions: 3.0,
        focus: 3.0,
      };

      const [lowest, secondLowest] = getLowestTwoDomains(domainScores);

      // Both are 2.0, should use TIE_BREAK_ORDER: identity comes before health
      expect(lowest).toBe('identity');
      expect(secondLowest).toBe('health');
    });

    it('should handle all domains with equal scores', () => {
      const domainScores: Record<Domain, number> = {
        identity: 3.0,
        health: 3.0,
        finances: 3.0,
        relationships: 3.0,
        emotions: 3.0,
        focus: 3.0,
      };

      const [lowest, secondLowest] = getLowestTwoDomains(domainScores);

      // Should return first two in TIE_BREAK_ORDER
      expect(lowest).toBe('identity');
      expect(secondLowest).toBe('health');
    });

    it('should correctly order with partial ties', () => {
      const domainScores: Record<Domain, number> = {
        identity: 1.5,
        health: 3.0,
        finances: 1.5,  // Tied with identity
        relationships: 4.0,
        emotions: 4.0,
        focus: 5.0,
      };

      const [lowest, secondLowest] = getLowestTwoDomains(domainScores);

      // Both identity and finances are 1.5
      // TIE_BREAK_ORDER: identity comes before finances
      expect(lowest).toBe('identity');
      expect(secondLowest).toBe('finances');
    });
  });

  describe('labelForScore', () => {
    it('should return "Unacceptable" for scores <= 3.1', () => {
      expect(labelForScore(1.0)).toBe('Unacceptable');
      expect(labelForScore(2.5)).toBe('Unacceptable');
      expect(labelForScore(3.0)).toBe('Unacceptable');
      expect(labelForScore(3.1)).toBe('Unacceptable');
    });

    it('should return "Acceptable" for scores 3.2-4.1', () => {
      expect(labelForScore(3.2)).toBe('Acceptable');
      expect(labelForScore(3.5)).toBe('Acceptable');
      expect(labelForScore(4.0)).toBe('Acceptable');
      expect(labelForScore(4.1)).toBe('Acceptable');
    });

    it('should return "Desirable" for scores >= 4.2', () => {
      expect(labelForScore(4.2)).toBe('Desirable');
      expect(labelForScore(4.5)).toBe('Desirable');
      expect(labelForScore(5.0)).toBe('Desirable');
    });
  });

  describe('getSuggestedActions', () => {
    it('should return correct actions for identity and health as lowest domains', () => {
      const lowestDomains: [Domain, Domain] = ['identity', 'health'];
      const result = getSuggestedActions(lowestDomains);

      expect(result.sevenDay).toHaveLength(3);
      expect(result.thirtyDay).toHaveLength(3);

      // Should have 2 from identity, 1 from health
      expect(result.sevenDay[0]).toContain('values');
      expect(result.sevenDay[1]).toContain('choice');
      expect(result.sevenDay[2]).toContain('bed');
    });

    it('should return correct actions for finances and relationships', () => {
      const lowestDomains: [Domain, Domain] = ['finances', 'relationships'];
      const result = getSuggestedActions(lowestDomains);

      expect(result.sevenDay).toHaveLength(3);
      expect(result.thirtyDay).toHaveLength(3);

      // Should have 2 from finances, 1 from relationships
      expect(result.sevenDay[0]).toContain('expenses');
      expect(result.sevenDay[1]).toContain('net worth');
      expect(result.sevenDay[2]).toContain('person');
    });

    it('should return correct actions for emotions and focus', () => {
      const lowestDomains: [Domain, Domain] = ['emotions', 'focus'];
      const result = getSuggestedActions(lowestDomains);

      expect(result.sevenDay).toHaveLength(3);
      expect(result.thirtyDay).toHaveLength(3);

      // Should have 2 from emotions, 1 from focus
      expect(result.sevenDay[0]).toContain('breathing');
      expect(result.sevenDay[1]).toContain('triggers');
      expect(result.sevenDay[2]).toContain('distraction');
    });

    it('should return different 7-day and 30-day actions', () => {
      const lowestDomains: [Domain, Domain] = ['identity', 'health'];
      const result = getSuggestedActions(lowestDomains);

      // Ensure they are different
      expect(result.sevenDay).not.toEqual(result.thirtyDay);

      // 7-day should be more immediate/tactical
      expect(result.sevenDay[0]).toContain('Write down');

      // 30-day should be more strategic/systemic
      expect(result.thirtyDay[0]).toContain('mission statement');
    });
  });

  describe('scoreDomains - INTEGRATION', () => {
    it('should compute complete scoring result for Drifter avatar', () => {
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
      expect(result.domainScores).toBeDefined();
      expect(result.lowestTwoDomains).toHaveLength(2);
    });

    it('should compute complete scoring result for Balancer avatar', () => {
      const answers = {
        Q1: 4, Q2: 4, Q3: 3,
        Q4: 4, Q5: 3,
        Q6: 4, Q7: 4, Q8: 3,
        Q9: 4, Q10: 3, Q11: 4,
        Q12: 4, Q13: 3,
        Q14: 4, Q15: 3,
      };

      const result = scoreDomains(answers);

      expect(result.overall).toBeGreaterThanOrEqual(3.2);
      expect(result.overall).toBeLessThanOrEqual(4.1);
      expect(result.avatar).toBe('Balancer');
    });

    it('should compute complete scoring result for Architect avatar', () => {
      const answers = {
        Q1: 5, Q2: 5, Q3: 5,
        Q4: 5, Q5: 5,
        Q6: 5, Q7: 5, Q8: 5,
        Q9: 5, Q10: 5, Q11: 5,
        Q12: 5, Q13: 5,
        Q14: 4, Q15: 4,
      };

      const result = scoreDomains(answers);

      expect(result.overall).toBeGreaterThanOrEqual(4.2);
      expect(result.avatar).toBe('Architect');
    });

    it('should round overall score to 2 decimal places', () => {
      const answers = {
        Q1: 3, Q2: 3, Q3: 3,
        Q4: 3, Q5: 3,
        Q6: 3, Q7: 3, Q8: 4,
        Q9: 3, Q10: 3, Q11: 3,
        Q12: 3, Q13: 3,
        Q14: 3, Q15: 3,
      };

      const result = scoreDomains(answers);

      // Overall should be a clean number with max 2 decimal places
      expect(result.overall.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });

    it('should handle edge case with minimal answers', () => {
      const answers = {
        Q1: 1,
      };

      const result = scoreDomains(answers);

      expect(result.domainScores.identity).toBe(1.0);
      expect(result.overall).toBeLessThanOrEqual(1.0);
      expect(result.avatar).toBe('Drifter');
      expect(result.lowestTwoDomains).toHaveLength(2);
    });

    it('should validate TIE_BREAK_ORDER constant', () => {
      expect(TIE_BREAK_ORDER).toEqual([
        'identity',
        'health',
        'finances',
        'relationships',
        'emotions',
        'focus',
      ]);
    });

    it('should handle real-world mixed scores correctly', () => {
      const answers = {
        Q1: 5, Q2: 4, Q3: 5,   // identity: 4.67
        Q4: 2, Q5: 3,           // health: 2.5
        Q6: 4, Q7: 3, Q8: 4,    // finances: 3.67
        Q9: 1, Q10: 2, Q11: 1,  // relationships: 1.33
        Q12: 4, Q13: 5,         // emotions: 4.5
        Q14: 3, Q15: 4,         // focus: 3.5
      };

      const result = scoreDomains(answers);

      expect(result.domainScores.relationships).toBe(1.33);
      expect(result.domainScores.health).toBe(2.5);
      expect(result.lowestTwoDomains[0]).toBe('relationships');
      expect(result.lowestTwoDomains[1]).toBe('health');
    });
  });
});
